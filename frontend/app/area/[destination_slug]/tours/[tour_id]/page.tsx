import { notFound } from 'next/navigation'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { TourHeroSection } from '@/components/tour-hero-section'
import { TourInfoSection } from '@/components/tour-info-section'
import { TourStockSection } from '@/components/tour-stock-section'
import { getDestinationTours } from '@/lib/api/destinations'

interface TourDetailPageProps {
  params: Promise<{
    destination_slug: string
    tour_id: string
  }>
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { destination_slug, tour_id } = await params

  const tourIdNum = parseInt(tour_id, 10)

  if (Number.isNaN(tourIdNum)) {
    notFound()
  }

  // slugを直接使用してAPI呼び出し
  const destinationTours = await getDestinationTours(destination_slug)

  // tour_idに一致するツアーを探す
  const tourData = destinationTours.find((t) => t.tour.id === tourIdNum)

  if (!tourData) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <TourHeroSection
          title={tourData.tour.title}
          thumbnailFileName={tourData.tour.thumbnailFileName}
        />
        <TourInfoSection
          tour={tourData.tour}
          destination={tourData.destination}
          area={tourData.area}
        />
        <TourStockSection stock={tourData.stock} tourId={tourData.tour.id} />
      </main>
      <Footer />
    </div>
  )
}
