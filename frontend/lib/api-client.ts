const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message)
    this.name = 'APIError'
  }
}

async function fetchAPI<T>(endpoint: string): Promise<T> {
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
        errorData
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    throw new APIError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      500
    )
  }
}

export interface Tour {
  id: number
  title: string
  minPriceTaxIncluded: number
  departsAirportId: number
  days: number
  isDirectFlight: boolean
  airlinesId: number
  hotelId: number
  thumbnailFileName: string
}

export interface Destination {
  id: number
  name: string
  nameJp: string
  imageFilename: string
}

export interface Area {
  name: string
  nameJp: string
}

export interface TourStock {
  id: number
  tourId: number
  eventStartDate: string | Date
  maxCapacity: number
  availableCapacity: number
  createdAt: Date
}

export interface TourWithDestinationAndArea {
  tour: Tour
  destination: Destination
  area: Area
}

export interface TourDetailResponse {
  tour: Tour
  destination: Destination
  area: Area
  stocks: TourStock[]
}

// 全ツアー一覧を取得
export async function getTours(): Promise<TourWithDestinationAndArea[]> {
  const response = await fetchAPI<{ data: TourWithDestinationAndArea[] }>('/api/tours')
  return response.data
}

// 特定の目的地のツアー一覧を取得
export async function getDestinationTours(
  destinationId: number
): Promise<TourWithDestinationAndArea[]> {
  const response = await fetchAPI<{ data: TourWithDestinationAndArea[] }>(
    `/api/destinations/${destinationId}/tours`
  )
  return response.data
}

// ツアー詳細を取得（RESTfulなリソース指向）
export async function getTourDetail(
  destinationId: number,
  tourId: number
): Promise<TourDetailResponse> {
  const response = await fetchAPI<{ data: TourDetailResponse }>(
    `/api/destinations/${destinationId}/tours/${tourId}`
  )
  return response.data
}
