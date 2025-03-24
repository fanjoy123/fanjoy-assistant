'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ChatInput } from './ChatInput'
import { ChatMessages } from './ChatMessages'
import { useChat } from '@/lib/hooks/useChat'

export function ChatInterface() {
  const { messages, input, isLoading, handleInputChange, handleSubmit } = useChat({
    initialMessages: [
      {
        id: 'welcome-message',
        role: 'assistant',
        content: "Hi! I'm your design assistant. Let's create something amazing together! What kind of merch are you dreaming of?"
      }
    ]
  })

  return (
    <div className="space-y-6">
      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatInput 
        input={input}
        isLoading={isLoading}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    </div>
  )
} 