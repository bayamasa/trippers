---
name: api-usecase
description: Hono + Drizzle ORMを使用したAPIエンドポイント作成を支援。Usecaseパターンでビジネスロジックをルートから分離。(1)新しいAPIエンドポイント追加、(2)ビジネスロジック実装、(3)エラーハンドリング定義で使用。トリガー：「APIを作成」「エンドポイント追加」「ユースケース作成」「ビジネスロジック実装」
---

# API Usecase Pattern

## Overview

ビジネスロジックをルート定義から分離し、テスト可能で再利用可能なコードを作成するためのパターン。

## ディレクトリ構造

```
backend/src/usecases/{domain}/{operation}.ts
```

例:
- `usecases/auth/signup.ts`
- `usecases/tour/getTours.ts`
- `usecases/user/createProfile.ts`

## Usecase ファイルの構造

各 usecase ファイルは以下の4つの要素で構成:

### 1. Input Interface

```typescript
export interface {Operation}Input {
  // リクエストから受け取るパラメータ
}
```

### 2. Output Interface

```typescript
export interface {Operation}Output {
  // レスポンスとして返すデータ
}
```

返却値がない場合は `Promise<void>` を直接使用（型エイリアスは作成しない）。

### 3. Error Classes

```typescript
export class {ErrorName}Error extends Error {
  constructor() {
    super('エラーメッセージ')
    this.name = '{ErrorName}Error'
  }
}
```

### 4. Execute Function

```typescript
export async function execute(input: {Operation}Input): Promise<{Operation}Output> {
  // ビジネスロジック
}
```

## Route からの呼び出し

```typescript
import * as signupUsecase from '@/usecases/auth/signup'
import { EmailAlreadyExistsError } from '@/usecases/auth/signup'

auth.openapi(signupRoute, async (c) => {
  const input = c.req.valid('json')
  try {
    const output = await signupUsecase.execute(input)
    return c.json({ message: '成功', data: output }, 201)
  } catch (error) {
    if (error instanceof EmailAlreadyExistsError) {
      return c.json({ error: error.message }, 409)
    }
    throw error
  }
})
```

## Import ルール

- 内部サービス: `@/services/xxx` を使用
- DB: `@db/index`, `@db/schema` を使用
- Drizzle ORM: `drizzle-orm` から直接 import

## References

詳細なテンプレートと例: [references/usecase-template.md](references/usecase-template.md)
