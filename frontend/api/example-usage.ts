/**
 * 生成された型の使用例
 *
 * このファイルは参考用です。実際のコードで使用する際の例を示しています。
 */

import type { paths } from '@/api/generated'
import { APIError, client } from '@/lib/api/client'

// =====================================
// 型の取得方法
// =====================================

// 1. レスポンス型を取得
type GetToursApiResponse =
  paths['/v1/tours']['get']['responses']['200']['content']['application/json']
// => { data: { tour: {...}, destination: {...}, area: {...} }[] }

type GetTourDetailApiResponse =
  paths['/v1/destinations/:destination_id/tours/:tour_id']['get']['responses']['200']['content']['application/json']
// => { data: { tour: {...}, destination: {...}, area: {...}, stocks: {...}[] } }

// 2. dataの中身を取り出した型
type GetToursResponse = GetToursApiResponse['data']
type GetTourDetailResponse = GetTourDetailApiResponse['data']

// 3. エラーレスポンス型を取得
type ErrorResponse =
  paths['/v1/tours']['get']['responses']['500']['content']['application/json']
// => { error: string }

// 4. ネストした型を取得
type TourData = GetToursResponse[number]
// => { tour: {...}, destination: {...}, area: {...} }

type Tour = TourData['tour']
// => { id: number, title: string, ... }

type Destination = TourData['destination']
// => { id: number, name: string, nameJp: string, imageFilename: string }

// =====================================
// 実際の使用例（openapi-fetch）
// =====================================

export async function getToursTyped(): Promise<GetToursResponse> {
  const { data, error, response } = await client.GET('/v1/tours')

  if (error) {
    throw new APIError(
      `API request failed: ${response.statusText}`,
      response.status,
      error,
    )
  }

  return data.data
}

// パラメータの型も取得可能
type GetDestinationToursParams =
  paths['/v1/destinations/:destination_id/tours']['get']['parameters']['path']
// => { destination_id: string }

export async function getDestinationToursTyped(
  params: GetDestinationToursParams,
): Promise<GetToursResponse> {
  const { data, error, response } = await client.GET(
    '/v1/destinations/:destination_id/tours',
    {
      params: {
        path: params,
      },
    },
  )

  if (error) {
    throw new APIError(
      `API request failed: ${response.statusText}`,
      response.status,
      error,
    )
  }

  return data.data
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
