"use client";
import { useFormStore } from "@/store/formStore";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine  } from "recharts";

export default function AnalysisPage() {
  const { formData } = useFormStore();

  // 仮の計算式（実際はより精緻なロジックに差し替えてください）
  const startYear = 2024;
  const endYear = 2049;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  // 教育投資: 5年後から年収増加が始まる想定
  const educationStart = startYear + 5;
  const educationAnnualReturn = Number(formData.costFuture) > 0 ? Number(formData.costFuture) / 20 : 60; // 仮: 20年で回収
  let educationCumulative = 0;

  // オルカン投資: 年利5%複利
  const orukanInitial = Number(formData.costPast) || 100;
  let orukanCumulative = orukanInitial;

  const data = years.map((year, idx) => {
    // 教育投資の累積
    if (year >= educationStart) {
      educationCumulative += educationAnnualReturn;
     }
    // オルカン投資の累積
    if (idx > 0) {
      orukanCumulative *= 1.05;
     }
     return {
      year,
      教育投資: Math.round(educationCumulative),
      オルカン: Math.round(orukanCumulative),
    };
  });

  // 最終リターン
  const educationReturn = data[data.length - 1].教育投資;
  const orukanReturn = data[data.length - 1].オルカン;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">あなたの教育投資 vs オルカン投資</h1>
      <div className="mb-8">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip formatter={(value: number, name: string) => [`${value}万円`, name]} />
            <Legend />
            <ReferenceLine x={educationStart} stroke="red" label="社会人スタート" />
            <Line type="monotone" dataKey="教育投資" stroke="#8884d8" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="オルカン" stroke="#82ca9d" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mb-4">
        <p>教育投資のリターン: <span className="font-bold">{educationReturn}万円</span></p>
        <p>オルカン投資のリターン: <span className="font-bold">{orukanReturn}万円</span></p>
      </div>
      <div className="flex gap-4">
        <button className="bg-gray-300 px-4 py-2 rounded">もう一度入力する</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">親にプレゼンする</button>
      </div>
    </div>
  );
}