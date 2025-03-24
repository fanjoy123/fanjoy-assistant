'use client'

import React from 'react'
import { motion } from 'framer-motion'

type ChatInputProps = {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
};

export function ChatInput({ input, handleInputChange, handleSubmit, isLoading = false }: ChatInputProps) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col gap-3">
          <input
            type="text"
            className="w-full p-4 text-gray-900 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your content, vibe, or audience..."
            value={input}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> 
                Generating...
              </span>
            ) : (
              "Generate My Pitch Pack"
            )}
          </motion.button>
        </div>
      </form>
    </div>
  )
} 