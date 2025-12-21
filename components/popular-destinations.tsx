import { DestinationCard } from './destination-card'
import { db } from '@/db'
import { destinationsTable } from '@/db/schema'

// デフォルトのロケーション、価格のマッピング
const destinationDefaults: Record<
  string,
  { location: string; price: string; image: string }
> = {
  'バリ島': {
    location: 'インドネシア',
    price: '¥89,000~',
    image: 'bali-beach-sunset.png',
  },
  'パリ': {
    location: 'フランス',
    price: '¥125,000~',
    image: 'eiffel-tower-paris.png',
  },
  'モルディブ': {
    location: 'インド洋',
    price: '¥180,000~',
    image: 'maldives-overwater-bungalows.png',
  },
  '京都': {
    location: '日本',
    price: '¥45,000~',
    image: 'kyoto-temple-cherry-blossoms.png',
  },
  'サントリーニ': {
    location: 'ギリシャ',
    price: '¥150,000~',
    image: 'santorini-white-blue.png',
  },
  'ドバイ': {
    location: 'アラブ首長国連邦',
    price: '¥110,000~',
    image: 'dubai-burj-khalifa-skyline.jpg',
  },
}

// フォールバック用のデフォルトデータ
const fallbackDestinations = Object.entries(destinationDefaults).map(
  ([name, data], index) => ({
    id: index + 1,
    name,
    imageFilename: data.image,
    createdAt: new Date(),
  })
)

export async function PopularDestinations() {
  // RSCでデータベースからデータを取得
  let destinations
  try {
    destinations = await db.select().from(destinationsTable)
    console.log('✅ Successfully fetched destinations from database')
    console.log(`   Count: ${destinations.length}`)
    console.log('   Destinations:', destinations.map((d) => ({
      id: d.id,
      name: d.name,
      imageFilename: d.imageFilename,
    })))
  } catch (error) {
    console.error('❌ Failed to fetch destinations from database:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    // データベース接続エラーの場合は、フォールバックデータを使用
    destinations = fallbackDestinations
    console.log('⚠️ Using fallback destinations:', fallbackDestinations.length)
  }

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
          {destinations.map((destination) => {
            const defaults = destinationDefaults[destination.name] || {
              location: '不明',
              price: '¥0~',
            }
            return (
              <DestinationCard
                key={destination.id}
                name={destination.name}
                location={defaults.location}
                image={`/${destination.imageFilename}`}
                price={defaults.price}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
