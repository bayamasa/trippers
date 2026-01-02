import { db } from '@db/index'
import {
  areasTable,
  destinationsTable,
  tourStocksTable,
  toursTable,
} from '@db/schema'
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import {
  DestinationTourResponse,
  DestinationToursResponse,
} from '@trippers/shared/schemas/responses'
import { and, eq } from 'drizzle-orm'

const destinations = new OpenAPIHono()

// GET /v1/destinations/:destination_slug/tours - 特定の目的地のツアー一覧取得
const getDestinationToursRoute = createRoute({
  method: 'get',
  path: '/:destination_slug/tours',
  tags: ['Destinations'],
  summary: '特定の目的地のツアー一覧を取得',
  description: '指定された目的地のツアー情報を取得します',
  request: {
    params: z.object({
      destination_slug: z
        .string()
        .regex(/^[a-z0-9-]+$/)
        .openapi({
          param: {
            name: 'destination_slug',
            in: 'path',
          },
          example: 'bali',
        }),
    }),
  },
  responses: {
    200: {
      description: 'ツアー一覧の取得に成功',
      content: {
        'application/json': {
          schema: DestinationToursResponse,
        },
      },
    },
    400: {
      description: '不正なパラメータ',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
          }),
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

destinations.openapi(getDestinationToursRoute, async (c) => {
  try {
    const { destination_slug: destinationSlug } = c.req.valid('param')

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
        stock: {
          id: tourStocksTable.id,
          tourId: tourStocksTable.tourId,
          eventStartDate: tourStocksTable.eventStartDate,
          maxCapacity: tourStocksTable.maxCapacity,
          createdAt: tourStocksTable.createdAt,
        },
      })
      .from(toursTable)
      .innerJoin(
        destinationsTable,
        eq(toursTable.destinationId, destinationsTable.id),
      )
      .innerJoin(areasTable, eq(destinationsTable.areaId, areasTable.id))
      .innerJoin(tourStocksTable, eq(toursTable.id, tourStocksTable.tourId))
      .where(eq(destinationsTable.slug, destinationSlug))

    const result = toursList.map((row) => ({
      tour: row.tour,
      destination: row.destination,
      area: row.area,
      stock: {
        id: row.stock.id,
        tourId: row.stock.tourId,
        eventStartDate: row.stock.eventStartDate,
        maxCapacity: row.stock.maxCapacity,
        availableCapacity: row.stock.maxCapacity,
        createdAt: row.stock.createdAt.toISOString(),
      },
    }))

    return c.json(result, 200)
  } catch (error) {
    console.error('Error fetching tours:', error)
    return c.json({ error: 'Failed to fetch tours' }, 500)
  }
})

// GET /api/destinations/:destination_slug/tours/:tour_id - ツアー詳細取得
const getDestinationTourRoute = createRoute({
  method: 'get',
  path: '/:destination_slug/tours/:tour_id',
  tags: ['Destinations'],
  summary: 'ツアー詳細を取得',
  description: '指定されたツアーの詳細情報と在庫情報を取得します',
  request: {
    params: z.object({
      destination_slug: z
        .string()
        .regex(/^[a-z0-9-]+$/)
        .openapi({
          param: {
            name: 'destination_slug',
            in: 'path',
          },
          example: 'bali',
        }),
      tour_id: z
        .string()
        .regex(/^\d+$/)
        .transform(Number)
        .openapi({
          param: {
            name: 'tour_id',
            in: 'path',
          },
          example: '1',
        }),
    }),
  },
  responses: {
    200: {
      description: 'ツアー詳細の取得に成功',
      content: {
        'application/json': {
          schema: DestinationTourResponse,
        },
      },
    },
    400: {
      description: '不正なパラメータ',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
    404: {
      description: 'ツアーが見つかりません',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
          }),
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

destinations.openapi(getDestinationTourRoute, async (c) => {
  try {
    const { destination_slug: destinationSlug, tour_id: tourId } =
      c.req.valid('param')

    const result = await db
      .select({
        tour: toursTable,
        destination: destinationsTable,
        area: areasTable,
        stock: {
          id: tourStocksTable.id,
          tourId: tourStocksTable.tourId,
          eventStartDate: tourStocksTable.eventStartDate,
          maxCapacity: tourStocksTable.maxCapacity,
          createdAt: tourStocksTable.createdAt,
        },
      })
      .from(toursTable)
      .innerJoin(
        destinationsTable,
        eq(toursTable.destinationId, destinationsTable.id),
      )
      .innerJoin(areasTable, eq(destinationsTable.areaId, areasTable.id))
      .innerJoin(tourStocksTable, eq(toursTable.id, tourStocksTable.tourId))
      .where(
        and(
          eq(toursTable.id, tourId),
          eq(destinationsTable.slug, destinationSlug),
        ),
      )
      .limit(1)

    if (result.length === 0) {
      return c.json({ error: 'Tour not found' }, 404)
    }

    const row = result[0]

    return c.json(
      {
        tour: row.tour,
        destination: row.destination,
        area: row.area,
        stock: {
          id: row.stock.id,
          tourId: row.stock.tourId,
          eventStartDate: row.stock.eventStartDate,
          maxCapacity: row.stock.maxCapacity,
          availableCapacity: row.stock.maxCapacity,
          createdAt: row.stock.createdAt.toISOString(),
        },
      },
      200,
    )
  } catch (error) {
    console.error('Error fetching tour details:', error)
    return c.json({ error: 'Failed to fetch tour details' }, 500)
  }
})

export { destinations as destinationsRoute }
