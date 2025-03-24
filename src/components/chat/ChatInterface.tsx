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
        content: "Hi! I'm your AI design assistant. I'll help you create stunning merchandise designs. What kind of design would you like to create today?"
      }
    ]
  })

  return (
    <div className="relative flex h-full flex-col justify-between">
      <div className="relative flex-1 overflow-hidden bg-white">
        <ChatMessages messages={messages} />
      </div>
      <div className="relative">
        <ChatInput 
          input={input}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  )
} 