import OpenAI from 'openai';
import { NextResponse } from 'next/server';

// OpenAI APIの初期化
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('OPENAI_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: apiKey,
});

// リトライ関数
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function generateWithRetry(prompt: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "あなたは教育投資の専門家です。学生の情報を分析し、親への説得材料を提供します。"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });
      return completion;
    } catch (error: any) {
      console.error('Attempt', i + 1, 'failed:', error.message);
      if (error.message.includes('429') && i < maxRetries - 1) {
        // レート制限エラーの場合、待機して再試行
        await sleep(15000); // 15秒待機
        continue;
      }
      throw error;
    }
  }
  throw new Error('最大リトライ回数を超えました');
}

export async function POST(request: Request) {
  try {
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }

    const data = await request.json();

    // プロンプトの作成
    const prompt = `
以下の情報を元に、この学生の強みと将来性を分析し、親への説得材料として活用できるポイントを3つ挙げてください。
また、教育投資の価値についても言及してください。

【基本情報】
学校：${data.schoolInfo.schoolName}
学部：${data.schoolInfo.department}
専攻：${data.schoolInfo.major}
GPA：${data.schoolInfo.gpa}

【スキル・経歴】
取得資格：${data.skills.certifications.join(', ')}
プログラミングスキル：${data.skills.programmingSkills.join(', ')}
インターン経験：${data.skills.internshipExperience.join(', ')}
コンテスト実績：${data.skills.contestAchievements.join(', ')}

【熱意】
現在のプロジェクト：${data.passion.currentProjects.join(', ')}
目標年収：${data.passion.futureGoals.targetIncome}万円
目標職業：${data.passion.futureGoals.targetCareer}

分析は以下の形式で日本語で出力してください：
1. 強みと将来性
2. 親への説得ポイント（3点）
3. 教育投資の価値
`;

    console.log('Sending request to OpenAI API...');
    const completion = await generateWithRetry(prompt);
    console.log('Received response from OpenAI API');
    
    const analysis = completion.choices[0].message.content;
    console.log('Generated text:', analysis?.substring(0, 100) + '...');

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Analysis error:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json(
      { 
        error: '分析中にエラーが発生しました',
        details: error instanceof Error ? error.message : '不明なエラー'
      },
      { status: 500 }
    );
  }
} 