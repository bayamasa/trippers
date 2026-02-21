import { createApp } from '../../../src/app'

const app = createApp()

describe('Tours API - Integration', () => {
  describe('GET /v1/tours', () => {
    it('should return an array of tours with seed data', async () => {
      const res = await app.request('/v1/tours')

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
      }>

      expect(Array.isArray(json)).toBe(true)
      expect(json.length).toBeGreaterThan(0)

      const firstTour = json[0]
      expect(firstTour.tour).toBeDefined()
      expect(firstTour.destination).toBeDefined()
      expect(firstTour.area).toBeDefined()
      expect(typeof firstTour.tour.id).toBe('number')
      expect(typeof firstTour.tour.title).toBe('string')
      expect(typeof firstTour.tour.minPriceTaxIncluded).toBe('number')
      expect(typeof firstTour.destination.slug).toBe('string')
      expect(typeof firstTour.area.name).toBe('string')
    })
  })
})
