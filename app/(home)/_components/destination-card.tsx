import { MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { TourWithDestinationAndArea } from '@/app/(home)/type'

export function DestinationCard({
  tourData,
}: {
  tourData: TourWithDestinationAndArea
}) {
  // ツアー詳細ページへのリンクを作成
  const destinationName = encodeURIComponent(tourData.destination.name);
  const href = `/area/${destinationName}/tours/${tourData.tour.id}`;

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={`/${tourData.destination.imageFilename}`}
          alt={tourData.tour.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="mb-2 text-balance font-semibold text-xl">
          {tourData.tour.title}
        </h3>
        <div className="mb-2 flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{tourData.area.name}</span>
        </div>
        <div className="mb-4 space-y-1 text-sm text-muted-foreground">
          <p>旅行日数: {tourData.tour.days}泊{tourData.tour.days + 1}日</p>
          <p>フライト: {tourData.tour.isDirectFlight ? '直行便' : '経由便'}</p>
          <p>出発空港ID: {tourData.tour.departsAirportId}</p>
          <p>航空会社ID: {tourData.tour.airlinesId}</p>
          <p>ホテルID: {tourData.tour.hotelId}</p>
        </div>
        <p className="font-bold text-2xl text-primary">
          ¥{tourData.tour.minPriceTaxIncluded.toLocaleString()}~
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={href} className="w-full">
          <Button className="w-full">詳細を見る</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

