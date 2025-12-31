import type { paths } from '@/api/generated'
import { fetchAPI } from '../client'

// 生成された型からレスポンス型を抽出
type GetDestinationToursResponse =
  paths['/v1/destinations/:destination_id/tours']['get']['responses']['200']['content']['application/json']
type GetTourDetailResponse =
  paths['/v1/destinations/:destination_id/tours/:tour_id']['get']['responses']['200']['content']['application/json']

export type { GetDestinationToursResponse, GetTourDetailResponse }

// 特定の目的地のツアー一覧を取得
export async function getDestinationTours(
  destinationId: number,
): Promise<GetDestinationToursResponse['data']> {
  const response = await fetchAPI<GetDestinationToursResponse>(
    `/v1/destinations/${destinationId}/tours`,
  )
  return response.data
}

// ツアー詳細を取得（RESTfulなリソース指向）
export async function getTourDetail(
  destinationId: number,
  tourId: number,
): Promise<GetTourDetailResponse['data']> {
  const response = await fetchAPI<GetTourDetailResponse>(
    `/v1/destinations/${destinationId}/tours/${tourId}`,
  )
  return response.data
}
