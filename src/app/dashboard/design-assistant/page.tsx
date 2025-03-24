'use client'

import React from 'react'
import { Header } from '@/components/Header'
import { ChatInput } from '@/components/chat/ChatInput'
import { ChatMessages } from '@/components/chat/ChatMessages'
import { useChat } from '@/lib/hooks/useChat'
import { motion } from 'framer-motion'

export default function DesignAssistant() {
  const { messages, isLoading, onSubmit } = useChat({
    initialMessages: [
      {
        id: '1',
        role: 'assistant',
        content: "Hi! I'm your design assistant. Let's create something amazing together! What kind of merch are you dreaming of?"
      }
    ]
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 font-sans">
      <Header />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
                Let's Bring Your Merch to Life
              </h1>
              <span className="text-4xl animate-bounce">✨</span>
            </div>
            <p className="text-base text-gray-600 font-light">
              Your personal design assistant is here to help
            </p>
          </motion.div>

          <div className="relative mb-8 text-center">
            <p className="text-sm font-medium text-gray-700 mb-2">Pick a vibe ✨</p>
            <select 
              className="w-full max-w-[200px] mx-auto rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black bg-white"
            >
              <option value="">Choose Style</option>
              <option value="minimal">Minimal</option>
              <option value="bold">Bold</option>
              <option value="retro">Retro</option>
              <option value="playful">Playful</option>
            </select>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <div className="h-[600px] sm:h-[700px] flex flex-col">
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
                <ChatMessages messages={messages} isLoading={isLoading} />
              </div>
              <div className="border-t border-gray-100 p-4 sm:p-6 bg-white/80 backdrop-blur-lg">
                <ChatInput
                  onSubmit={onSubmit}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
} 