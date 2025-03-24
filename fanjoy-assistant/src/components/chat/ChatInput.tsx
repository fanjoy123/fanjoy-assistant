'use client'

import React from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'

interface ChatInputProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent) => void
}

export function ChatInput({ input, handleInputChange, handleSubmit }: ChatInputProps) {
  return (
    <form onSubmit={handleSubmit} className="relative">
      <textarea
        value={input}
        onChange={handleInputChange}
        placeholder="Type your message..."
        rows={1}
        className="w-full resize-none rounded-lg border border-gray-200 bg-white p-4 pr-16 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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