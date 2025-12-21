import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import type React from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'TravelExplore - Discover Your Next Adventure',
  description:
    'Explore amazing destinations and plan your perfect trip with TravelExplore',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={'font-sans antialiased'}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
