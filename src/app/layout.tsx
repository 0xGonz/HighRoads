import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import dynamic from 'next/dynamic'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

// Dynamically import ChatWidget to avoid SSR issues with Vapi SDK
const ChatWidget = dynamic(() => import('@/components/widget/ChatWidget').then(mod => mod.ChatWidget), {
  ssr: false
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const interTight = Inter({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-inter-tight',
})

export const metadata: Metadata = {
  title: 'High Road Partners LLC | Lease-to-Own Trucking',
  description: 'Own your own truck with flexible weekly payments. Drive for top-paying carriers with full support, training, and mentorship. No credit check required.',
  keywords: 'lease to own truck, trucking, CDL, owner operator, trucking business',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${interTight.variable} font-sans`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  )
}
