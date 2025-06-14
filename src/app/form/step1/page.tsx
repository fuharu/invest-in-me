'use client';

import { useRouter } from 'next/navigation';
import { StepForm } from '@/components/StepForm';
import { useEffect, useState } from 'react';

export default function Step1Page() {
  const router = useRouter();
  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setInitialData(JSON.parse(localStorage.getItem('formData') || '{}'));
    }
  }, []);

  const handleNext = (data: any) => {
    // データをローカルストレージにマージ保存
    const existingData = JSON.parse(localStorage.getItem('formData') || '{}');
    localStorage.setItem('formData', JSON.stringify({ ...existingData, ...data }));
    router.push('/form/step2');
  };

  const handleBack = () => {
    router.push('/'); // 例: トップページに戻す
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-900 mb-4">
            基本情報の入力
          </h1>
          <p className="text-xl text-gray-600">
            あなたの学業情報を入力してください
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <StepForm
            currentStep={0}
            totalSteps={5}
            onNext={handleNext}
            onBack={handleBack}
            initialData={initialData}
          />
        </div>
      </div>
    </div>
  );
} 