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
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <h1 className="text-5xl font-display font-bold tracking-tight text-black">
              Design Your Merch With Fanjoy AI
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Create custom merchandise designs in seconds with our AI-powered design assistant
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-xl">
            <div className="h-[600px] sm:h-[700px] flex flex-col">
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8">
                <ChatMessages messages={messages} />
              </div>
              <div className="border-t border-gray-100 p-4 sm:p-6 bg-white backdrop-blur-lg bg-opacity-90">
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