import { Calendar, Globe, Headphones, Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    icon: Globe,
    title: '世界中の目的地',
    description: '200以上の国と地域への旅行をサポート',
  },
  {
    icon: Shield,
    title: '安全な予約',
    description: '24時間体制のセキュリティで安心の予約体験',
  },
  {
    icon: Calendar,
    title: '柔軟な予約',
    description: '無料キャンセルと日程変更が可能',
  },
  {
    icon: Headphones,
    title: '24時間サポート',
    description: 'いつでもお客様をサポートいたします',
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-muted py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-balance font-bold text-3xl md:text-4xl">
            なぜTravelExploreを選ぶのか
          </h2>
          <p className="mx-auto max-w-2xl text-balance text-lg text-muted-foreground leading-relaxed">
            お客様の旅をより快適で安心なものにするための特徴
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="border-none shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-balance font-semibold text-lg">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
