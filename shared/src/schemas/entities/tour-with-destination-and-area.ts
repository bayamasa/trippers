import { z } from 'zod'
import { Area } from '@trippers/shared/schemas/entities/area'
import { Destination } from '@trippers/shared/schemas/entities/destination'
import { Tour } from '@trippers/shared/schemas/entities/tour'
import { TourStock } from '@trippers/shared/schemas/entities/tour-stock'

// 複合エンティティ（在庫情報なし）
export const TourWithDestinationAndArea = z.object({
  tour: Tour,
  destination: Destination,
  area: Area,
})

// 複合エンティティ（在庫情報含む）
export const TourWithDestinationAndAreaAndStock = TourWithDestinationAndArea.extend({
  stock: TourStock,
})
