'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface ChatInputProps {
  input: string
  isLoading?: boolean
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent) => void
}

export function ChatInput({
  input,
  isLoading = false,
  handleInputChange,
  handleSubmit
}: ChatInputProps) {
  return (
    <form onSubmit={handleSubmit} className="relative">
      <textarea
        value={input}
        onChange={handleInputChange}
        placeholder="Describe your merchandise design idea..."
        rows={1}
        disabled={isLoading}
        className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3.5 pr-20 text-base focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-300 disabled:opacity-50 transition-all duration-200"
      />
      <motion.button
        whileTap={{ scale: 0.95 }}
        type="submit"
        disabled={isLoading}
        className="absolute bottom-2.5 right-2.5 rounded-lg bg-black p-2.5 text-white transition-all duration-200 hover:bg-gray-800 disabled:opacity-50 hover:shadow-sm"
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
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        )}
      </motion.button>
    </form>
  )
} 