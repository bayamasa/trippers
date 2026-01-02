import type {
  DestinationTourResponse,
  DestinationToursResponse,
} from '@trippers/shared/types'
import { apiClient } from '../client'

// 特定の目的地のツアー一覧を取得
export async function getDestinationTours(
  destinationSlug: string,
): Promise<DestinationToursResponse> {
  return apiClient<DestinationToursResponse>(
    `/v1/destinations/${destinationSlug}/tours`,
  )
}

// ツアー詳細を取得（RESTfulなリソース指向）
export async function getDestinationTour(
  destinationSlug: string,
  tourId: number,
): Promise<DestinationTourResponse> {
  return apiClient<DestinationTourResponse>(
    `/v1/destinations/${destinationSlug}/tours/${tourId}`,
  )
}
