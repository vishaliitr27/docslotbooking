import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import clsx from 'clsx'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DocBook | Find Specialist Doctors',
  description: 'Book appointments with top doctors and hospitals instantly.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* ADDED 'bg-brand-green-50' and 'text-gray-900' HERE instead of globals.css */}
      <body className={clsx(inter.className, "min-h-screen flex flex-col bg-brand-green-50 text-gray-900 antialiased")}>
        <main className="grow">
          {children}
        </main>
      </body>
    </html>
  )
}