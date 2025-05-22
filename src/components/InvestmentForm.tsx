import React, { useState } from 'react';

interface InvestmentFormData {
  pastEducationCost: number;
  futureEducationCost: number;
  schoolInfo: {
    schoolName: string;
    department: string;
    grade: string;
    major: string;
    gpa: number;
  };
  skills: {
    certifications: string[];
    programmingSkills: string[];
    internshipExperience: string[];
    contestAchievements: string[];
  };
  passion: {
    currentProjects: string[];
    futureGoals: {
      targetIncome: number;
      targetCareer: string;
    };
  };
}

interface InvestmentFormProps {
  onSubmit: (data: InvestmentFormData) => void;
}

export const InvestmentForm: React.FC<InvestmentFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<InvestmentFormData>({
    pastEducationCost: 0,
    futureEducationCost: 0,
    schoolInfo: {
      schoolName: '',
      department: '',
      grade: '',
      major: '',
      gpa: 0,
    },
    skills: {
      certifications: [],
      programmingSkills: [],
      internshipExperience: [],
      contestAchievements: [],
    },
    passion: {
      currentProjects: [],
      futureGoals: {
        targetIncome: 0,
        targetCareer: '',
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">投資提案フォーム</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">教育コスト</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                これまでの教育コスト（万円）
              </label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.pastEducationCost === 0 ? '' : formData.pastEducationCost}
                onFocus={e => { if (formData.pastEducationCost === 0) e.target.value = ''; }}
                onBlur={e => { if (e.target.value === '') setFormData({ ...formData, pastEducationCost: 0 }); }}
                onChange={(e) => setFormData({
                  ...formData,
                  pastEducationCost: Number(e.target.value)
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                今後の教育コスト（万円）
              </label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.futureEducationCost === 0 ? '' : formData.futureEducationCost}
                onFocus={e => { if (formData.futureEducationCost === 0) e.target.value = ''; }}
                onBlur={e => { if (e.target.value === '') setFormData({ ...formData, futureEducationCost: 0 }); }}
                onChange={(e) => setFormData({
                  ...formData,
                  futureEducationCost: Number(e.target.value)
                })}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">自己紹介</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                学校名
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.schoolInfo.schoolName}
                onChange={(e) => setFormData({
                  ...formData,
                  schoolInfo: {
                    ...formData.schoolInfo,
                    schoolName: e.target.value
                  }
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                学部
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.schoolInfo.department}
                onChange={(e) => setFormData({
                  ...formData,
                  schoolInfo: {
                    ...formData.schoolInfo,
                    department: e.target.value
                  }
                })}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">スキル・経歴</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                取得資格（カンマ区切りで入力）
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.skills.certifications.join(', ')}
                onChange={(e) => setFormData({
                  ...formData,
                  skills: {
                    ...formData.skills,
                    certifications: e.target.value.split(',').map(s => s.trim())
                  }
                })}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">熱意</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                目標年収（万円）
              </label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.passion.futureGoals.targetIncome}
                onChange={(e) => setFormData({
                  ...formData,
                  passion: {
                    ...formData.passion,
                    futureGoals: {
                      ...formData.passion.futureGoals,
                      targetIncome: Number(e.target.value)
                    }
                  }
                })}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            分析を開始
          </button>
        </div>
      </form>
    </div>
  );
}; 