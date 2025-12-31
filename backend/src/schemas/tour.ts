import { z } from 'zod'

export const TourSchema = z.object({
  id: z.number(),
  title: z.string(),
  minPriceTaxIncluded: z.number(),
  departsAirportId: z.number(),
  days: z.number(),
  isDirectFlight: z.boolean(),
  airlinesId: z.number(),
  hotelId: z.number(),
  thumbnailFileName: z.string(),
})

export const DestinationSchema = z.object({
  id: z.number(),
  name: z.string(),
  nameJp: z.string(),
  imageFilename: z.string(),
})

export const AreaSchema = z.object({
  name: z.string(),
  nameJp: z.string(),
})

export const TourStockSchema = z.object({
  id: z.number(),
  tourId: z.number(),
  eventStartDate: z.string(),
  maxCapacity: z.number(),
  availableCapacity: z.number(),
  createdAt: z.string(),
})

export const TourWithDestinationAndAreaSchema = z.object({
  tour: TourSchema,
  destination: DestinationSchema,
  area: AreaSchema,
})

export const TourDetailResponseSchema = z.object({
  tour: TourSchema,
  destination: DestinationSchema,
  area: AreaSchema,
  stocks: z.array(TourStockSchema),
})
