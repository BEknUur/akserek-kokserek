import type { Metadata } from 'next'
import './globals.css'
import { Cinzel_Decorative, Nunito, Noto_Sans } from 'next/font/google'

const cinzel = Cinzel_Decorative({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
})

const nunito = Nunito({
  weight: ['400', '600', '700'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-nunito',
  display: 'swap',
})

const notoSans = Noto_Sans({
  weight: ['400', '600', '700'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-noto',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ақсерек-Көксерек | Казахская народная игра',
  description: 'Казахская народная подвижная игра в 3D. Прорви цепь противника!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="kk" className={`h-full ${cinzel.variable} ${nunito.variable} ${notoSans.variable}`}>
      <body className="min-h-full bg-[#0a0e1a] text-white" style={{ fontFamily: 'var(--font-nunito), sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
