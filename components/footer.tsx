import { Facebook, Instagram, MapPin, Twitter, Youtube } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">TravelExplore</span>
            </Link>
            <p className="mb-4 text-muted-foreground text-sm leading-relaxed">
              世界中の美しい目的地をお客様にお届けします
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">会社情報</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  私たちについて
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  採用情報
                </Link>
              </li>
              <li>
                <Link
                  href="/press"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  プレス
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  ブログ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">サポート</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/help"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  ヘルプセンター
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  お問い合わせ
                </Link>
              </li>
              <li>
                <Link
                  href="/safety"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  安全情報
                </Link>
              </li>
              <li>
                <Link
                  href="/cancellation"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  キャンセルポリシー
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">法的情報</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  利用規約
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  クッキーポリシー
                </Link>
              </li>
              <li>
                <Link
                  href="/sitemap"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  サイトマップ
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t pt-8 text-center text-muted-foreground text-sm">
        <p>© 2025 TravelExplore. All rights reserved.</p>
      </div>
    </footer>
  )
}
