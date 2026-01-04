'use client'

import { MapPin, Menu } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '@/lib/auth/context'

export function Header() {
  const { user, logout, isLoading } = useAuth()

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
          {isLoading ? (
            <div className="h-9 w-20 animate-pulse rounded bg-muted" />
          ) : user ? (
            <>
              <span className="text-muted-foreground text-sm">
                {user.email}
              </span>
              <Button variant="ghost" onClick={logout}>
                ログアウト
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">ログイン</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">新規登録</Link>
              </Button>
            </>
          )}
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
                {user ? (
                  <>
                    <p className="text-muted-foreground text-sm">
                      {user.email}
                    </p>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={logout}
                    >
                      ログアウト
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      asChild
                    >
                      <Link href="/login">ログイン</Link>
                    </Button>
                    <Button className="w-full" asChild>
                      <Link href="/signup">新規登録</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
