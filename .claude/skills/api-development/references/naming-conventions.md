# API命名規則

## レスポンス名

### 単一リソース

| パターン | 命名 | 例 |
| --- | --- | --- |
| `/v1/{resources}` | `{Resources}Response` | `/v1/tours` → `ToursResponse` |
| `/v1/{resources}/:id` | `{Resource}Response` | `/v1/tours/:id` → `TourResponse` |

### ネストしたリソース

親リソースは常に**単数形**、子リソースは**エンドポイント終端に応じて単数/複数**

| パターン | 命名 | 例 |
| --- | --- | --- |
| `/v1/{parents}/:id/{children}` | `{Parent}{Children}Response` | `/v1/destinations/:id/tours` → `DestinationToursResponse` |
| `/v1/{parents}/:id/{children}/:id` | `{Parent}{Child}Response` | `/v1/destinations/:id/tours/:id` → `DestinationTourResponse` |

## ルール

- 親リソース: IDで特定されるため常に単数形（`Destination`）
- 子リソース: 一覧なら複数形（`Tours`）、単一取得なら単数形（`Tour`）
- `Response` サフィックスを付ける
- `Schema` サフィックスは不要

## エンティティ名

- 単数形を使用: `Tour`, `Destination`, `Area`
- 複合エンティティ: `TourWithDestinationAndArea`

## ファイル名

- ケバブケース: `tour.ts`, `destination-tours.ts`, `tour-with-destination-and-area.ts`

## import例

```typescript
// スキーマ（Zodオブジェクト）
import { Tour, ToursResponse } from '@trippers/shared/schemas'

// 型（TypeScript型）
import type { Tour, ToursResponse } from '@trippers/shared/types'
```
