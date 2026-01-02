const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

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

export async function apiClient<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new APIError(
      `API request failed: ${response.statusText}`,
      response.status,
      errorData,
    )
  }

  return response.json()
}
