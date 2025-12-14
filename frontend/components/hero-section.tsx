import { Search } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function HeroSection() {
  return (
    <section className="relative flex h-[600px] items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-secondary/20" />
      <Image
        src="/beautiful-tropical-beach-paradise-with-palm-trees.jpg"
        alt="Hero background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-foreground/30" />

      <div className="container relative z-10 text-center text-white">
        <h1 className="mb-6 text-balance font-bold text-4xl md:text-6xl">
          次の冒険を見つけよう
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-balance text-lg leading-relaxed md:text-xl">
          世界中の美しい目的地を探索し、忘れられない思い出を作りましょう
        </p>

        <div className="mx-auto flex max-w-2xl flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="目的地を検索..."
              className="h-12 bg-white pl-10 text-foreground"
            />
          </div>
          <Button size="lg" className="h-12 px-8">
            検索
          </Button>
        </div>
      </div>
    </section>
  )
}
