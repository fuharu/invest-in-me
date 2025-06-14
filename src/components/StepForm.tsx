import React, { useState, useEffect } from 'react';
import { InvestmentAnalysis } from './InvestmentAnalysis';
import { AIAnalysis } from './AIAnalysis';
import { saveShareData } from '../lib/share';

const steps = [
  '自己紹介',
  'スキル・経歴',
  '熱意',
  '教育コスト',
  '確認・完了'
];

const StepProgressBar: React.FC<{ currentStep: number }> = ({ currentStep }) => (
  <div className="flex items-center justify-center mb-8">
    {steps.map((label, idx) => (
      <React.Fragment key={label}>
        <div className={`flex flex-col items-center ${idx < currentStep ? 'text-indigo-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${idx <= currentStep ? 'border-indigo-600 bg-indigo-100' : 'border-gray-300 bg-white'}`}>{idx + 1}</div>
          <span className="text-xs mt-1">{label}</span>
        </div>
        {idx < steps.length - 1 && (
          <div className={`flex-1 h-1 mx-2 ${idx < currentStep ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
        )}
      </React.Fragment>
    ))}
  </div>
);

interface StepFormProps {
  currentStep: number;
  totalSteps: number;
  onNext: (data: any) => void;
  onBack: () => void;
  initialData?: any;
}

export const StepForm: React.FC<StepFormProps> = ({ currentStep, totalSteps, onNext, onBack, initialData }) => {
  // 各ステップの入力値
  const [profile, setProfile] = useState({
    school: initialData?.school || '',
    department: initialData?.department || '',
    grade: initialData?.grade || '',
    major: initialData?.major || '',
    gpa: initialData?.gpa || '',
  });
  const [skills, setSkills] = useState({
    certifications: initialData?.certifications || '',
    programming: initialData?.programming || '',
    internship: initialData?.internship || '',
    contest: initialData?.contest || '',
  });
  const [passion, setPassion] = useState({
    current: initialData?.current || '',
    goal: initialData?.goal || '',
    targetIncome: initialData?.targetIncome || '',
  });
  const [cost, setCost] = useState({
    past: initialData?.past || '',
    future: initialData?.future || '',
  });
  const [profileError, setProfileError] = useState<any>({});
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [structuredAnalysis, setStructuredAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  // initialDataが変わったらstateも同期
  useEffect(() => {
    setProfile({
      school: initialData?.school || '',
      department: initialData?.department || '',
      grade: initialData?.grade || '',
      major: initialData?.major || '',
      gpa: initialData?.gpa || '',
    });
    setSkills({
      certifications: initialData?.certifications || '',
      programming: initialData?.programming || '',
      internship: initialData?.internship || '',
      contest: initialData?.contest || '',
    });
    setPassion({
      current: initialData?.current || '',
      goal: initialData?.goal || '',
      targetIncome: initialData?.targetIncome || '',
    });
    setCost({
      past: initialData?.past || '',
      future: initialData?.future || '',
    });
  }, [initialData]);

  // バリデーション関数
  const validateProfile = () => {
    const errors: any = {};
    if (!profile.school) errors.school = '学校名は必須です';
    if (!profile.department) errors.department = '学部は必須です';
    if (!profile.grade) errors.grade = '学年は必須です';
    if (!profile.major) errors.major = '専攻は必須です';
    if (!profile.gpa) errors.gpa = 'GPAは必須です';
    return errors;
  };

  // ステップごとのフォーム内容
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">自己紹介</h3>
            <div className="mb-2 flex items-center">
              <label className="w-24 text-gray-700">学校名</label>
              <input className="flex-1 block w-full mb-1" placeholder="学校名" value={profile.school || ''} onChange={e => setProfile({ ...profile, school: e.target.value })} />
            </div>
            {profileError.school && <div className="text-red-500 text-xs mb-2">{profileError.school}</div>}
            <div className="mb-2 flex items-center">
              <label className="w-24 text-gray-700">学部</label>
              <input className="flex-1 block w-full mb-1" placeholder="学部" value={profile.department || ''} onChange={e => setProfile({ ...profile, department: e.target.value })} />
            </div>
            {profileError.department && <div className="text-red-500 text-xs mb-2">{profileError.department}</div>}
            <div className="mb-2 flex items-center">
              <label className="w-24 text-gray-700">学年</label>
              <input className="flex-1 block w-full mb-1" placeholder="学年" value={profile.grade || ''} onChange={e => setProfile({ ...profile, grade: e.target.value })} />
            </div>
            {profileError.grade && <div className="text-red-500 text-xs mb-2">{profileError.grade}</div>}
            <div className="mb-2 flex items-center">
              <label className="w-24 text-gray-700">専攻</label>
              <input className="flex-1 block w-full mb-1" placeholder="専攻" value={profile.major || ''} onChange={e => setProfile({ ...profile, major: e.target.value })} />
            </div>
            {profileError.major && <div className="text-red-500 text-xs mb-2">{profileError.major}</div>}
            <div className="mb-2 flex items-center">
              <label className="w-24 text-gray-700">GPA</label>
              <input className="flex-1 block w-full mb-1" placeholder="GPA" value={profile.gpa || ''} onChange={e => setProfile({ ...profile, gpa: e.target.value })} />
            </div>
            {profileError.gpa && <div className="text-red-500 text-xs mb-2">{profileError.gpa}</div>}
          </div>
        );
      case 1:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">スキル・経歴</h3>
            <div className="mb-2 flex items-center">
              <label className="w-32 text-gray-700">取得資格</label>
              <input className="flex-1 block w-full mb-1" placeholder="取得資格" value={skills.certifications || ''} onChange={e => setSkills({ ...skills, certifications: e.target.value })} />
            </div>
            <div className="mb-2 flex items-center">
              <label className="w-32 text-gray-700">プログラミングスキル</label>
              <input className="flex-1 block w-full mb-1" placeholder="プログラミングスキル" value={skills.programming || ''} onChange={e => setSkills({ ...skills, programming: e.target.value })} />
            </div>
            <div className="mb-2 flex items-center">
              <label className="w-32 text-gray-700">インターン経験</label>
              <input className="flex-1 block w-full mb-1" placeholder="インターン経験" value={skills.internship || ''} onChange={e => setSkills({ ...skills, internship: e.target.value })} />
            </div>
            <div className="mb-2 flex items-center">
              <label className="w-32 text-gray-700">コンテスト入賞歴</label>
              <input className="flex-1 block w-full mb-1" placeholder="コンテスト入賞歴" value={skills.contest || ''} onChange={e => setSkills({ ...skills, contest: e.target.value })} />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">熱意</h3>
            <div className="mb-2 flex items-center">
              <label className="w-32 text-gray-700">今取り組んでいること</label>
              <input className="flex-1 block w-full mb-1" placeholder="今取り組んでいること" value={passion.current || ''} onChange={e => setPassion({ ...passion, current: e.target.value })} />
            </div>
            <div className="mb-2 flex items-center">
              <label className="w-32 text-gray-700">将来の目標</label>
              <input className="flex-1 block w-full mb-1" placeholder="将来の目標" value={passion.goal || ''} onChange={e => setPassion({ ...passion, goal: e.target.value })} />
            </div>
            <div className="mb-2 flex items-center">
              <label className="w-32 text-gray-700">目標年収（万円）</label>
              <input
                type="number"
                className="flex-1 block w-full mb-1"
                placeholder="例: 600"
                value={passion.targetIncome || ''}
                onChange={e => setPassion({ ...passion, targetIncome: e.target.value })}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">教育コスト</h3>
            <div className="mb-2 flex items-center">
              <label className="w-40 text-gray-700">これまでの教育コスト（万円）</label>
              <input className="flex-1 block w-full mb-1" placeholder="これまでの教育コスト（万円）" value={cost.past || ''} onChange={e => setCost({ ...cost, past: e.target.value })} />
            </div>
            <div className="mb-2 flex items-center">
              <label className="w-40 text-gray-700">今後の教育コスト（万円）</label>
              <input className="flex-1 block w-full mb-1" placeholder="今後の教育コスト（万円）" value={cost.future || ''} onChange={e => setCost({ ...cost, future: e.target.value })} />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-4">入力内容の確認・完了</h3>
            <div className="mb-6 text-left">
              <h4 className="font-bold mb-2">入力内容プレビュー</h4>
              <ul className="text-sm">
                <li>学校名: {profile.school}</li>
                <li>学部: {profile.department}</li>
                <li>学年: {profile.grade}</li>
                <li>専攻: {profile.major}</li>
                <li>GPA: {profile.gpa}</li>
                <li>取得資格: {skills.certifications}</li>
                <li>プログラミングスキル: {skills.programming}</li>
                <li>インターン経験: {skills.internship}</li>
                <li>コンテスト入賞歴: {skills.contest}</li>
                <li>今取り組んでいること: {passion.current}</li>
                <li>将来の目標: {passion.goal}</li>
                <li>目標年収（万円）: {passion.targetIncome}</li>
                <li>これまでの教育コスト: {cost.past}</li>
                <li>今後の教育コスト: {cost.future}</li>
              </ul>
            </div>
            <div className="mb-6">
              <button
                className="px-6 py-2 bg-green-600 text-white rounded mr-2"
                onClick={async () => {
                  setIsSharing(true);
                  const id = await saveShareData({
                    profile, skills, passion, cost, aiAnalysis
                  });
                  setShareUrl(`${window.location.origin}/result/share/${id}`);
                  setIsSharing(false);
                }}
                disabled={isSharing}
              >
                {isSharing ? '発行中...' : '共有リンクを発行'}
              </button>
              {shareUrl && (
                <div className="mt-4">
                  <input className="w-full p-2 border rounded" value={shareUrl} readOnly />
                  <button
                    className="mt-2 px-4 py-1 bg-blue-600 text-white rounded"
                    onClick={() => navigator.clipboard.writeText(shareUrl)}
                  >
                    コピー
                  </button>
                </div>
              )}
            </div>
            <button
              className="px-6 py-2 bg-indigo-600 text-white rounded mb-6"
              onClick={async () => {
                setIsAnalyzing(true);
                setAiAnalysis('');
                setStructuredAnalysis(null);
                // AI分析APIにリクエスト
                const res = await fetch('/api/analyze', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    schoolInfo: {
                      schoolName: profile.school,
                      department: profile.department,
                      grade: profile.grade,
                      major: profile.major,
                      gpa: profile.gpa,
                    },
                    skills: {
                      certifications: skills.certifications.split(','),
                      programmingSkills: skills.programming.split(','),
                      internshipExperience: skills.internship.split(','),
                      contestAchievements: skills.contest.split(','),
                    },
                    passion: {
                      currentProjects: passion.current.split(','),
                      futureGoals: {
                        targetIncome: Number(passion.targetIncome) || 0,
                        targetCareer: passion.goal,
                      },
                    },
                  }),
                });
                const data = await res.json();
                setAiAnalysis(data.analysis || '分析に失敗しました');
                setStructuredAnalysis(data.structuredAnalysis);
                setIsAnalyzing(false);
              }}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'AI分析中...' : 'AI分析を実行'}
            </button>

            <button
              className="px-6 py-2 bg-green-600 text-white rounded mb-6 ml-4"
              onClick={() => {
                const data = { ...profile, ...skills, ...passion, ...cost };
                localStorage.setItem('formData', JSON.stringify(data));
                window.location.href = '/analysis';
              }}
            >
              分析結果を確認する
            </button>
            
            {aiAnalysis && <AIAnalysis analysis={aiAnalysis} structuredAnalysis={structuredAnalysis} />}
            <InvestmentAnalysis
              pastEducationCost={Number(cost.past) || 0}
              futureEducationCost={Number(cost.future) || 0}
              targetIncome={Number(passion.targetIncome) || 0}
              onBack={() => {}}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const handleNext = () => {
    const data = { ...profile, ...skills, ...passion,...cost };
    onNext(data);
  };

  const handleBack = () => {
    onBack();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <StepProgressBar currentStep={currentStep} />
      {renderStep()}
      <div className="flex justify-between mt-8">
        <button
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          戻る
        </button>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
        >
          {currentStep === steps.length - 1 ? '完了' : '次へ'}
        </button>
      </div>
    </div>
  );
}; 