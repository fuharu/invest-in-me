export default function HowToPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6 text-indigo-900">使い方</h1>
      <ol className="list-decimal list-inside space-y-4 text-lg text-gray-800">
        <li>
          <span className="font-semibold">アカウント登録・ログイン：</span> サインアップまたはログインして、マイページにアクセスします。
        </li>
        <li>
          <span className="font-semibold">自己分析フォームの入力：</span> 学業・スキル・熱意・教育コストなどをステップごとに入力します。
        </li>
        <li>
          <span className="font-semibold">AI分析・グラフ表示：</span> 入力内容をもとにAIが将来性を分析し、グラフやレポートを表示します。
        </li>
        <li>
          <span className="font-semibold">プレゼン資料の作成・共有：</span> 分析結果をPDFや共有リンクで親御さんに伝えましょう。
        </li>
        <li>
          <span className="font-semibold">フィードバック：</span> サービス改善のためのご意見・ご感想もお待ちしています。
        </li>
      </ol>
    </div>
  );
} 