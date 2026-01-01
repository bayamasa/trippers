import { z } from 'zod'
import { TourWithDestinationAndArea } from '../entities'

// GET /v1/tours のレスポンス（複数形）
export const ToursResponse = z.array(TourWithDestinationAndArea)
