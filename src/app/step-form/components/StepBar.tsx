type Props = { step: number };
const steps = ["自己紹介", "スキル", "熱意", "コスト", "確認"];

export default function StepBar({ step }: Props) {
  return (
    <div className="flex justify-between mb-6">
      {steps.map((label, idx) => (
        <div key={label} className={`flex-1 text-center ${step === idx + 1 ? "font-bold text-blue-600" : "text-gray-400"}`}>
          {label}
        </div>
      ))}
    </div>
  );
}