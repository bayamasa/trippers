/**
 * 生成された型の使用例
 *
 * このファイルは参考用です。実際のコードで使用する際の例を示しています。
 */

import type { paths } from '@/api/generated'

// =====================================
// 型の取得方法
// =====================================

// 1. レスポンス型を取得
type GetToursResponse =
  paths['/v1/tours']['get']['responses']['200']['content']['application/json']
// => { data: { tour: {...}, destination: {...}, area: {...} }[] }

type GetTourDetailResponse =
  paths['/v1/destinations/:destination_id/tours/:tour_id']['get']['responses']['200']['content']['application/json']
// => { data: { tour: {...}, destination: {...}, area: {...}, stocks: {...}[] } }

// 2. エラーレスポンス型を取得
type ErrorResponse =
  paths['/v1/tours']['get']['responses']['500']['content']['application/json']
// => { error: string }

// 3. ネストした型を取得
type TourData = GetToursResponse['data'][number]
// => { tour: {...}, destination: {...}, area: {...} }

type Tour = TourData['tour']
// => { id: number, title: string, ... }

type Destination = TourData['destination']

// => { id: number, name: string, nameJp: string, imageFilename: string }

// =====================================
// 実際の使用例
// =====================================

// fetchAPI関数で使用
import { fetchAPI } from '@/lib/api/client'

export async function getToursTyped(): Promise<GetToursResponse['data']> {
  const response = await fetchAPI<GetToursResponse>('/v1/tours')
  return response.data
}

// パラメータの型も取得可能
type GetDestinationToursParams =
  paths['/v1/destinations/:destination_id/tours']['get']['parameters']['path']
// => { destination_id: string }

export async function getDestinationToursTyped(
  params: GetDestinationToursParams,
): Promise<GetToursResponse['data']> {
  const response = await fetchAPI<GetToursResponse>(
    `/v1/destinations/${params.destination_id}/tours`,
  )
  return response.data
}

// =====================================
// ヘルパー型の定義
// =====================================

// よく使う型を再エクスポート
export type {
  GetToursResponse,
  GetTourDetailResponse,
  ErrorResponse,
  Tour,
  Destination,
  TourData,
}
