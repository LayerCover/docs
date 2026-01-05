import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'LayerCover Documentation',
    template: '%s | LayerCover Docs',
  },
  description: 'Comprehensive documentation for LayerCover protocol',
  keywords: ['insurance', 'defi', 'documentation', 'layercover'],
  authors: [{ name: 'LayerCover Team' }],
  creator: 'LayerCover',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://docs.layercover.com',
    title: 'LayerCover Documentation',
    description: 'Comprehensive documentation for LayerCover protocol',
    siteName: 'LayerCover Docs',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LayerCover Documentation',
    description: 'Comprehensive documentation for LayerCover protocol',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
