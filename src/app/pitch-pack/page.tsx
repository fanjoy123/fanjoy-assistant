'use client'

import React, { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'

interface PitchConcept {
  title: string
  description: string
  headline: string
}

const TONE_OPTIONS = [
  { value: 'playful', label: 'Playful' },
  { value: 'professional', label: 'Professional' },
  { value: 'bold', label: 'Bold' },
  { value: 'minimal', label: 'Minimal' },
]

export default function PitchPackGenerator() {
  const [prompt, setPrompt] = useState('')
  const [tone, setTone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [concepts, setConcepts] = useState<PitchConcept[]>([])
  const [error, setError] = useState('')

  const generatePitchPack = async () => {
    if (!prompt.trim() || isLoading) return

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/generate-pitch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim(), tone })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate pitch pack')
      }

      setConcepts(data.concepts)
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await generatePitchPack()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pitch Pack Generator
          </h1>
          <p className="text-lg text-gray-600">
            Generate powerful pitch ideas for your brand, product, or merch in seconds
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mb-12">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
              Describe your product, idea, or brand
            </label>
            <input
              type="text"
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A streetwear brand inspired by retro gaming culture"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-2">
              Tone (Optional)
            </label>
            <select
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            >
              <option value="">Choose a tone</option>
              {TONE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            disabled={!prompt.trim() || isLoading}
            className="w-full py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating...' : 'Generate Pitch Pack'}
          </motion.button>
        </form>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-500 mb-8">
            {error}
          </div>
        )}

        {concepts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {concepts.map((concept, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {concept.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {concept.description}
                </p>
                <div className="border-t pt-4">
                  <p className="text-gray-900 font-medium italic">
                    "{concept.headline}"
                  </p>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      const text = `${concept.title}\n\n${concept.description}\n\n"${concept.headline}"`
                      navigator.clipboard.writeText(text)
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Copy
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 