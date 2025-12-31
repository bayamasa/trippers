import { CTASection } from '@/app/(home)/_components/cta-section'
import { FeaturesSection } from '@/app/(home)/_components/features-section'
import { HeroSection } from '@/app/(home)/_components/hero-section'
import { PopularDestinations } from '@/app/(home)/_components/popular-destinations'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto max-w-7xl flex-1">
        <HeroSection />
        <PopularDestinations />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
