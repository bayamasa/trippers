import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-secondary/20" />
      <img
        src="/beautiful-tropical-beach-paradise-with-palm-trees.jpg"
        alt="Hero background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-foreground/30" />

      <div className="relative z-10 container text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">次の冒険を見つけよう</h1>
        <p className="text-lg md:text-xl mb-8 text-balance max-w-2xl mx-auto leading-relaxed">
          世界中の美しい目的地を探索し、忘れられない思い出を作りましょう
        </p>

        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="目的地を検索..." className="pl-10 h-12 bg-white text-foreground" />
          </div>
          <Button size="lg" className="h-12 px-8">
            検索
          </Button>
        </div>
      </div>
    </section>
  )
}
