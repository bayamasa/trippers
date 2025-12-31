import type { paths } from '@/api/generated'
import { fetchAPI } from '../client'

// 生成された型からレスポンス型を抽出
type GetToursResponse =
  paths['/v1/tours']['get']['responses']['200']['content']['application/json']

export type { GetToursResponse }

// 全ツアー一覧を取得
export async function getTours(): Promise<GetToursResponse['data']> {
  const response = await fetchAPI<GetToursResponse>('/v1/tours')
  return response.data
}
