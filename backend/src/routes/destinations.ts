import { Hono } from 'hono'
import { db } from '@db/index'
import {
  areasTable,
  destinationsTable,
  reservationEventsTable,
  tourStocksTable,
  toursTable,
} from '@db/schema'
import { and, eq, gte } from 'drizzle-orm'

const destinations = new Hono()

// GET /api/destinations/:id/tours - 特定の目的地のツアー一覧取得
destinations.get('/:id/tours', async (c) => {
  try {
    const destinationId = parseInt(c.req.param('id'), 10)

    if (isNaN(destinationId)) {
      return c.json({ error: 'Invalid destination ID' }, 400)
    }

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
      .where(eq(destinationsTable.id, destinationId))

    return c.json({ data: toursList })
  } catch (error) {
    console.error('Error fetching tours:', error)
    return c.json({ error: 'Failed to fetch tours' }, 500)
  }
})

// GET /api/destinations/:id/tours/:tour_id - ツアー詳細取得
destinations.get('/:id/tours/:tour_id', async (c) => {
  try {
    const destinationId = parseInt(c.req.param('id'), 10)
    const tourId = parseInt(c.req.param('tour_id'), 10)

    if (isNaN(destinationId) || isNaN(tourId)) {
      return c.json({ error: 'Invalid destination ID or tour ID' }, 400)
    }

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
        eq(toursTable.destinationId, destinationsTable.id)
      )
      .innerJoin(areasTable, eq(destinationsTable.areaId, areasTable.id))
      .where(
        and(
          eq(toursTable.id, tourId),
          eq(destinationsTable.id, destinationId)
        )
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
          gte(tourStocksTable.eventStartDate, today.toISOString().split('T')[0])
        )
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
              eq(reservationEventsTable.status, 'confirmed')
            )
          )

        const reservedCount = reservations.reduce(
          (sum, r) => sum + r.numberOfPeople,
          0
        )

        return {
          ...stock,
          availableCapacity: stock.maxCapacity - reservedCount,
        }
      })
    )

    return c.json({
      data: {
        tour: tour[0].tour,
        destination: tour[0].destination,
        area: tour[0].area,
        stocks: stocksWithReservations.filter(
          (stock) => stock.availableCapacity > 0
        ),
      },
    })
  } catch (error) {
    console.error('Error fetching tour details:', error)
    return c.json({ error: 'Failed to fetch tour details' }, 500)
  }
})

export { destinations as destinationsRoute }
