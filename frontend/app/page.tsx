import { CTASection } from '@/components/cta-section'
import { FeaturesSection } from '@/components/features-section'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { HeroSection } from '@/components/hero-section'
import { PopularDestinations } from '@/components/popular-destinations'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
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
