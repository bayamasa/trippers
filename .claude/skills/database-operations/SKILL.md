---
name: database-operations
description: Drizzle ORMを使用したデータベース操作を支援。スキーマ変更、マイグレーション、シードデータ投入、DBリセットで使用。トリガー例：「DBを更新」「スキーマ変更」「テーブル追加」「カラム追加」「シード実行」「マイグレーション」
---

# Database Operations

Drizzle ORM + PostgreSQL。設定は `db/` ディレクトリに集約。

## コマンド

| コマンド | 説明 |
| --- | --- |
| `make db-reset` | DB完全リセット（ボリューム削除→スキーマ適用→シード） |
| `make db` | PostgreSQLコンテナ起動 |
| `pnpm db:push` | スキーマ変更をDBに反映 |
| `pnpm db:seed` | シードデータ投入 |
| `pnpm db:studio` | Drizzle Studio起動 |

## スキーマ変更手順

1. `db/schema.ts` を編集
2. `db/seed.ts` を更新（新カラムに対応）
3. `make db-reset` を実行

```typescript
// db/schema.ts 例
export const destinationsTable = pgTable("destinations", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  nameJp: varchar("name_jp", { length: 255 }).notNull(),
});
```

## 本番マイグレーション

開発環境は `make db-reset` で完全リセット。本番環境はマイグレーション使用：

```bash
# マイグレーション生成
pnpm drizzle-kit generate --config db/drizzle.config.ts

# マイグレーション実行
pnpm drizzle-kit migrate --config db/drizzle.config.ts
```

## 関連ファイル更新チェックリスト

スキーマ変更時は以下も確認：

- [ ] `db/seed.ts` - シードデータ
- [ ] `shared/src/schemas/entities/` - Zodスキーマ
- [ ] `backend/src/routes/` - APIでのカラム参照

## トラブルシューティング

エラーが発生した場合は [troubleshooting.md](references/troubleshooting.md) を参照。
