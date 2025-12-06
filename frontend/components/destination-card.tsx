import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Star } from "lucide-react"

interface DestinationCardProps {
  name: string
  location: string
  image: string
  rating: number
  price: string
}

export function DestinationCard({ name, location, image, rating, price }: DestinationCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
          <Star className="h-4 w-4 fill-accent text-accent" />
          {rating}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold mb-2 text-balance">{name}</h3>
        <div className="flex items-center gap-1 text-muted-foreground mb-4">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{location}</span>
        </div>
        <p className="text-2xl font-bold text-primary">{price}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full">詳細を見る</Button>
      </CardFooter>
    </Card>
  )
}
