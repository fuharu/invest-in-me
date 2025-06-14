'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function ComparisonPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('formData');
    if (!data) {
      router.push('/form/step1');
      return;
    }
    setFormData(JSON.parse(data));
  }, [router]);

  useEffect(() => {
    if (!formData) return;

    // 仮の計算式（実際はより精緻なロジックに差し替えてください）
    const startYear = 2024;
    const endYear = 2049;
    const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
    
    // 教育投資: 5年後から年収増加が始まる想定
    const educationStart = startYear + 5;
    const educationAnnualReturn = Number(formData.futureEducationCost) > 0 ? Number(formData.futureEducationCost) / 20 : 60; // 仮: 20年で回収
    let educationCumulative = 0;

    // 今後の教育投資: 年利5%複利
    const futureEducationInitial = Number(formData.futureEducationCost) || 100;
    let futureEducationCumulative = futureEducationInitial;

    const data = years.map((year, idx) => {
      // 教育投資の累積
      if (year >= educationStart) {
        educationCumulative += educationAnnualReturn;
      }
      // 今後の教育投資の累積
      if (idx > 0) {
        futureEducationCumulative *= 1.05;
      }
      return {
        year,
        教育投資: Math.round(educationCumulative),
        今後の教育投資: Math.round(futureEducationCumulative),
      };
    });

    setChartData(data);
  }, [formData]);

  const handleNext = () => {
    router.push('/result');
  };

  const handleBack = () => {
    router.push('/analysis');
  };

  if (!formData || !chartData.length) {
    return null;
  }

  // 最終リターン
  const educationReturn = chartData[chartData.length - 1].教育投資;
  const futureEducationReturn = chartData[chartData.length - 1].今後の教育投資;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-900 mb-4">
            投資比較シミュレーション
          </h1>
          <p className="text-xl text-gray-600">
            教育投資とオルカン投資の比較
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="mb-8">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value: number, name: string) => [`${value}万円`, name]} />
                <Legend />
                <ReferenceLine x={2029} stroke="red" label="社会人スタート" />
                <Line type="monotone" dataKey="教育投資" stroke="#8884d8" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="今後の教育投資" stroke="#82ca9d" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">25年後の予測</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-gray-600">教育投資のリターン</p>
                <p className="text-2xl font-bold text-indigo-900">{educationReturn}万円</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-gray-600">今後の教育投資のリターン</p>
                <p className="text-2xl font-bold text-green-900">{futureEducationReturn}万円</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              戻る
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              結果を保存する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 