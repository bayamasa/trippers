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
import { and, eq, gte } from 'drizzle-orm'

const destinations = new OpenAPIHono()

// GET /api/destinations/:destination_id/tours - 特定の目的地のツアー一覧取得
const getDestinationToursRoute = createRoute({
  method: 'get',
  path: '/:destination_id/tours',
  tags: ['Destinations'],
  summary: '特定の目的地のツアー一覧を取得',
  description: '指定された目的地のツアー情報を取得します',
  request: {
    params: z.object({
      destination_id: z
        .string()
        .regex(/^\d+$/)
        .transform(Number)
        .openapi({
          param: {
            name: 'destination_id',
            in: 'path',
          },
          example: '1',
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
    const { destination_id: destinationId } = c.req.valid('param')

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
        eq(toursTable.destinationId, destinationsTable.id),
      )
      .innerJoin(areasTable, eq(destinationsTable.areaId, areasTable.id))
      .where(eq(destinationsTable.id, destinationId))

    return c.json(toursList, 200)
  } catch (error) {
    console.error('Error fetching tours:', error)
    return c.json({ error: 'Failed to fetch tours' }, 500)
  }
})

// GET /api/destinations/:destination_id/tours/:tour_id - ツアー詳細取得
const getTourDetailRoute = createRoute({
  method: 'get',
  path: '/:destination_id/tours/:tour_id',
  tags: ['Destinations'],
  summary: 'ツアー詳細を取得',
  description: '指定されたツアーの詳細情報と在庫情報を取得します',
  request: {
    params: z.object({
      destination_id: z
        .string()
        .regex(/^\d+$/)
        .transform(Number)
        .openapi({
          param: {
            name: 'destination_id',
            in: 'path',
          },
          example: '1',
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

destinations.openapi(getTourDetailRoute, async (c) => {
  try {
    const { destination_id: destinationId, tour_id: tourId } =
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
        and(eq(toursTable.id, tourId), eq(destinationsTable.id, destinationId)),
      )
      .limit(1)

    if (tour.length === 0) {
      return c.json({ error: 'Tour not found' }, 404)
    }

    // 利用可能な在庫情報を取得（未来の日付のみ）
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const stocks = await db
      .select()
      .from(tourStocksTable)
      .where(
        and(
          eq(tourStocksTable.tourId, tourId),
          gte(
            tourStocksTable.eventStartDate,
            today.toISOString().split('T')[0],
          ),
        ),
      )
      .orderBy(tourStocksTable.eventStartDate)

    // 各在庫の予約数を取得
    const stocksWithReservations = await Promise.all(
      stocks.map(async (stock) => {
        const reservations = await db
          .select({
            numberOfPeople: reservationEventsTable.numberOfPeople,
          })
          .from(reservationEventsTable)
          .where(
            and(
              eq(reservationEventsTable.tourStockId, stock.id),
              eq(reservationEventsTable.status, 'confirmed'),
            ),
          )

        const reservedCount = reservations.reduce(
          (sum, r) => sum + r.numberOfPeople,
          0,
        )

        return {
          id: stock.id,
          tourId: stock.tourId,
          eventStartDate: stock.eventStartDate,
          maxCapacity: stock.maxCapacity,
          availableCapacity: stock.maxCapacity - reservedCount,
          createdAt: stock.createdAt.toISOString(),
        }
      }),
    )

    return c.json(
      {
        tour: tour[0].tour,
        destination: tour[0].destination,
        area: tour[0].area,
        stocks: stocksWithReservations.filter(
          (stock) => stock.availableCapacity > 0,
        ),
      },
      200,
    )
  } catch (error) {
    console.error('Error fetching tour details:', error)
    return c.json({ error: 'Failed to fetch tour details' }, 500)
  }
})

export { destinations as destinationsRoute }
