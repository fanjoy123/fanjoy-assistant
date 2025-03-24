import React from 'react'
import { Inter } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fanjoy Design Assistant',
  description: 'Create stunning merchandise designs with Fanjoy AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-white antialiased`}>
        {children}
      </body>
    </html>
  )
} 