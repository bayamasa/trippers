import { CTASection } from '@/app/(home)/_components/cta-section'
import { FeaturesSection } from '@/app/(home)/_components/features-section'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { HeroSection } from '@/app/(home)/_components/hero-section'
import { PopularDestinations } from '@/app/(home)/_components/popular-destinations'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 mx-auto max-w-7xl">
        <HeroSection />
        <PopularDestinations />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

