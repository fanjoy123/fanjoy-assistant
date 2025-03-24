'use client'

import React from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'

interface ChatInputProps {
  input: string
  isLoading?: boolean
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent) => void
}

export function ChatInput({ input, isLoading, handleInputChange, handleSubmit }: ChatInputProps) {
  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Type your message..."
        className="w-full rounded-lg border border-gray-200 bg-white p-4 pr-16 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <motion.button
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="absolute bottom-3 right-3 rounded-lg bg-blue-500 p-2 text-white transition-colors hover:bg-blue-600"
      >
        <PaperAirplaneIcon className="h-5 w-5" />
      </motion.button>
    </form>
  )
} 