import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import {
  Bowlby_One,
  Lilita_One,
  Cherry_Bomb_One,
  Manrope,
  Fredoka,
  Poppins,
  Fasthand,
  Federo,
  Caveat,
  Quicksand,
  Kalam,
  Bricolage_Grotesque,
  Fraunces,
  Space_Grotesk,
  Outfit,
  DM_Sans,
} from 'next/font/google'
import './globals.css'

const bowlbyOne = Bowlby_One({ subsets: ['latin'], weight: '400', variable: '--font-bowlby-one', display: 'swap' })
const lilitaOne = Lilita_One({ subsets: ['latin'], weight: '400', variable: '--font-lilita-one', display: 'swap' })
const cherryBomb = Cherry_Bomb_One({ subsets: ['latin'], weight: '400', variable: '--font-cherry-bomb', display: 'swap' })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' })
const fredoka = Fredoka({ subsets: ['latin'], variable: '--font-fredoka', display: 'swap' })
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-poppins', display: 'swap' })
const fasthand = Fasthand({ subsets: ['latin'], weight: '400', variable: '--font-fasthand-g', display: 'swap' })
const federo = Federo({ subsets: ['latin'], weight: '400', variable: '--font-federo-g', display: 'swap' })
const caveat = Caveat({ subsets: ['latin'], variable: '--font-workforce-g', display: 'swap' })
const quicksand = Quicksand({ subsets: ['latin'], variable: '--font-quicksand-g', display: 'swap' })
const kalam = Kalam({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-kalam-g', display: 'swap' })
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage', display: 'swap' })
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' })

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
    <html
      lang="en"
      className={`${bowlbyOne.variable} ${lilitaOne.variable} ${cherryBomb.variable} ${manrope.variable} ${fredoka.variable} ${poppins.variable} ${fasthand.variable} ${federo.variable} ${caveat.variable} ${quicksand.variable} ${kalam.variable} ${bricolage.variable} ${fraunces.variable} ${spaceGrotesk.variable} ${outfit.variable} ${dmSans.variable}`}
      style={{ backgroundColor: '#C7E9E4' }}
    >
      <body className="antialiased bg-[#C7E9E4] font-manrope">
        <AdminProvider>
          {children}
        </AdminProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
