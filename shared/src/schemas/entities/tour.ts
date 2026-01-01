import { z } from 'zod'

export const Tour = z.object({
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
