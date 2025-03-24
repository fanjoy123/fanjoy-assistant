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
        className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-6 py-4 pr-24 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      />
      <motion.button
        whileTap={{ scale: 0.95 }}
        type="submit"
        disabled={isLoading}
        className="absolute bottom-3 right-3 rounded-xl bg-blue-500 p-2 text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? (
          <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        )}
      </motion.button>
    </form>
  )
} 