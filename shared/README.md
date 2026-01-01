# sharedパッケージ設計計画

## 概要
APIレスポンススキーマをsharedパッケージに切り出し、frontend/backendで共有する。

## 命名規則

**APIレスポンス名に適用:**

### 1. 単一リソースのエンドポイント

| パターン | 命名 | 例 |
|---------|-----|-----|
| `/v1/{resources}` | `{Resources}Response` | `/v1/tours` → `ToursResponse` |
| `/v1/{resources}/:id` | `{Resource}Response` | `/v1/tours/:id` → `TourResponse` |

### 2. ネストしたリソース（複数リソース）のエンドポイント

親リソースは常に**単数形**、子リソースは**エンドポイントの終端に応じて単数/複数**

| パターン | 命名 | 例 |
|---------|-----|-----|
| `/v1/{parents}/:id/{children}` | `{Parent}{Children}Response` | `/v1/destinations/:id/tours` → `DestinationToursResponse` |
| `/v1/{parents}/:id/{children}/:id` | `{Parent}{Child}Response` | `/v1/destinations/:id/tours/:id` → `DestinationTourResponse` |

**ルール:**
- 親リソース: IDで特定されるため常に単数形（`Destination`）
- 子リソース: 一覧なら複数形（`Tours`）、単一取得なら単数形（`Tour`）

### 3. サフィックス
- `Response` サフィックスを付ける
- `Schema` サフィックスは不要

### 適用例

| エンドポイント | レスポンス名 | 説明 |
|-------------|------------|------|
| `GET /v1/tours` | `ToursResponse` | 単一リソース、一覧 |
| `GET /v1/destinations/:destination_id/tours` | `DestinationToursResponse` | Destination(単数) + Tours(複数) |
| `GET /v1/destinations/:destination_id/tours/:tour_id` | `DestinationTourResponse` | Destination(単数) + Tour(単数) |

## ディレクトリ構造

```
shared/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    ├── schemas/
    │   ├── index.ts
    │   ├── entities/
    │   │   ├── index.ts
    │   │   ├── tour.ts                          # Tour
    │   │   ├── destination.ts                   # Destination
    │   │   ├── area.ts                          # Area
    │   │   ├── tour-stock.ts                    # TourStock
    │   │   └── tour-with-destination-and-area.ts # TourWithDestinationAndArea
    │   └── responses/
    │       ├── index.ts
    │       ├── tours.ts             # ToursResponse
    │       ├── destination-tours.ts # DestinationToursResponse
    │       └── tour-detail.ts       # DestinationTourResponse
    └── types/
        ├── index.ts
        ├── entities.ts
        └── responses.ts
```

## 使用例

```typescript
// スキーマ（Zodオブジェクト）
import { Tour, ToursResponse } from '@trippers/shared/schemas'

// 型（TypeScript型）
import type { Tour, ToursResponse } from '@trippers/shared/types'
```
