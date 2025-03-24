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
    <form onSubmit={handleSubmit}>
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Tell me your merch idea..."
          disabled={isLoading}
          className="w-full rounded-xl border px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-500 bg-gray-50 hover:bg-white focus:bg-white transition-colors"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:hover:bg-black font-medium"
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
            "Submit"
          )}
        </motion.button>
      </div>
    </form>
  )
} 