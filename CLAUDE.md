# Trippers Project

## Project Overview

旅行ツアー予約アプリケーション。Hono (backend) + Next.js (frontend) + Drizzle ORM 構成。

## Skills

### 利用可能なスキル

| スキル名 | 説明 |
|---------|------|
| `api-usecase` | Usecase パターンを使った API エンドポイント作成 |
| `api-development` | Hono + Zod OpenAPI を使用した API エンドポイント作成 |
| `database-operations` | Drizzle ORM を使用したデータベース操作 |

### スキルの呼び出しタイミング

スキルは `SKILL.md` の `description` フィールドに基づいて自動的に呼び出される：

```yaml
---
name: api-usecase
description: トリガー：「APIを作成」「エンドポイント追加」「ユースケース作成」
---
```

**仕組み:**
1. Claude は全スキルの `name` と `description` を常にコンテキストに保持
2. ユーザーのリクエストが description のキーワード/シナリオにマッチすると発動
3. 発動後、SKILL.md 本文と参照ファイルが読み込まれる

**重要:** description に「いつ使うか」を明確に記載すること。SKILL.md 本文は発動後に読まれるため、本文内の「When to Use」セクションはトリガーに影響しない。

## Architecture

### ディレクトリ構造

```
backend/
├── src/
│   ├── routes/        # Hono ルート定義
│   ├── usecases/      # ビジネスロジック
│   │   ├── auth/      # 認証関連
│   │   ├── tour/      # ツアー関連
│   │   └── user/      # ユーザー関連
│   └── services/      # 共通サービス
frontend/
├── app/               # Next.js App Router
└── components/        # React コンポーネント
db/
├── schema.ts          # Drizzle スキーマ
└── seed.ts            # シードデータ
```

### Usecase パターン

各 usecase ファイルは以下の構造:

```typescript
// Input
export interface {Operation}Input { ... }

// Output
export interface {Operation}Output { ... }

// Errors
export class {ErrorName}Error extends Error { ... }

// Usecase
export async function execute(input): Promise<output> { ... }
```

## Commands

```bash
make dev          # 開発サーバー起動
make lint         # Biome lint チェック
make lint-fix     # Biome lint 修正
make format       # Biome フォーマット
```
