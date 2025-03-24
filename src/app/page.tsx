'use client'

import { useState } from 'react'
import { ChatInput } from '@/components/chat/ChatInput'
import { ConceptGrid } from '@/components/ConceptGrid'

interface Concept {
  title: string
  description: string
  image: string
  style: string
}

export default function Home() {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [concepts, setConcepts] = useState<Concept[]>([])
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input.trim() })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate concepts')
      }

      setConcepts(data.concepts)
      setInput('')
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate concepts')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 font-sans text-gray-800">
      <div className="max-w-3xl mx-auto px-6 pt-12 space-y-6 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Let's Bring Your Merch to Life</h1>
          <p className="text-base text-gray-600">Your personal design assistant is here to help</p>
        </div>
        
        <div className="space-y-8">
          <div className="space-y-2">
            <p className="text-base text-gray-600">Pick a vibe ✨</p>
            <select 
              className="rounded-lg border px-4 py-2 shadow-sm text-sm bg-white hover:border-gray-300 focus:border-black focus:ring-2 focus:ring-black/5 transition-colors"
              defaultValue=""
            >
              <option value="" disabled>Choose Style</option>
              <option value="minimal">Minimal</option>
              <option value="bold">Bold</option>
              <option value="vintage">Vintage</option>
              <option value="modern">Modern</option>
            </select>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <ChatInput 
                input={input}
                isLoading={isLoading}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
              />
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
            </form>
          </div>

          {isLoading && (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-600">Generating your concepts...</p>
            </div>
          )}

          {concepts.length > 0 && <ConceptGrid concepts={concepts} />}
        </div>
      </div>
    </div>
  )
} 