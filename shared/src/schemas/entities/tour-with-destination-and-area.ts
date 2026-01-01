import { z } from 'zod'
import { Area } from './area'
import { Destination } from './destination'
import { Tour } from './tour'

// 複合エンティティ
export const TourWithDestinationAndArea = z.object({
  tour: Tour,
  destination: Destination,
  area: Area,
})
