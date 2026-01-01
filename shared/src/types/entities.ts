import type { z } from 'zod'
import type {
  Area,
  Destination,
  Tour,
  TourStock,
  TourWithDestinationAndArea,
} from '../schemas/entities'

export type Area = z.infer<typeof Area>
export type Destination = z.infer<typeof Destination>
export type Tour = z.infer<typeof Tour>
export type TourStock = z.infer<typeof TourStock>
export type TourWithDestinationAndArea = z.infer<typeof TourWithDestinationAndArea>
