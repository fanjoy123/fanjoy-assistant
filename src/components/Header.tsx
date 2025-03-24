import React from 'react'
import Image from 'next/image'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {/* Replace with actual Fanjoy logo */}
            <div className="text-2xl font-bold tracking-tight text-black">
              Fanjoy
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 