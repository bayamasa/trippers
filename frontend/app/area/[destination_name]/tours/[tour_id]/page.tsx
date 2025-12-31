import { notFound } from 'next/navigation'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { TourHeroSection } from '@/components/tour-hero-section'
import { TourInfoSection } from '@/components/tour-info-section'
import { TourStocksSection } from '@/components/tour-stocks-section'
import { getTourDetail, type TourDetailResponse } from '@/lib/api/destinations'

interface TourDetailPageProps {
  params: Promise<{
    destination_name: string
    tour_id: string
  }>
}

async function getTourData(
  destinationName: string,
  tourId: string,
): Promise<TourDetailResponse | null> {
  try {
    // URLデコード
    const decodedDestinationName = decodeURIComponent(destinationName)
    const tourIdNum = parseInt(tourId, 10)

    if (Number.isNaN(tourIdNum)) {
      return null
    }

    // まず全ツアーを取得して、destination nameからdestination IDを特定
    // Note: より効率的にするには、バックエンドAPIにdestination nameで検索できるエンドポイントを追加することを推奨
    const allToursResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/tours`,
      {
        cache: 'no-store',
      },
    )

    if (!allToursResponse.ok) {
      return null
    }

    const { data: allTours } = await allToursResponse.json()

    // destination nameに一致するツアーを探す
    const matchingTour = allTours.find(
      (t: { tour: { id: number }; destination: { name: string } }) =>
        t.tour.id === tourIdNum &&
        t.destination.name === decodedDestinationName,
    )

    if (!matchingTour) {
      return null
    }

    // destination IDを使ってツアー詳細を取得
    const tourDetail = await getTourDetail(
      matchingTour.destination.id,
      tourIdNum,
    )

    return tourDetail
  } catch (error) {
    console.error('Error fetching tour data:', error)
    return null
  }
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { destination_name, tour_id } = await params
  const tourData = await getTourData(destination_name, tour_id)

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
        <TourStocksSection stocks={tourData.stocks} tourId={tourData.tour.id} />
      </main>
      <Footer />
    </div>
  )
}
