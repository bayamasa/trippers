import { z } from 'zod'
import { Area } from '@trippers/shared/schemas/entities/area'
import { Destination } from '@trippers/shared/schemas/entities/destination'
import { Tour } from '@trippers/shared/schemas/entities/tour'
import { TourStock } from '@trippers/shared/schemas/entities/tour-stock'

// 複合エンティティ
export const TourWithDestinationAndArea = z.object({
  tour: Tour,
  destination: Destination,
  area: Area,
  stock: TourStock,
})
