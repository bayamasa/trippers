import { Card, CardContent } from "@/components/ui/card"
import { Globe, Shield, Calendar, Headphones } from "lucide-react"

const features = [
  {
    icon: Globe,
    title: "世界中の目的地",
    description: "200以上の国と地域への旅行をサポート",
  },
  {
    icon: Shield,
    title: "安全な予約",
    description: "24時間体制のセキュリティで安心の予約体験",
  },
  {
    icon: Calendar,
    title: "柔軟な予約",
    description: "無料キャンセルと日程変更が可能",
  },
  {
    icon: Headphones,
    title: "24時間サポート",
    description: "いつでもお客様をサポートいたします",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-muted">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">なぜTravelExploreを選ぶのか</h2>
          <p className="text-muted-foreground text-lg text-balance max-w-2xl mx-auto leading-relaxed">
            お客様の旅をより快適で安心なものにするための特徴
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="border-none shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-balance">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
