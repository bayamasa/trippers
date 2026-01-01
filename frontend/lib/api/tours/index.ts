import type { paths } from '@/api/generated'
import { APIError, client } from '../client'

// 生成された型からレスポンス型を抽出
type GetToursApiResponse =
  paths['/v1/tours']['get']['responses']['200']['content']['application/json']

// dataの中身を取り出した型
export type GetToursResponse = GetToursApiResponse['data']

// 個別のツアーデータ型
export type TourWithDestinationAndArea = GetToursResponse[number]

// 全ツアー一覧を取得
export async function getTours(): Promise<GetToursResponse> {
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
