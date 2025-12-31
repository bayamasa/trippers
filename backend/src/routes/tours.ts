import { Hono } from 'hono'
import { db } from '@trippers/shared/db'
import {
  areasTable,
  destinationsTable,
  toursTable,
} from '@trippers/shared/schema'
import { eq } from 'drizzle-orm'

const tours = new Hono()

// GET /api/tours - 全ツアー一覧取得
tours.get('/', async (c) => {
  try {
    const toursList = await db
      .select({
        tour: {
          id: toursTable.id,
          title: toursTable.title,
          minPriceTaxIncluded: toursTable.minPriceTaxIncluded,
          departsAirportId: toursTable.departsAirportId,
          days: toursTable.days,
          isDirectFlight: toursTable.isDirectFlight,
          airlinesId: toursTable.airlinesId,
          hotelId: toursTable.hotelId,
          thumbnailFileName: toursTable.thumbnailFileName,
        },
        destination: {
          id: destinationsTable.id,
          name: destinationsTable.name,
          nameJp: destinationsTable.nameJp,
          imageFilename: destinationsTable.imageFilename,
        },
        area: {
          name: areasTable.name,
          nameJp: areasTable.nameJp,
        },
      })
      .from(toursTable)
      .innerJoin(
        destinationsTable,
        eq(toursTable.destinationId, destinationsTable.id)
      )
      .innerJoin(areasTable, eq(destinationsTable.areaId, areasTable.id))

    return c.json({ data: toursList })
  } catch (error) {
    console.error('Error fetching tours:', error)
    return c.json({ error: 'Failed to fetch tours' }, 500)
  }
})

export { tours as toursRoute }
