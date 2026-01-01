import { z } from 'zod'

export const TourStock = z.object({
  id: z.number(),
  tourId: z.number(),
  eventStartDate: z.string(),
  maxCapacity: z.number(),
  availableCapacity: z.number(),
  createdAt: z.string(),
})
