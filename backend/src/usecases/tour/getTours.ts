import { db } from '@db/index'
import { areasTable, destinationsTable, toursTable } from '@db/schema'
import { eq } from 'drizzle-orm'

// Output
export interface GetToursOutput {
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
}

// Usecase
export async function execute(): Promise<GetToursOutput[]> {
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

  return toursList
}
