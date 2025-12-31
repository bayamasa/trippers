# Trippers - 旅行予約プラットフォーム

モノレポ構成のフルスタックアプリケーション。フロントエンドはNext.js、バックエンドはHono × Bunで構築されています。

## プロジェクト構成

```
trippers/
├── frontend/          # Next.js フロントエンド (Port: 3000)
├── backend/           # Hono × Bun バックエンド API (Port: 3001)
├── packages/
│   └── shared/        # 共有パッケージ (Drizzle ORM スキーマ等)
└── docker-compose.yaml # PostgreSQL データベース
```

## 前提条件

- Node.js 24.x (Volta推奨)
- pnpm 10.x
- Bun 1.x
- Docker & Docker Compose

## セットアップ

### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. データベースの起動

```bash
docker-compose up -d
```

### 3. 環境変数の設定

#### Frontend (.env.local)

`frontend/.env.local` を作成：

```env
DATABASE_URL=postgresql://trippers:trippers@localhost:5432/trippers
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### Backend (.env)

`backend/.env` を作成：

```env
PORT=3001
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgres://trippers:trippers@localhost:5432/trippers
```

### 4. データベースマイグレーション

```bash
# スキーマをデータベースに適用
pnpm run db:push

# シードデータの投入（オプション）
pnpm run db:seed
```

## 開発サーバーの起動

### Makeコマンドを使用（推奨）

```bash
# 全て起動（DB + Backend + Frontend）
make dev

# フロントエンドのみ起動
make dev-front

# バックエンドのみ起動（DBも自動起動）
make dev-back

# データベースのみ起動
make dev-db

# 全てのサービスを停止
make stop

# 利用可能なコマンド一覧を表示
make help
```

### pnpmコマンドを直接使用

```bash
# 全て起動（DB手動起動が必要）
pnpm dev

# フロントエンドのみ
pnpm dev:frontend

# バックエンドのみ
pnpm dev:backend
```

起動後のアクセス先：
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## API エンドポイント

RESTfulなリソース指向設計に基づいています。

### ヘルスチェック
```
GET /health
```

### ツアー関連

#### 全ツアー一覧取得
```
GET /api/tours
```

#### 特定の目的地のツアー一覧取得
```
GET /api/destinations/:id/tours
```

#### ツアー詳細取得
```
GET /api/destinations/:id/tours/:tour_id
```

例:
- `GET /api/destinations/1/tours` - destination_id=1のツアー一覧
- `GET /api/destinations/1/tours/1` - destination_id=1、tour_id=1の詳細

## データベース管理

### Drizzle Studio の起動

```bash
pnpm run db:studio
```

### マイグレーション生成

```bash
pnpm run db:generate
```

### マイグレーション適用

```bash
pnpm run db:migrate
```

## ビルド

### 全てのプロジェクトをビルド

```bash
pnpm build
```

### 個別にビルド

```bash
# フロントエンド
pnpm build:frontend

# バックエンド
pnpm build:backend
```

## 技術スタック

### Frontend
- Next.js 16 (App Router, RSC)
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui (Radix UI)
- Biome (Linter & Formatter)

### Backend
- Hono 4
- Bun 1.x (Runtime)
- TypeScript
- Drizzle ORM

### Database
- PostgreSQL 17
- Drizzle ORM

### Monorepo
- pnpm workspaces

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Hono Documentation](https://hono.dev/)
- [Bun Documentation](https://bun.sh/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
