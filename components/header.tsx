import { MapPin, Menu } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 pl-4">
          <MapPin className="h-6 w-6 text-primary" />
          <span className="text-balance font-bold text-xl">TravelExplore</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/destinations"
            className="font-medium text-sm transition-colors hover:text-primary"
          >
            目的地
          </Link>
          <Link
            href="/tours"
            className="font-medium text-sm transition-colors hover:text-primary"
          >
            ツアー
          </Link>
          <Link
            href="/about"
            className="font-medium text-sm transition-colors hover:text-primary"
          >
            私たちについて
          </Link>
          <Link
            href="/contact"
            className="font-medium text-sm transition-colors hover:text-primary"
          >
            お問い合わせ
          </Link>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Button variant="ghost">ログイン</Button>
          <Button>予約する</Button>
        </div>

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">メニューを開く</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="mt-8 flex flex-col gap-4">
              <Link
                href="/destinations"
                className="font-medium text-lg transition-colors hover:text-primary"
              >
                目的地
              </Link>
              <Link
                href="/tours"
                className="font-medium text-lg transition-colors hover:text-primary"
              >
                ツアー
              </Link>
              <Link
                href="/about"
                className="font-medium text-lg transition-colors hover:text-primary"
              >
                私たちについて
              </Link>
              <Link
                href="/contact"
                className="font-medium text-lg transition-colors hover:text-primary"
              >
                お問い合わせ
              </Link>
              <div className="mt-4 flex flex-col gap-2">
                <Button variant="outline" className="w-full bg-transparent">
                  ログイン
                </Button>
                <Button className="w-full">予約する</Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
