import React from 'react';

interface AnalysisSection {
  evaluation: string;
  basis: string;
  suggestions: string[];
}

interface StructuredAnalysis {
  academicStrengths: AnalysisSection;
  skillStrengths: AnalysisSection;
  futurePotential: AnalysisSection;
  investmentValue: AnalysisSection;
  overallAssessment: AnalysisSection;
}

interface AIAnalysisProps {
  analysis: string;
  structuredAnalysis?: StructuredAnalysis;
  isLoading?: boolean;
  error?: string | null;
}

const EvaluationBadge: React.FC<{ evaluation: string }> = ({ evaluation }) => {
  const getColor = (evaluationGrade: string) => {
    switch (evaluationGrade.trim()) {
      case 'S': return 'bg-purple-100 text-purple-800';
      case 'A': return 'bg-blue-100 text-blue-800';
      case 'B': return 'bg-green-100 text-green-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${getColor(evaluation)}`}>
      {evaluation}
    </span>
  );
};

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ analysis, structuredAnalysis, isLoading, error }) => {
  if (isLoading) {
    return <div className="text-center text-gray-500 py-8">AI分析中...</div>;
  }
  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }
  if (!structuredAnalysis) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">AI分析結果</h3>
        <div className="prose max-w-none">
          {analysis.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>
    );
  }

  const renderSection = (title: string, section: AnalysisSection) => (
    <div className="mb-6">
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center mb-2">
          <span className="mr-2">評価:</span>
          <EvaluationBadge evaluation={section.evaluation} />
        </div>
        <div className="mb-2">
          <span className="font-medium">根拠:</span>
          <p className="mt-1">{section.basis}</p>
        </div>
        {section.suggestions.length > 0 && (
          <div>
            <span className="font-medium">提案:</span>
            <ul className="list-disc list-inside mt-1">
              {section.suggestions.map((suggestion, i) => (
                <li key={i}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">AI分析結果</h3>
      <div className="space-y-6">
        {renderSection('学業面での強み', structuredAnalysis.academicStrengths)}
        {renderSection('スキル面での強み', structuredAnalysis.skillStrengths)}
        {renderSection('将来性の分析', structuredAnalysis.futurePotential)}
        {renderSection('教育投資の価値', structuredAnalysis.investmentValue)}
        {renderSection('総合評価', structuredAnalysis.overallAssessment)}
      </div>
    </div>
  );
}; 