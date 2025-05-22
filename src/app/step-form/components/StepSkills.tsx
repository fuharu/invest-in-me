import React from "react";

type Props = {
  formData: any;
  setFormData: (data: any) => void;
  nextStep: () => void;
  prevStep: () => void;
};

export default function StepSkills({ formData, setFormData, nextStep, prevStep }: Props) {
  return (
    <form onSubmit={e => { e.preventDefault(); nextStep(); }}>
      <div className="mb-4">
        <label className="block mb-1">取得資格</label>
        <input className="border rounded w-full p-2" value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} />
      </div>
      <div className="mb-4">
        <label className="block mb-1">プログラミングスキル</label>
        <input className="border rounded w-full p-2" value={formData.programming} onChange={e => setFormData({ ...formData, programming: e.target.value })} />
      </div>
      <div className="mb-4">
        <label className="block mb-1">インターン経験</label>
        <input className="border rounded w-full p-2" value={formData.intern} onChange={e => setFormData({ ...formData, intern: e.target.value })} />
      </div>
      <div className="mb-4">
        <label className="block mb-1">コンテスト入賞歴</label>
        <input className="border rounded w-full p-2" value={formData.contest} onChange={e => setFormData({ ...formData, contest: e.target.value })} />
      </div>
      <div className="flex justify-between">
        <button type="button" onClick={prevStep} className="bg-gray-300 px-4 py-2 rounded">戻る</button>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">次へ</button>
      </div>
    </form>
  );
}