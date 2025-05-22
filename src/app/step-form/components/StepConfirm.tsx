import React from "react";

type Props = {
  formData: any;
  prevStep: () => void;
};

export default function StepConfirm({ formData, prevStep }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">入力内容の確認</h2>
      <ul className="mb-4">
        <li><strong>学校名:</strong> {formData.school}</li>
        <li><strong>学部:</strong> {formData.faculty}</li>
        <li><strong>GPA:</strong> {formData.gpa}</li>
        <li><strong>取得資格:</strong> {formData.skills}</li>
        <li><strong>プログラミングスキル:</strong> {formData.programming}</li>
        <li><strong>インターン経験:</strong> {formData.intern}</li>
        <li><strong>コンテスト入賞歴:</strong> {formData.contest}</li>
        <li><strong>今取り組んでいること:</strong> {formData.passion}</li>
        <li><strong>将来の目標:</strong> {formData.goal}</li>
        <li><strong>これまでの教育コスト:</strong> {formData.costPast}</li>
        <li><strong>今後の教育コスト:</strong> {formData.costFuture}</li>
      </ul>
      <div className="flex justify-between">
        <button type="button" onClick={prevStep} className="bg-gray-300 px-4 py-2 rounded">戻る</button>
        <button type="button" className="bg-green-500 text-white px-4 py-2 rounded">送信</button>
      </div>
    </div>
  );
}