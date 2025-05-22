import React from 'react';

interface AIAnalysisProps {
  analysis: string;
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ analysis }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4">AI分析結果</h3>
      <div className="prose max-w-none">
        {analysis.split('\n').map((line, index) => (
          <p key={index} className="mb-2">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}; 