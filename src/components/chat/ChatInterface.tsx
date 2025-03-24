'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ChatInput } from './ChatInput'
import { ChatMessages } from './ChatMessages'
import { useChat } from '@/lib/hooks/useChat'
import { type Message } from 'ai'

interface ChatInterfaceProps {
  initialMessages?: Message[]
}

export function ChatInterface({ initialMessages = [] }: ChatInterfaceProps) {
  const { messages, input, isLoading, handleInputChange, handleSubmit } = useChat({
    initialMessages
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