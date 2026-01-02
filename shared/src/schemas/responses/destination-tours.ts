import { z } from 'zod'
import { TourWithDestinationAndAreaAndStock } from '@trippers/shared/schemas/entities'

// GET /v1/destinations/:destination_slug/tours のレスポンス（複数形）
export const DestinationToursResponse = z.array(TourWithDestinationAndAreaAndStock)
