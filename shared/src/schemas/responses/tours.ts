import { z } from 'zod'
import { TourWithDestinationAndArea } from '@trippers/shared/schemas/entities'

// GET /v1/tours のレスポンス（複数形）- stockなし
export const ToursResponse = z.array(TourWithDestinationAndArea)
