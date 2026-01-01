import type { paths } from '@/api/generated'
import { APIError, client } from '../client'

// 生成された型からレスポンス型を抽出
type GetDestinationToursApiResponse =
  paths['/v1/destinations/:destination_id/tours']['get']['responses']['200']['content']['application/json']
type GetTourDetailApiResponse =
  paths['/v1/destinations/:destination_id/tours/:tour_id']['get']['responses']['200']['content']['application/json']

// dataの中身を取り出した型
export type GetDestinationToursResponse = GetDestinationToursApiResponse['data']
export type GetTourDetailResponse = GetTourDetailApiResponse['data']

// 特定の目的地のツアー一覧を取得
export async function getDestinationTours(
  destinationId: number,
): Promise<GetDestinationToursResponse> {
  const { data, error, response } = await client.GET(
    '/v1/destinations/:destination_id/tours',
    {
      params: {
        path: { destination_id: String(destinationId) },
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

// ツアー詳細を取得（RESTfulなリソース指向）
export async function getTourDetail(
  destinationId: number,
  tourId: number,
): Promise<GetTourDetailResponse> {
  const { data, error, response } = await client.GET(
    '/v1/destinations/:destination_id/tours/:tour_id',
    {
      params: {
        path: {
          destination_id: String(destinationId),
          tour_id: String(tourId),
        },
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
