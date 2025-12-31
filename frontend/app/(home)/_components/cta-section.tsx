import { Button } from '@/components/ui/button'

export function CTASection() {
  return (
    <section className="bg-primary py-16 text-primary-foreground md:py-24">
      <div className="container text-center">
        <h2 className="mb-4 text-balance font-bold text-3xl md:text-4xl">
          今すぐ冒険を始めよう
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-balance text-lg leading-relaxed opacity-90">
          特別なオファーと割引で、夢の旅行を現実にしましょう
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button size="lg" variant="secondary" className="h-12 px-8">
            目的地を探す
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 border-primary-foreground bg-transparent px-8 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
          >
            お問い合わせ
          </Button>
        </div>
      </div>
    </section>
  )
}

