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
  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto w-full">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Tell me your merch idea... What's your vibe?"
          disabled={isLoading}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base placeholder-gray-500 shadow-sm focus:border-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 disabled:opacity-50 transition-all duration-200"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isLoading || !input.trim()}
          className="flex-shrink-0 rounded-xl bg-black px-4 py-3 text-white shadow-sm transition-all duration-200 hover:bg-gray-800 disabled:opacity-50 disabled:hover:bg-black"
        >
          {isLoading ? (
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <span className="flex items-center gap-2">
              Send
              <span className="text-lg">✈️</span>
            </span>
          )}
        </motion.button>
      </div>
    </form>
  )
} 