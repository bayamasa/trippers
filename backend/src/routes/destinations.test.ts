import { db } from '@db/index'
import { createApp } from '../app'

const mockDestinationTourData = [
  {
    tour: {
      id: 1,
      title: 'バリ島リゾートツアー',
      minPriceTaxIncluded: 150000,
      departsAirportId: 1,
      days: 5,
      isDirectFlight: true,
      airlinesId: 1,
      hotelId: 1,
      thumbnailFileName: 'bali-tour.jpg',
    },
    destination: {
      id: 1,
      slug: 'bali',
      nameJp: 'バリ島',
      imageFilename: 'bali.jpg',
    },
    area: {
      name: 'asia',
      nameJp: 'アジア',
    },
    stock: {
      id: 1,
      tourId: 1,
      eventStartDate: '2025-06-01',
      maxCapacity: 20,
      createdAt: new Date('2025-01-01T00:00:00Z'),
    },
  },
]

const mockTourDetailData = {
  tour: {
    id: 1,
    destinationId: 1,
    title: 'バリ島リゾートツアー',
    minPriceTaxIncluded: 150000,
    departsAirportId: 1,
    days: 5,
    isDirectFlight: true,
    airlinesId: 1,
    hotelId: 1,
    thumbnailFileName: 'bali-tour.jpg',
    createdAt: new Date('2025-01-01T00:00:00Z'),
  },
  destination: {
    id: 1,
    areaId: 1,
    slug: 'bali',
    nameJp: 'バリ島',
    imageFilename: 'bali.jpg',
    createdAt: new Date('2025-01-01T00:00:00Z'),
  },
  area: {
    id: 1,
    name: 'asia',
    nameJp: 'アジア',
  },
  stock: {
    id: 1,
    tourId: 1,
    eventStartDate: '2025-06-01',
    maxCapacity: 20,
    createdAt: new Date('2025-01-01T00:00:00Z'),
  },
}

// Type assertion to access mock helper
const mockDb = db as typeof db & {
  _setMockSelect: (fn: () => unknown) => void
}

describe('Destinations API', () => {
  const app = createApp()

  describe('GET /v1/destinations/:destination_slug/tours', () => {
    it('should return tours for a valid destination', async () => {
      mockDb._setMockSelect(() => ({
        from: function () {
          return this
        },
        innerJoin: function () {
          return this
        },
        where: () => Promise.resolve(mockDestinationTourData),
        limit: async () => [],
      }))

      const res = await app.request('/v1/destinations/bali/tours')
      expect(res.status).toBe(200)

      const json = await res.json()
      expect(Array.isArray(json)).toBe(true)
    })

    it('should return empty array when no tours found', async () => {
      mockDb._setMockSelect(() => ({
        from: function () {
          return this
        },
        innerJoin: function () {
          return this
        },
        where: () => Promise.resolve([]),
        limit: async () => [],
      }))

      const res = await app.request('/v1/destinations/unknown/tours')
      expect(res.status).toBe(200)

      const json = await res.json()
      expect(json).toEqual([])
    })

    it('should return 400 for invalid destination_slug format', async () => {
      const res = await app.request('/v1/destinations/INVALID_SLUG!/tours')
      expect(res.status).toBe(400)
    })

    it('should return 500 when database error occurs', async () => {
      mockDb._setMockSelect(() => ({
        from: function () {
          return this
        },
        innerJoin: function () {
          return this
        },
        where: () => Promise.reject(new Error('Database error')),
        limit: async () => [],
      }))

      const res = await app.request('/v1/destinations/bali/tours')
      expect(res.status).toBe(500)

      const json = (await res.json()) as { error: string }
      expect(json.error).toBe('Failed to fetch tours')
    })
  })

  describe('GET /v1/destinations/:destination_slug/tours/:tour_id', () => {
    it('should return tour details for valid parameters', async () => {
      mockDb._setMockSelect(() => ({
        from: function () {
          return this
        },
        innerJoin: function () {
          return this
        },
        where: function () {
          return this
        },
        limit: () => Promise.resolve([mockTourDetailData]),
      }))

      const res = await app.request('/v1/destinations/bali/tours/1')
      expect(res.status).toBe(200)

      const json = (await res.json()) as {
        tour: object
        destination: object
        area: object
        stock: object
      }
      expect(json.tour).toBeDefined()
      expect(json.destination).toBeDefined()
      expect(json.area).toBeDefined()
      expect(json.stock).toBeDefined()
    })

    it('should return 404 when tour not found', async () => {
      mockDb._setMockSelect(() => ({
        from: function () {
          return this
        },
        innerJoin: function () {
          return this
        },
        where: function () {
          return this
        },
        limit: () => Promise.resolve([]),
      }))

      const res = await app.request('/v1/destinations/bali/tours/999')
      expect(res.status).toBe(404)

      const json = (await res.json()) as { error: string }
      expect(json.error).toBe('Tour not found')
    })

    it('should return 400 for invalid tour_id format', async () => {
      const res = await app.request('/v1/destinations/bali/tours/invalid')
      expect(res.status).toBe(400)
    })

    it('should return 400 for invalid destination_slug format', async () => {
      const res = await app.request('/v1/destinations/INVALID!/tours/1')
      expect(res.status).toBe(400)
    })

    it('should return 500 when database error occurs', async () => {
      mockDb._setMockSelect(() => ({
        from: function () {
          return this
        },
        innerJoin: function () {
          return this
        },
        where: function () {
          return this
        },
        limit: () => Promise.reject(new Error('Database error')),
      }))

      const res = await app.request('/v1/destinations/bali/tours/1')
      expect(res.status).toBe(500)

      const json = (await res.json()) as { error: string }
      expect(json.error).toBe('Failed to fetch tour details')
    })
  })
})
