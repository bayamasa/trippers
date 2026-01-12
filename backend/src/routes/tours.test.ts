import { db } from '@db/index'
import { createApp } from '../app'

const mockTourData = [
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
  },
]

// Type assertion to access mock helper
const mockDb = db as typeof db & {
  _setMockSelect: (fn: () => unknown) => void
}

describe('Tours API', () => {
  const app = createApp()

  describe('GET /v1/tours', () => {
    it('should return a list of tours', async () => {
      // Create a mock chain that supports multiple innerJoin calls
      let joinCount = 0
      mockDb._setMockSelect(() => {
        const chain = {
          from: function () {
            return this
          },
          innerJoin: function () {
            joinCount++
            // Return the result on the second innerJoin call
            if (joinCount >= 2) {
              return Promise.resolve(mockTourData)
            }
            return this
          },
          where: function () {
            return this
          },
          limit: async () => [],
        }
        return chain
      })

      const res = await app.request('/v1/tours')
      expect(res.status).toBe(200)

      const json = await res.json()
      expect(Array.isArray(json)).toBe(true)
    })

    it('should return empty array when no tours', async () => {
      let joinCount = 0
      mockDb._setMockSelect(() => {
        const chain = {
          from: function () {
            return this
          },
          innerJoin: function () {
            joinCount++
            if (joinCount >= 2) {
              return Promise.resolve([])
            }
            return this
          },
          where: function () {
            return this
          },
          limit: async () => [],
        }
        return chain
      })

      const res = await app.request('/v1/tours')
      expect(res.status).toBe(200)

      const json = await res.json()
      expect(json).toEqual([])
    })
  })
})
