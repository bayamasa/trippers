import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">今すぐ冒険を始めよう</h2>
        <p className="text-lg mb-8 text-balance max-w-2xl mx-auto leading-relaxed opacity-90">
          特別なオファーと割引で、夢の旅行を現実にしましょう
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" className="h-12 px-8">
            目的地を探す
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
          >
            お問い合わせ
          </Button>
        </div>
      </div>
    </section>
  )
}
