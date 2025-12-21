This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## セットアップ

### 依存関係のインストール

```bash
pnpm install
# or
npm install
# or
yarn install
# or
bun install
```

### 環境変数の設定

`.env.local` ファイルをプロジェクトルートに作成し、以下の内容を追加してください：

```env
DATABASE_URL=postgresql://trippers:trippers@localhost:5432/trippers
```

### データベースマイグレーション

スキーマをデータベースに適用するには：

```bash
# 直接データベースに適用（開発環境推奨）
pnpm run db:push

# または、マイグレーションファイルを生成して適用
pnpm run db:generate
pnpm run db:migrate
```

## Getting Started

開発サーバーを起動：

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
