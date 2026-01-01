import { z } from 'zod'
import { Tour } from '../entities/tour'
import { Destination } from '../entities/destination'
import { Area } from '../entities/area'
import { TourStock } from '../entities/tour-stock'

// GET /v1/destinations/:destination_id/tours/:tour_id のレスポンス（単数形）
export const DestinationTourResponse = z.object({
  tour: Tour,
  destination: Destination,
  area: Area,
  stocks: z.array(TourStock),
})
