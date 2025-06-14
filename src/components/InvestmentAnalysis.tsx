import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface InvestmentAnalysisProps {
  pastEducationCost: number;
  futureEducationCost: number;
  targetIncome: number;
  onBack?: () => void;
}

export const InvestmentAnalysis: React.FC<InvestmentAnalysisProps> = ({
  pastEducationCost,
  futureEducationCost,
  targetIncome,
  onBack,
}) => {
  // 複利計算の関数
  const calculateCompoundInterest = (principal: number, rate: number, years: number) => {
    return principal * Math.pow(1 + rate, years);
  };

  // データの生成
  const generateData = () => {
    const data = [];
    const years = 20; // 20年間の予測
    const futureEducationRate = 0.05; // 今後の教育投資の年利5%

    for (let year = 0; year <= years; year++) {
      const futureEducationValue = calculateCompoundInterest(futureEducationCost, futureEducationRate, year);
      const educationROI = (targetIncome * year) - (pastEducationCost + futureEducationCost);

      data.push({
        year,
        futureEducationValue: Math.round(futureEducationValue),
        educationROI: Math.round(educationROI),
      });
    }

    return data;
  };

  const data = generateData();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">投資分析結果</h2>
      {onBack && (
        <button
          className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          onClick={onBack}
        >
          入力画面に戻る
        </button>
      )}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">投資対効果（ROI）の比較</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" label={{ value: '年数', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: '金額（万円）', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="futureEducationValue"
                name="今後の教育投資の将来価値"
                stroke="#8884d8"
              />
              <Line
                type="monotone"
                dataKey="educationROI"
                name="教育投資のROI"
                stroke="#82ca9d"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-4">分析サマリー</h3>
      <div className="space-y-4">
        <p>
          これまでの教育投資額: {pastEducationCost.toLocaleString()}万円
        </p>
        <p>
          今後の教育投資額: {futureEducationCost.toLocaleString()}万円
        </p>
        <p>
          目標年収: {targetIncome.toLocaleString()}万円
        </p>
        <p className="text-lg font-semibold">
          教育投資の回収予測: {Math.round((pastEducationCost + futureEducationCost) / targetIncome)}年
        </p>
      </div>
    </div>
  );
}; 