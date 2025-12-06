import { DestinationCard } from "./destination-card"

const destinations = [
  {
    name: "バリ島",
    location: "インドネシア",
    image: "/bali-beach-sunset.png",
    rating: 4.8,
    price: "¥89,000~",
  },
  {
    name: "パリ",
    location: "フランス",
    image: "/eiffel-tower-paris.png",
    rating: 4.9,
    price: "¥125,000~",
  },
  {
    name: "モルディブ",
    location: "インド洋",
    image: "/maldives-overwater-bungalows.png",
    rating: 4.9,
    price: "¥180,000~",
  },
  {
    name: "京都",
    location: "日本",
    image: "/kyoto-temple-cherry-blossoms.png",
    rating: 4.7,
    price: "¥45,000~",
  },
  {
    name: "サントリーニ",
    location: "ギリシャ",
    image: "/santorini-white-blue.png",
    rating: 4.8,
    price: "¥150,000~",
  },
  {
    name: "ドバイ",
    location: "アラブ首長国連邦",
    image: "/dubai-burj-khalifa-skyline.jpg",
    rating: 4.6,
    price: "¥110,000~",
  },
]

export function PopularDestinations() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">人気の目的地</h2>
          <p className="text-muted-foreground text-lg text-balance max-w-2xl mx-auto leading-relaxed">
            世界中から厳選された、最も魅力的な旅行先をご紹介します
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <DestinationCard key={destination.name} {...destination} />
          ))}
        </div>
      </div>
    </section>
  )
}
