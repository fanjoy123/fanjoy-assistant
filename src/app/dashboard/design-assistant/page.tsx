'use client'

import React, { useState } from 'react'
import { type Message } from 'ai'
import { ChatInput } from '@/components/chat/ChatInput'
import { ChatMessages } from '@/components/chat/ChatMessages'

export default function DesignAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your design assistant. How can I help you with your merchandise design today?'
    }
  ])
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: String(Date.now()),
      role: 'user',
      content: input.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')

    // TODO: Implement AI response logic
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <ChatMessages messages={messages} />
      <div className="border-t p-4">
        <ChatInput
          input={input}
          handleInputChange={(e) => setInput(e.target.value)}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  )
} 