import { db } from '@db/index'
import { areasTable, destinationsTable, toursTable } from '@db/schema'
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { ToursResponse } from '@trippers/shared/schemas/responses'
import { eq } from 'drizzle-orm'

const tours = new OpenAPIHono()

// GET /api/tours - 全ツアー一覧取得
const getToursRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Tours'],
  summary: '全ツアー一覧を取得',
  description: 'すべてのツアー情報を目的地とエリア情報と共に取得します',
  responses: {
    200: {
      description: 'ツアー一覧の取得に成功',
      content: {
        'application/json': {
          schema: ToursResponse,
        },
      },
    },
    500: {
      description: 'サーバーエラー',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
  },
})

tours.openapi(getToursRoute, async (c) => {
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
          slug: destinationsTable.slug,
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
        eq(toursTable.destinationId, destinationsTable.id),
      )
      .innerJoin(areasTable, eq(destinationsTable.areaId, areasTable.id))

    return c.json(toursList, 200)
  } catch (error) {
    console.error('Error fetching tours:', error)
    return c.json({ error: 'Failed to fetch tours' }, 500)
  }
})

export { tours as toursRoute }
