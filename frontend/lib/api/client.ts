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

export async function fetchAPI<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // RSCでリアルタイムデータを取得
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new APIError(
        `API request failed: ${response.statusText}`,
        response.status,
        errorData,
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    throw new APIError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      500,
    )
  }
}
