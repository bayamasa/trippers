import { z } from 'zod'
import { TourWithDestinationAndArea } from '../entities'

// GET /v1/destinations/:destination_id/tours のレスポンス（複数形）
export const DestinationToursResponse = z.array(TourWithDestinationAndArea)
