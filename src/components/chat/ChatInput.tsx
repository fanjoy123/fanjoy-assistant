'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface ChatInputProps {
  input: string
  isLoading?: boolean
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent) => void
}

export function ChatInput({
  input,
  isLoading = false,
  handleInputChange,
  handleSubmit
}: ChatInputProps) {
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('ChatInput: Submitting form') // Debug log
    handleSubmit(e)
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Describe your merch idea..."
          disabled={isLoading}
          className="w-full rounded-xl border px-4 py-3 shadow focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-500"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          onClick={(e) => {
            e.preventDefault()
            console.log('ChatInput: Button clicked') // Debug log
            handleSubmit(e)
          }}
          disabled={isLoading || !input.trim()}
          className="bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 font-medium"
        >
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            "Generate"
          )}
        </motion.button>
      </div>
    </form>
  )
} 