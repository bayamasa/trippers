import { z } from 'zod'

export const Destination = z.object({
  id: z.number(),
  name: z.string(),
  nameJp: z.string(),
  imageFilename: z.string(),
})
