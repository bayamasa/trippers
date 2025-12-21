import { MapPin } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

interface DestinationCardProps {
  name: string
  location: string
  image: string
  price: string
}

export function DestinationCard({
  name,
  location,
  image,
  price,
}: DestinationCardProps) {
  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image || '/placeholder.svg'}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="mb-2 text-balance font-semibold text-xl">{name}</h3>
        <div className="mb-4 flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{location}</span>
        </div>
        <p className="font-bold text-2xl text-primary">{price}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full">詳細を見る</Button>
      </CardFooter>
    </Card>
  )
}
