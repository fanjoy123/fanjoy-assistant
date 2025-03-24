'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Concept {
  title: string
  description: string
  image: string
  style?: string
}

interface ConceptGridProps {
  concepts: Concept[]
}

export function ConceptGrid({ concepts }: ConceptGridProps) {
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({})
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => ({
      ...prev,
      [index]: true
    }))
    setImageErrors(prev => ({
      ...prev,
      [index]: false
    }))
  }

  const handleImageError = (index: number, concept: Concept) => {
    console.warn("⚠️ Image failed to load:", {
      concept,
      imageUrl: concept.image,
      isString: typeof concept.image === 'string'
    })
    setImageErrors(prev => ({
      ...prev,
      [index]: true
    }))
    setLoadedImages(prev => ({
      ...prev,
      [index]: true // Stop showing loading state
    }))
  }

  // Validate concepts array
  if (!Array.isArray(concepts)) {
    console.error("❌ ConceptGrid: concepts is not an array", concepts)
    return null
  }

  // Filter out invalid concepts
  const validConcepts = concepts.filter(concept => {
    if (!concept || typeof concept !== 'object') {
      console.warn("⚠️ ConceptGrid: Invalid concept object", concept)
      return false
    }
    
    if (!concept.title || !concept.description) {
      console.warn("⚠️ ConceptGrid: Concept missing required fields", concept)
      return false
    }

    if (typeof concept.image !== 'string') {
      console.warn("⚠️ ConceptGrid: Image is not a string:", concept.image)
      return false
    }

    return true
  })

  if (validConcepts.length === 0) {
    console.error("❌ ConceptGrid: No valid concepts to display")
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No valid concepts to display. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
      {validConcepts.map((concept, idx) => (
        <div 
          key={`${concept.title}-${idx}`}
          className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow"
        >
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={imageErrors[idx] ? "/placeholder.png" : concept.image}
              alt={concept.title || "Merchandise concept"}
              fill
              className={`
                object-cover transition-all duration-300
                ${loadedImages[idx] ? 'blur-0' : 'blur-sm'}
              `}
              onLoad={() => handleImageLoad(idx)}
              onError={() => handleImageError(idx, concept)}
              priority={idx < 2} // Load first two images immediately
            />
            {!loadedImages[idx] && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {imageErrors[idx] && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <p className="text-sm text-gray-500">Image unavailable</p>
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mt-4">{concept.title}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{concept.description}</p>
          <div className="mt-3 flex items-center justify-between">
            <button 
              className="text-blue-500 text-sm hover:underline disabled:opacity-50 disabled:hover:no-underline"
              disabled={imageErrors[idx]}
              onClick={() => {
                // TODO: Implement regenerate/refine functionality
                console.log("Regenerate/refine clicked for concept:", concept)
              }}
            >
              {imageErrors[idx] ? 'Regenerate' : 'Refine'}
            </button>
            {concept.style && (
              <span className="text-xs text-gray-500">{concept.style}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
} 