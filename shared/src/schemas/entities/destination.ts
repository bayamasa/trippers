import { z } from 'zod'

export const Destination = z.object({
  id: z.number(),
  slug: z.string(),
  nameJp: z.string(),
  imageFilename: z.string(),
})
