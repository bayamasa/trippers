## セットアップ

### 依存関係のインストール
```sh
bun install
```

### 環境変数の設定

`.env` ファイルをプロジェクトルートに作成し、以下の内容を追加してください：

```env
DATABASE_URL=postgresql://trippers:trippers@localhost:5432/trippers
```

### データベースマイグレーション

スキーマをデータベースに適用するには：

```sh
# 直接データベースに適用（開発環境推奨）
bun run db:push

# または、マイグレーションファイルを生成して適用
bun run db:generate
bun run db:migrate
```

### 開発サーバーの起動

```sh
bun run dev
```

サーバーは http://localhost:8000 で起動します。

## 利用可能なエンドポイント

- `GET /` - Hello Hono!
- `GET /users` - ユーザー一覧を取得
- `GET /destinations` - 目的地一覧を取得

## その他のコマンド

- `bun run db:studio` - Drizzle Studioを起動（データベースの可視化ツール）
