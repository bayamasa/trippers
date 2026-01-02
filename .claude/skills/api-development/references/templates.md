# APIテンプレート集

## 目次

- [パスパラメータ付きルート](#パスパラメータ付きルート)
- [スラッグパラメータ](#スラッグパラメータ)
- [ネストしたリソース](#ネストしたリソース)
- [エンティティスキーマ](#エンティティスキーマ)
- [レスポンススキーマ](#レスポンススキーマ)
- [index.tsへのexport追加](#indextsへのexport追加)
- [POSTリクエスト](#postリクエスト)

---

## パスパラメータ付きルート

```typescript
const getByIdRoute = createRoute({
  method: 'get',
  path: '/:id',
  tags: ['TagName'],
  summary: '詳細取得',
  request: {
    params: z.object({
      id: z.string().regex(/^\d+$/).transform(Number)
        .openapi({ param: { name: 'id', in: 'path' }, example: '1' }),
    }),
  },
  responses: {
    200: { description: '成功', content: { 'application/json': { schema: MyResponse } } },
    404: { description: '見つからない', content: { 'application/json': { schema: z.object({ error: z.string() }) } } },
  },
})

router.openapi(getByIdRoute, async (c) => {
  const { id } = c.req.valid('param')
  const data = await db.select().from(myTable).where(eq(myTable.id, id))
  if (!data.length) return c.json({ error: 'Not found' }, 404)
  return c.json(data[0], 200)
})
```

## スラッグパラメータ

```typescript
request: {
  params: z.object({
    slug: z.string().regex(/^[a-z0-9-]+$/)
      .openapi({ param: { name: 'slug', in: 'path' }, example: 'bali' }),
  }),
},
```

## ネストしたリソース

```typescript
// GET /v1/destinations/:destination_slug/tours
const getRoute = createRoute({
  method: 'get',
  path: '/:destination_slug/tours',
  request: {
    params: z.object({
      destination_slug: z.string().regex(/^[a-z0-9-]+$/),
    }),
  },
  // ...
})
```

## エンティティスキーマ

```typescript
// shared/src/schemas/entities/my-entity.ts
import { z } from 'zod'

export const MyEntity = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.string(),
})
```

## レスポンススキーマ

```typescript
// shared/src/schemas/responses/my-response.ts
import { z } from 'zod'
import { MyEntity } from '../entities/my-entity'

// 配列レスポンス
export const MyListResponse = z.array(MyEntity)

// 単一レスポンス
export const MyResponse = MyEntity

// 複合レスポンス
export const MyDetailResponse = z.object({
  item: MyEntity,
  relatedItems: z.array(RelatedEntity),
})
```

## index.tsへのexport追加

```typescript
// shared/src/schemas/responses/index.ts
export * from './my-response'
```

## POSTリクエスト

```typescript
const createRoute = createRoute({
  method: 'post',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            name: z.string().min(1),
            email: z.string().email(),
          }),
        },
      },
    },
  },
  responses: {
    201: { description: '作成成功', content: { 'application/json': { schema: MyResponse } } },
    400: { description: 'バリデーションエラー', content: { 'application/json': { schema: z.object({ error: z.string() }) } } },
  },
})

router.openapi(createRoute, async (c) => {
  const body = c.req.valid('json')
  const result = await db.insert(myTable).values(body).returning()
  return c.json(result[0], 201)
})
```
