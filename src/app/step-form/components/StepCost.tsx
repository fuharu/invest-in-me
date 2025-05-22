import React from "react";

type Props = {
  formData: any;
  setFormData: (data: any) => void;
  nextStep: () => void;
  prevStep: () => void;
};

export default function StepCost({ formData, setFormData, nextStep, prevStep }: Props) {
  return (
    <form onSubmit={e => { e.preventDefault(); nextStep(); }}>
      <div className="mb-4">
        <label className="block mb-1">これまでの教育コスト（円）</label>
        <input type="number" className="border rounded w-full p-2" value={formData.costPast} onChange={e => setFormData({ ...formData, costPast: e.target.value })} />
      </div>
      <div className="mb-4">
        <label className="block mb-1">今後の教育コスト（円）</label>
        <input type="number" className="border rounded w-full p-2" value={formData.costFuture} onChange={e => setFormData({ ...formData, costFuture: e.target.value })} />
      </div>
      <div className="flex justify-between">
        <button type="button" onClick={prevStep} className="bg-gray-300 px-4 py-2 rounded">戻る</button>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">次へ</button>
      </div>
    </form>
  );
}