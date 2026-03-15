import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NavBar } from '@/components/NavBar'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Familia de la boda',
  description: 'Conoce la familia',
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-50 min-h-screen pb-16`}>
        {children}
        <NavBar />
      </body>
    </html>
  )
}
