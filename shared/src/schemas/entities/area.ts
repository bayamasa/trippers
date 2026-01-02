import { z } from 'zod'

export const Area = z.object({
  name: z.string(),
  nameJp: z.string(),
})
