'use client'

import React from 'react'
import { Header } from '@/components/Header'
import { ChatInput } from '@/components/chat/ChatInput'
import { ChatMessages } from '@/components/chat/ChatMessages'
import { useChat } from '@/lib/hooks/useChat'

export default function DesignAssistant() {
  const { messages, input, isLoading, handleInputChange, handleSubmit } = useChat({
    initialMessages: [
      {
        id: '1',
        role: 'assistant',
        content: 'Hi! I\'m your Fanjoy AI design assistant. I\'ll help you create stunning merchandise that your fans will love. What kind of design would you like to create today?'
      }
    ]
  })

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-center text-black mb-2">
            Design Your Merch With Fanjoy AI
          </h1>
          <p className="text-lg text-gray-600 text-center mb-8">
            Create custom merchandise designs in seconds with AI assistance
          </p>
          <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-[600px] flex flex-col">
              <div className="flex-1 overflow-y-auto px-4 py-6">
                <ChatMessages messages={messages} />
              </div>
              <div className="border-t border-gray-100 p-4 bg-white">
                <ChatInput
                  input={input}
                  isLoading={isLoading}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 