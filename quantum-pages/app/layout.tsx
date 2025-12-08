import type { Metadata } from 'next'
import '../styles/globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AnimatedBackground from '@/components/AnimatedBackground'

export const metadata: Metadata = {
  title: 'QuantumPages - Physical AI Textbook',
  description: 'Interactive platform for learning Physical AI, Robotics, and Advanced Physics concepts. Available in English and Urdu.',
  keywords: ['Physics', 'AI', 'Robotics', 'Education', 'Textbook'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white">
        <AnimatedBackground />
        <Navbar />
        <main className="relative z-10 min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
