import { db } from '@db/index'
import {
  areasTable,
  destinationsTable,
  reservationEventsTable,
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
      })
      .from(toursTable)
      .innerJoin(
        destinationsTable,
        eq(toursTable.destinationId, destinationsTable.id),
      )
      .innerJoin(areasTable, eq(destinationsTable.areaId, areasTable.id))
      .where(eq(destinationsTable.slug, destinationSlug))

    // 各ツアーの在庫情報を取得（1ツアー = 1 stock）
    const toursWithStock = await Promise.all(
      toursList.map(async (tourData) => {
        const stockResult = await db
          .select()
          .from(tourStocksTable)
          .where(eq(tourStocksTable.tourId, tourData.tour.id))
          .limit(1)

        if (stockResult.length === 0) {
          throw new Error(`Stock not found for tour ${tourData.tour.id}`)
        }

        const stockData = stockResult[0]

        // 在庫の予約数を取得
        const reservations = await db
          .select({
            numberOfPeople: reservationEventsTable.numberOfPeople,
          })
          .from(reservationEventsTable)
          .where(
            and(
              eq(reservationEventsTable.tourStockId, stockData.id),
              eq(reservationEventsTable.status, 'confirmed'),
            ),
          )

        const reservedCount = reservations.reduce(
          (sum, r) => sum + r.numberOfPeople,
          0,
        )

        return {
          ...tourData,
          stock: {
            id: stockData.id,
            tourId: stockData.tourId,
            eventStartDate: stockData.eventStartDate,
            maxCapacity: stockData.maxCapacity,
            availableCapacity: stockData.maxCapacity - reservedCount,
            createdAt: stockData.createdAt.toISOString(),
          },
        }
      }),
    )

    return c.json(toursWithStock, 200)
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

    // ツアー情報を取得
    const tour = await db
      .select({
        tour: toursTable,
        destination: destinationsTable,
        area: areasTable,
      })
      .from(toursTable)
      .innerJoin(
        destinationsTable,
        eq(toursTable.destinationId, destinationsTable.id),
      )
      .innerJoin(areasTable, eq(destinationsTable.areaId, areasTable.id))
      .where(
        and(eq(toursTable.id, tourId), eq(destinationsTable.slug, destinationSlug)),
      )
      .limit(1)

    if (tour.length === 0) {
      return c.json({ error: 'Tour not found' }, 404)
    }

    // 在庫情報を取得（1ツアー = 1 stock）
    const stockResult = await db
      .select()
      .from(tourStocksTable)
      .where(eq(tourStocksTable.tourId, tourId))
      .limit(1)

    if (stockResult.length === 0) {
      return c.json({ error: 'Stock not found' }, 404)
    }

    const stockData = stockResult[0]

    // 在庫の予約数を取得
    const reservations = await db
      .select({
        numberOfPeople: reservationEventsTable.numberOfPeople,
      })
      .from(reservationEventsTable)
      .where(
        and(
          eq(reservationEventsTable.tourStockId, stockData.id),
          eq(reservationEventsTable.status, 'confirmed'),
        ),
      )

    const reservedCount = reservations.reduce(
      (sum, r) => sum + r.numberOfPeople,
      0,
    )

    return c.json(
      {
        tour: tour[0].tour,
        destination: tour[0].destination,
        area: tour[0].area,
        stock: {
          id: stockData.id,
          tourId: stockData.tourId,
          eventStartDate: stockData.eventStartDate,
          maxCapacity: stockData.maxCapacity,
          availableCapacity: stockData.maxCapacity - reservedCount,
          createdAt: stockData.createdAt.toISOString(),
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
