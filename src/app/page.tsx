'use client';

import { useState } from 'react';
import { InvestmentForm } from '@/components/InvestmentForm';
import { InvestmentAnalysis } from '@/components/InvestmentAnalysis';
import { AIAnalysis } from '@/components/AIAnalysis';

export default function Home() {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [formData, setFormData] = useState({
    pastEducationCost: 0,
    futureEducationCost: 0,
    targetIncome: 0,
  });
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: any) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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

    setFormData({
      pastEducationCost: data.pastEducationCost,
      futureEducationCost: data.futureEducationCost,
      targetIncome: data.passion.futureGoals.targetIncome,
    });
    setShowAnalysis(true);
  };

  const handleBack = () => {
    setShowAnalysis(false);
    setAiAnalysis('');
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          私に投資して！
        </h1>
        
        {!showAnalysis ? (
          <InvestmentForm onSubmit={handleFormSubmit} />
        ) : (
          <>
            {isAnalyzing ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4">AI分析中...</p>
              </div>
            ) : (
              <>
                {error ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
                    <strong className="font-bold">エラーが発生しました：</strong>
                    <p className="mt-2">{error}</p>
                    <button
                      onClick={handleBack}
                      className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      入力画面に戻る
                    </button>
                  </div>
                ) : (
                  <>
                    {aiAnalysis && <AIAnalysis analysis={aiAnalysis} />}
                    <InvestmentAnalysis
                      pastEducationCost={formData.pastEducationCost}
                      futureEducationCost={formData.futureEducationCost}
                      targetIncome={formData.targetIncome}
                      onBack={handleBack}
                    />
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}