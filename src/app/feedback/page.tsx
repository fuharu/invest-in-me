"use client";
import { useState } from "react";

export default function FeedbackPage() {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6 text-indigo-900">フィードバック</h1>
      <p className="mb-6 text-gray-700">サービス改善のため、ご意見・ご感想をお聞かせください。</p>
      {sent ? (
        <div className="text-green-600 font-semibold">ご意見ありがとうございました！</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full border rounded p-3 min-h-[120px]"
            placeholder="ご意見・ご感想を自由にご記入ください"
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
          />
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            送信
          </button>
        </form>
      )}
    </div>
  );
} 