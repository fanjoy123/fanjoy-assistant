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
  const [selectedStyle, setSelectedStyle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [concepts, setConcepts] = useState<Concept[]>([])
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStyle(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Home: handleSubmit called') // Debug log

    if (!input.trim() || isLoading) {
      console.log('Home: Submission blocked - empty input or loading') // Debug log
      return
    }

    setIsLoading(true)
    setError('')
    setConcepts([]) // Clear previous concepts

    try {
      console.log('Home: Submitting prompt:', { prompt: input.trim(), style: selectedStyle }) // Debug log
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: input.trim(),
          style: selectedStyle 
        })
      })

      const data = await response.json()
      console.log('Home: API Response:', data) // Debug log
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate concepts')
      }

      if (!data.concepts || !Array.isArray(data.concepts)) {
        throw new Error('Invalid response format: missing concepts array')
      }

      console.log('Home: Setting concepts:', data.concepts) // Debug log
      setConcepts(data.concepts)
      setInput('')
    } catch (error) {
      console.error('Home: Error:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate concepts')
      setConcepts([]) // Clear concepts on error
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
              value={selectedStyle}
              onChange={handleStyleChange}
              className="rounded-lg border px-4 py-2 shadow-sm text-sm bg-white hover:border-gray-300 focus:border-black focus:ring-2 focus:ring-black/5 transition-colors"
            >
              <option value="">Choose Style (Optional)</option>
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
                <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-100">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
            </form>
          </div>

          {isLoading && (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-600">Generating your concepts...</p>
            </div>
          )}

          {concepts && concepts.length > 0 && (
            <div className="animate-fadeIn">
              <ConceptGrid concepts={concepts} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 