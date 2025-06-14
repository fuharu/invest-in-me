import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { schoolInfo, skills, passion } = await request.json();

    const prompt = `
以下の学生の情報を分析し、教育投資の観点から詳細な評価を行ってください。

【基本情報】
学校名: ${schoolInfo.schoolName}
学部: ${schoolInfo.department}
学年: ${schoolInfo.grade}
専攻: ${schoolInfo.major}
GPA: ${schoolInfo.gpa}

【スキル・実績】
取得資格: ${skills.certifications.join(', ')}
プログラミングスキル: ${skills.programmingSkills.join(', ')}
インターン経験: ${skills.internshipExperience.join(', ')}
コンテスト実績: ${skills.contestAchievements.join(', ')}

【熱意・目標】
現在の取り組み: ${passion.currentProjects.join(', ')}
目標年収: ${passion.futureGoals.targetIncome}万円
目標キャリア: ${passion.futureGoals.targetCareer}

以下の項目について、具体的な数値や事実に基づいて分析してください：

1. 学業面での強み
- 現在の学業成績の評価
- 専攻分野での将来性
- 学業面での改善点

2. スキル面での強み
- 技術スキルの市場価値
- 実務経験の質と量
- スキル面での改善点

3. 将来性の分析
- 目標キャリアの実現可能性
- 目標年収の達成可能性
- 市場での競争力

4. 教育投資の価値
- 投資対効果の予測
- リスク要因の分析
- 具体的な投資提案

5. 総合評価
- 強みの総合評価
- 改善が必要な点
- 具体的なアクションプラン

各項目について、以下の形式で回答してください：
- 評価: [S/A/B/C/D]
- 根拠: [具体的な理由]
- 提案: [具体的な改善案]

回答は箇条書きで簡潔に、かつ具体的な数値や事実に基づいて記述してください。
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "あなたは教育投資の専門家です。学生の情報を分析し、具体的な数値や事実に基づいて、教育投資の価値を評価します。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const analysis = completion.choices[0].message.content;

    // 分析結果を構造化
    const structuredAnalysis = {
      academicStrengths: {
        evaluation: '',
        basis: '',
        suggestions: [] as string[]
      },
      skillStrengths: {
        evaluation: '',
        basis: '',
        suggestions: [] as string[]
      },
      futurePotential: {
        evaluation: '',
        basis: '',
        suggestions: [] as string[]
      },
      investmentValue: {
        evaluation: '',
        basis: '',
        suggestions: [] as string[]
      },
      overallAssessment: {
        evaluation: '',
        basis: '',
        suggestions: [] as string[]
      }
    };

    // 分析結果をパースして構造化データに変換
    if (analysis) {
      const sections = analysis.split('\n\n');
      sections.forEach(section => {
        if (section.includes('学業面での強み')) {
          structuredAnalysis.academicStrengths = parseSection(section);
        } else if (section.includes('スキル面での強み')) {
          structuredAnalysis.skillStrengths = parseSection(section);
        } else if (section.includes('将来性の分析')) {
          structuredAnalysis.futurePotential = parseSection(section);
        } else if (section.includes('教育投資の価値')) {
          structuredAnalysis.investmentValue = parseSection(section);
        } else if (section.includes('総合評価')) {
          structuredAnalysis.overallAssessment = parseSection(section);
        }
      });
    }

    return NextResponse.json({ 
      analysis,
      structuredAnalysis
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: '分析に失敗しました' },
      { status: 500 }
    );
  }
}

function parseSection(section: string) {
  const lines = section.split('\n');
  const result = {
    evaluation: '',
    basis: '',
    suggestions: [] as string[]
  };

  lines.forEach(line => {
    if (line.includes('評価:')) {
      result.evaluation = line.split('評価:')[1].trim();
    } else if (line.includes('根拠:')) {
      result.basis = line.split('根拠:')[1].trim();
    } else if (line.includes('提案:')) {
      result.suggestions.push(line.split('提案:')[1].trim());
    }
  });

  return result;
} 