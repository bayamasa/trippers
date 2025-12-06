import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-balance">TravelExplore</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/destinations" className="text-sm font-medium hover:text-primary transition-colors">
            目的地
          </Link>
          <Link href="/tours" className="text-sm font-medium hover:text-primary transition-colors">
            ツアー
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
            私たちについて
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
            お問い合わせ
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
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
            <nav className="flex flex-col gap-4 mt-8">
              <Link href="/destinations" className="text-lg font-medium hover:text-primary transition-colors">
                目的地
              </Link>
              <Link href="/tours" className="text-lg font-medium hover:text-primary transition-colors">
                ツアー
              </Link>
              <Link href="/about" className="text-lg font-medium hover:text-primary transition-colors">
                私たちについて
              </Link>
              <Link href="/contact" className="text-lg font-medium hover:text-primary transition-colors">
                お問い合わせ
              </Link>
              <div className="flex flex-col gap-2 mt-4">
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
