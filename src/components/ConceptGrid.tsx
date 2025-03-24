'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Concept {
  title: string
  description: string
  image: string
  style: string
}

interface ConceptGridProps {
  concepts: Concept[]
}

export function ConceptGrid({ concepts }: ConceptGridProps) {
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({})

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => ({
      ...prev,
      [index]: true
    }))
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
      {concepts.map((concept, idx) => (
        <div 
          key={idx} 
          className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow"
        >
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={concept.image}
              alt={concept.title}
              fill
              className={`
                object-cover transition-all duration-300
                ${loadedImages[idx] ? 'blur-0' : 'blur-sm'}
              `}
              onLoad={() => handleImageLoad(idx)}
            />
            {!loadedImages[idx] && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{concept.title}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{concept.description}</p>
          <div className="mt-3 flex items-center justify-between">
            <button className="text-blue-500 text-sm hover:underline">
              Refine
            </button>
            <span className="text-xs text-gray-500">{concept.style}</span>
          </div>
        </div>
      ))}
    </div>
  )
} 