import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-100 relative overflow-hidden">
      {/* 抽象的な未来イメージの背景イラスト例（SVGやグラデーション） */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <ellipse cx="900" cy="200" rx="500" ry="180" fill="#a5b4fc" fillOpacity="0.15" />
          <ellipse cx="400" cy="400" rx="400" ry="120" fill="#818cf8" fillOpacity="0.10" />
          <ellipse cx="1200" cy="500" rx="200" ry="80" fill="#6366f1" fillOpacity="0.08" />
        </svg>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-900 mb-6 drop-shadow-lg">
            あなたの「才能」に投資を。<br />
            データとAIで、未来の可能性を最大限に引き出す。
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            最新のAI分析とデータ可視化で、あなたの強み・将来性を親御さんに伝えましょう。
          </p>
          {/* AI分析イメージやグラフのイラスト例 */}
          {/*
          <div className="flex justify-center gap-8 mb-8 flex-wrap">
            <img src="/ai-abstract.svg" alt="AI分析イメージ" className="w-40 h-40 object-contain opacity-90" />
            <img src="/future-graph.svg" alt="未来グラフ" className="w-40 h-40 object-contain opacity-90" />
          </div>
          */}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-indigo-800 mb-4">
              学生の方へ：未来の扉を開く分析
            </h2>
            <p className="text-gray-700 mb-4">
              自分の強みと将来性を、データとAIで分析し、親御さんへの説得材料を作成しましょう。
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-6">
              <li>学業成績とスキルの可視化</li>
              <li>AIによる将来性分析</li>
              <li>投資対効果のシミュレーション</li>
              <li>プレゼン資料の自動生成</li>
            </ul>
            <Link
              href="/form/step1"
              className="block w-full text-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              プレゼン資料を作成する
            </Link>
          </div>

          <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-indigo-800 mb-4">
              保護者の方へ：お子様の可能性を最大限に引き出す投資判断
            </h2>
            <p className="text-gray-700 mb-4">
              お子様の将来性を、データとAIで客観的に分析し、教育投資の判断材料を提供します。
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-6">
              <li>学業成績の詳細分析</li>
              <li>スキルと実績の評価</li>
              <li>将来性の定量的分析</li>
              <li>投資対効果のシミュレーション</li>
            </ul>
            <Link
              href="/analysis"
              className="block w-full text-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              分析結果を確認する
            </Link>
          </div>
        </div>

        <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-indigo-800 mb-4">
            このアプリの特徴
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl text-indigo-600 mb-2">📊</div>
              <h3 className="font-semibold mb-2">データ分析</h3>
              <p className="text-gray-600 text-sm">
                学業成績、スキル、実績を定量的に分析
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl text-indigo-600 mb-2">🤖</div>
              <h3 className="font-semibold mb-2">AI分析</h3>
              <p className="text-gray-600 text-sm">
                将来性をAIが客観的に評価
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl text-indigo-600 mb-2">📈</div>
              <h3 className="font-semibold mb-2">投資シミュレーション</h3>
              <p className="text-gray-600 text-sm">
                教育投資の効果を可視化
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}