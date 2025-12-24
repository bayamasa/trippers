import { DestinationCard } from '@/app/(home)/_components/destination-card'
import { db } from '@/db'
import { areasTable, destinationsTable, toursTable } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { TourWithDestinationAndArea } from '@/app/(home)/type'

export async function PopularDestinations() {
  // RSCでデータベースからツアー情報を取得（toursTableの全項目を含む）
  const tours: TourWithDestinationAndArea[] = await db
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

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-balance font-bold text-3xl md:text-4xl">
            人気の目的地
          </h2>
          <p className="mx-auto max-w-2xl text-balance text-lg text-muted-foreground leading-relaxed">
            世界中から厳選された、最も魅力的な旅行先をご紹介します
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tours.length > 0 ? (
            tours.map((tourData) => {
              return (
                <DestinationCard
                  key={tourData.tour.id}
                  tourData={tourData}
                />
              )
            })
          ) : (
            <div className="col-span-full text-center text-muted-foreground">
              ツアーが見つかりませんでした
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

