import type { GetToursResponse } from '@/lib/api/tours'

// OpenAPI生成型から型を派生
export type TourWithDestinationAndArea = GetToursResponse['data'][number]
