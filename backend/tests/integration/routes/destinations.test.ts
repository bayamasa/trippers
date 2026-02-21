import { createApp } from '../../../src/app'

const app = createApp()

describe('Destinations API - Integration', () => {
  describe('GET /v1/destinations/:destination_slug/tours', () => {
    it('should return tours for a valid destination slug (bali)', async () => {
      const res = await app.request('/v1/destinations/bali/tours')

      expect(res.status).toBe(200)

      const json = (await res.json()) as Array<{
        tour: {
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
        destination: {
          id: number
          slug: string
          nameJp: string
          imageFilename: string
        }
        area: {
          name: string
          nameJp: string
        }
        stock: {
          id: number
          tourId: number
          eventStartDate: string
          maxCapacity: number
          availableCapacity: number
          createdAt: string
        }
      }>

      expect(Array.isArray(json)).toBe(true)
      expect(json.length).toBeGreaterThan(0)

      const firstItem = json[0]
      expect(firstItem.tour).toBeDefined()
      expect(firstItem.destination).toBeDefined()
      expect(firstItem.area).toBeDefined()
      expect(firstItem.stock).toBeDefined()

      // All results should be for 'bali'
      for (const item of json) {
        expect(item.destination.slug).toBe('bali')
      }

      expect(typeof firstItem.stock.id).toBe('number')
      expect(typeof firstItem.stock.eventStartDate).toBe('string')
      expect(typeof firstItem.stock.maxCapacity).toBe('number')
      expect(typeof firstItem.stock.availableCapacity).toBe('number')
      expect(typeof firstItem.stock.createdAt).toBe('string')
    })
  })
})
