---
name: api-development
description: Hono + Zod OpenAPIを使用したAPIエンドポイント作成を支援。(1)新しいAPIエンドポイント追加、(2)ルート定義作成、(3)レスポンススキーマ定義、(4)エンティティスキーマ作成で使用。トリガー：「APIを作成」「エンドポイント追加」「ルート追加」「GET/POST/PUT/DELETE API」「スキーマ定義」「レスポンス型」
---

# API Development

Hono + Zod OpenAPI + Drizzle ORM構成。

## API作成手順

1. `shared/src/schemas/responses/` にレスポンススキーマ作成
2. `backend/src/routes/` にルート定義作成
3. `backend/src/index.ts` にルートをマウント

## 命名規則

| エンドポイント | レスポンス名 |
| --- | --- |
| `GET /v1/tours` | `ToursResponse` |
| `GET /v1/tours/:id` | `TourResponse` |
| `GET /v1/destinations/:id/tours` | `DestinationToursResponse` |

詳細: [naming-conventions.md](references/naming-conventions.md)

## ルート定義

```typescript
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { MyResponse } from '@trippers/shared/schemas/responses'
import { db } from '@db/index'

const router = new OpenAPIHono()

const getRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['TagName'],
  summary: '概要',
  responses: {
    200: { description: '成功', content: { 'application/json': { schema: MyResponse } } },
    500: { description: 'エラー', content: { 'application/json': { schema: z.object({ error: z.string() }) } } },
  },
})

router.openapi(getRoute, async (c) => {
  const data = await db.select().from(myTable)
  return c.json(data, 200)
})

export { router as myRoute }
```

パスパラメータ・スキーマ定義の詳細: [templates.md](references/templates.md)

## マウント

```typescript
// backend/src/index.ts
app.route('/v1/my-resource', myRoute)
```

## チェックリスト

- [ ] `shared/src/schemas/responses/` にレスポンススキーマ
- [ ] `shared/src/schemas/responses/index.ts` にexport追加
- [ ] `backend/src/routes/` にルート定義
- [ ] `backend/src/index.ts` にマウント
