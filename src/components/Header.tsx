import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold tracking-tight text-black hover:text-gray-800 transition-colors">
                Fanjoy
              </span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
} 