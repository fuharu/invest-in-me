"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AIAnalysis } from '@/components/AIAnalysis';
import { InvestmentAnalysis } from '@/components/InvestmentAnalysis';

export default function AnalysisPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('formData');
    if (!data) {
      router.push('/form/step1');
      return;
    }
    setFormData(JSON.parse(data));
  }, [router]);

  useEffect(() => {
    const analyzeData = async () => {
      if (!formData) return;

      setIsAnalyzing(true);
      setError(null);
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.details || '分析に失敗しました');
        }

        setAiAnalysis(result.analysis);
      } catch (error) {
        console.error('Analysis error:', error);
        setError(error instanceof Error ? error.message : '分析中にエラーが発生しました');
        setAiAnalysis('');
      } finally {
        setIsAnalyzing(false);
      }
    };

    analyzeData();
  }, [formData]);

  const handleNext = () => {
    router.push('/comparison');
  };

  if (!formData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-900 mb-4">
            AI分析結果
          </h1>
          <p className="text-xl text-gray-600">
            あなたの将来性をAIが分析しました
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <AIAnalysis
              analysis={aiAnalysis}
              isLoading={isAnalyzing}
              error={error}
            />
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <InvestmentAnalysis
              pastEducationCost={Number(formData.cost?.past) || 0}
              futureEducationCost={Number(formData.cost?.future) || 0}
              targetIncome={Number(formData.passion?.goal) || 0}
            />
          </div>

          <div className="text-center">
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              投資比較を見る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}