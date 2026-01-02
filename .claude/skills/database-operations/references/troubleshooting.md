# トラブルシューティング

## スキーマファイルが見つからないエラー

```text
Error: No schema files found for path config ['./schema.ts']
```

**原因**: `drizzle.config.ts` のパスがプロジェクトルートからの相対パスになっていない

**解決**: `db/drizzle.config.ts` を確認し、パスを修正

```typescript
export default defineConfig({
  out: "./db/migrations",
  schema: "./db/schema.ts",  // プロジェクトルートからの相対パス
});
```

## テーブルが存在しないエラー

```text
error: relation "xxx" does not exist
```

**原因**: DBスキーマが適用されていない

**解決**: `make db-reset` を実行してDBを再構築

## ポート5432が使用中エラー

**解決**: `make db-reset` を実行（自動的に既存のコンテナを停止します）

## シードが失敗する

**原因**: スキーマ変更後にシードデータが更新されていない

**解決**: `db/seed.ts` を確認し、新しいカラムに対応したデータを追加
