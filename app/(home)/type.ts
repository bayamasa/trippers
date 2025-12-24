import { areasSchema, destinationsSchema, toursSchema } from '@/db/type'
import { z } from 'zod'

// JOINした結果のスキーマ（使用するフィールドのみをpick）
export const tourWithDestinationAndAreaSchema = z.object({
  tour: toursSchema.pick({
    id: true,
    title: true,
    minPriceTaxIncluded: true,
    departsAirportId: true,
    days: true,
    isDirectFlight: true,
    airlinesId: true,
    hotelId: true,
  }),
  destination: destinationsSchema.pick({
    id: true,
    name: true,
    imageFilename: true,
  }),
  area: areasSchema.pick({
    name: true,
  }),
})

// 型推論
export type TourWithDestinationAndArea = z.infer<typeof tourWithDestinationAndAreaSchema>

