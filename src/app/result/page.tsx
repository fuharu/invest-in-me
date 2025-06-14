'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PDFExport } from '@/components/PDFExport';

export default function ResultPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<any>(null);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('formData');
    if (!data) {
      router.push('/form/step1');
      return;
    }
    setFormData(JSON.parse(data));
  }, [router]);

  const handleSave = async () => {
    if (!formData) return;

    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.details || '保存に失敗しました');
      }

      setShareUrl(result.shareUrl);
    } catch (error) {
      console.error('Save error:', error);
      setError(error instanceof Error ? error.message : '保存中にエラーが発生しました');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestart = () => {
    localStorage.removeItem('formData');
    router.push('/form/step1');
  };

  if (!formData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-900 mb-4">
            分析完了！
          </h1>
          <p className="text-xl text-gray-600">
            あなたの将来性を分析しました
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">プレゼン資料のダウンロード</h2>
            <PDFExport formData={formData} />
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">共有リンクの作成</h2>
            {shareUrl ? (
              <div className="space-y-4">
                <p className="text-gray-600">以下のリンクを親御さんと共有してください：</p>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 p-2 border rounded-lg bg-gray-50"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(shareUrl)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    コピー
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600">
                  分析結果を保存して、親御さんと共有するためのリンクを作成できます。
                </p>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
                >
                  {isSaving ? '保存中...' : '共有リンクを作成'}
                </button>
                {error && (
                  <p className="text-red-600 text-sm">{error}</p>
                )}
              </div>
            )}
          </div>

          <div className="text-center">
            <button
              onClick={handleRestart}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              もう一度分析する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 