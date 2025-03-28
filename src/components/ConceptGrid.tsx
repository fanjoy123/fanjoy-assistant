'use client'

import { useState } from 'react'

interface Concept {
  title: string
  productType: string
  description: string
}

interface ConceptGridProps {
  concepts: Concept[]
  isLoading?: boolean
}

export function ConceptGrid({ concepts = [], isLoading = false }: ConceptGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!Array.isArray(concepts) || concepts.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No concepts generated yet. Try describing your content or vibe!
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
      {concepts?.map((concept, index) => {
        if (!concept?.title || !concept?.productType || !concept?.description) {
          return null
        }
        
        return (
          <div
            key={`${concept.title}-${index}`}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-bold text-gray-900">{concept.title}</h2>
            <p className="text-sm text-gray-600 mt-1">{concept.productType}</p>
            <p className="text-base mt-3 text-gray-700">{concept.description}</p>
            <div className="mt-4 flex gap-2">
              <button 
                className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
                onClick={() => {
                  try {
                    navigator.clipboard.writeText(JSON.stringify(concept, null, 2))
                  } catch (error) {
                    console.error('Error copying to clipboard:', error)
                  }
                }}
              >
                Copy JSON
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
} 