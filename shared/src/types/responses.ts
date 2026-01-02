import type { z } from 'zod'
import type {
  DestinationTourResponse,
  DestinationToursResponse,
  ToursResponse,
} from '@trippers/shared/schemas/responses'

export type DestinationTourResponse = z.infer<typeof DestinationTourResponse>
export type DestinationToursResponse = z.infer<typeof DestinationToursResponse>
export type ToursResponse = z.infer<typeof ToursResponse>
