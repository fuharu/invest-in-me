# invest-in-me

## 概要

**invest-in-me** は、AIとデータ可視化を活用して、学生や保護者向けに「教育投資の価値」や「将来性」を分析・可視化するWebアプリです。

- 学業成績やスキルの可視化
- AIによる将来性分析
- 教育投資のROI（投資対効果）シミュレーション
- プレゼン資料の自動生成

## 主な機能

- 学生・保護者向けの分析フォーム
- AIによる個別分析（OpenAI API利用）
- 教育投資と資産運用（オルカン投資等）の比較グラフ
- 分析結果の保存・共有
- NextAuthによる認証（Google, メール/パスワード）

## 技術スタック

- Next.js 15
- TypeScript
- Prisma + PostgreSQL
- NextAuth.js
- Tailwind CSS
- Vercel（ホスティング）

## セットアップ方法

1. リポジトリをクローン
2. 必要な環境変数を`.env.local`に設定
3. 依存パッケージをインストール

```bash
npm install
```

4. Prismaのマイグレーション・クライアント生成

```bash
npx prisma migrate dev
npx prisma generate
```

5. 開発サーバー起動

```bash
npm run dev
```

6. ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## デプロイ

- このアプリは [Vercel](https://vercel.com/) でデプロイ・ホスティングされています。
- 公開URL: [https://invest-in-me-git-main-harus-projects-fb8e8564.vercel.app](https://invest-in-me-git-main-harus-projects-fb8e8564.vercel.app)
- サービスへのご意見・ご要望は、アプリ内の [フィードバックページ](https://invest-in-me-git-main-harus-projects-fb8e8564.vercel.app/feedback) からもお送りいただけます。

## ライセンス

このプロジェクトはMITライセンスです。

## 貢献方法

このプロジェクトへの貢献を歓迎します！バグ報告・機能提案・ドキュメント修正・コード改善など、どなたでもご参加いただけます。

アプリ内の「フィードバック」機能からもご意見・ご要望をお寄せください。

ご協力ありがとうございます！
