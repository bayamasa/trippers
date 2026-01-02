# データベース操作ガイド

## 概要

このプロジェクトでは Drizzle ORM を使用してPostgreSQLデータベースを管理しています。

## ファイル構成

```
db/
├── drizzle.config.ts  # Drizzle設定ファイル
├── schema.ts          # テーブル定義
├── seed.ts            # シードデータ
├── index.ts           # DB接続設定
└── migrations/        # マイグレーションファイル
```

## コマンド一覧

| コマンド | 説明 |
|---------|------|
| `make db` | PostgreSQLコンテナを起動 |
| `make db-reset` | DBを完全リセット（ボリューム削除→スキーマ適用→シード実行） |
| `pnpm db:push` | スキーマ変更をDBに反映 |
| `pnpm db:seed` | シードデータを投入 |
| `pnpm db:studio` | Drizzle Studioを起動（GUI管理ツール） |

---

## DBスキーマを変更する手順

### 1. スキーマファイルを編集

`db/schema.ts` を編集してテーブル定義を変更します。

```typescript
// 例: カラム追加
export const destinationsTable = pgTable("destinations", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(), // 新規追加
  nameJp: varchar("name_jp", { length: 255 }).notNull(),
  // ...
});
```

### 2. シードデータを更新

`db/seed.ts` を編集して、スキーマ変更に対応したデータに更新します。

```typescript
const destinations = await db
  .insert(destinationsTable)
  .values([
    { slug: "bali", nameJp: "バリ島", ... },
    // ...
  ])
  .returning();
```

### 3. DBをリセット

```bash
make db-reset
```

このコマンドは以下を実行します：
1. 既存のPostgreSQLコンテナを停止
2. DBボリュームを削除
3. 新しいDBコンテナを起動
4. `pnpm db:push` でスキーマを適用
5. `pnpm db:seed` でシードデータを投入

---

## 本番環境でのマイグレーション

開発環境では `make db-reset` で完全リセットできますが、本番環境ではデータを保持したままマイグレーションが必要です。

### マイグレーションファイルの生成

```bash
pnpm drizzle-kit generate --config db/drizzle.config.ts
```

### マイグレーションの実行

```bash
pnpm drizzle-kit migrate --config db/drizzle.config.ts
```

---

## トラブルシューティング

### スキーマファイルが見つからないエラー

```
Error: No schema files found for path config ['./schema.ts']
```

**原因**: `drizzle.config.ts` のパスがプロジェクトルートからの相対パスになっていない

**解決**: `drizzle.config.ts` を確認し、パスを修正
```typescript
export default defineConfig({
  out: "./db/migrations",
  schema: "./db/schema.ts",  // プロジェクトルートからの相対パス
  // ...
});
```

### テーブルが存在しないエラー

```
error: relation "xxx" does not exist
```

**原因**: DBスキーマが適用されていない

**解決**: `make db-reset` を実行してDBを再構築

### ポート5432が使用中エラー

**解決**:
```bash
make db-reset  # 自動的に既存のコンテナを停止します
```

---

## Drizzle Studio

GUIでDBを確認・編集できます。

```bash
pnpm db:studio
```

ブラウザで `https://local.drizzle.studio` にアクセス
