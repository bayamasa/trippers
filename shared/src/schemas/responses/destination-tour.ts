import { z } from 'zod'
import { Tour } from '@trippers/shared/schemas/entities/tour'
import { Destination } from '@trippers/shared/schemas/entities/destination'
import { Area } from '@trippers/shared/schemas/entities/area'
import { TourStock } from '@trippers/shared/schemas/entities/tour-stock'

// GET /v1/destinations/:destination_slug/tours/:tour_id のレスポンス（単数形）
export const DestinationTourResponse = z.object({
  tour: Tour,
  destination: Destination,
  area: Area,
  stock: TourStock,
})
