import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Bowlby_One, Lilita_One, Cherry_Bomb_One, Manrope, Fredoka, Poppins, Fasthand, Federo, Caveat, Quicksand, Kalam } from 'next/font/google'
import './globals.css'

const bowlbyOne = Bowlby_One({ subsets: ['latin'], weight: '400', variable: '--font-bowlby-one' })
const lilitaOne = Lilita_One({ subsets: ['latin'], weight: '400', variable: '--font-lilita-one' })
const cherryBomb = Cherry_Bomb_One({ subsets: ['latin'], weight: '400', variable: '--font-cherry-bomb' })
const manrope = Manrope({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-manrope' })
const fredoka = Fredoka({ subsets: ['latin'], variable: '--font-fredoka' })
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-poppins' })
const fasthand = Fasthand({ subsets: ['latin'], weight: '400', variable: '--font-fasthand-g' })
const federo = Federo({ subsets: ['latin'], weight: '400', variable: '--font-federo-g' })
const caveat = Caveat({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-workforce-g' })
const quicksand = Quicksand({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-quicksand-g' })
const kalam = Kalam({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-kalam-g' })

export const metadata: Metadata = {
  title: 'Plotwist - A New Taste of Wellness',
  description: 'Fresh, honest, wholesome guilt-free treats made with better ingredients for a happier you.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#C7E9E4' },
  ],
  width: 'device-width',
  initialScale: 1,
}

import { AdminProvider } from '@/context/AdminContext'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${bowlbyOne.variable} ${lilitaOne.variable} ${cherryBomb.variable} ${manrope.variable} ${fredoka.variable} ${poppins.variable} ${fasthand.variable} ${federo.variable} ${caveat.variable} ${quicksand.variable} ${kalam.variable}`} style={{ backgroundColor: '#C7E9E4' }}>
      <body className="antialiased bg-[#C7E9E4] font-manrope">
        <AdminProvider>
          {children}
        </AdminProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
