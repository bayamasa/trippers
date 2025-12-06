import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { PopularDestinations } from "@/components/popular-destinations"
import { FeaturesSection } from "@/components/features-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <PopularDestinations />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
