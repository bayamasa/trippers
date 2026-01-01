import createClient from 'openapi-fetch'
import type { paths } from '@/api/generated'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const client = createClient<paths>({
  baseUrl: API_BASE_URL,
  cache: 'no-store',
})

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message)
    this.name = 'APIError'
  }
}
