import type {
  ToursResponse,
  TourWithDestinationAndArea,
} from '@trippers/shared/types'
import { APIError, apiClient } from '../client'

// 全ツアー一覧を取得
export async function getTours(): Promise<ToursResponse> {
  const response = await apiClient<ToursResponse>('/v1/tours')
  return response
}
