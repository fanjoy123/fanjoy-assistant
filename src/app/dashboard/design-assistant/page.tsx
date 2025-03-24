'use client'

import React from 'react'
import { type Message } from 'ai'
import { Header } from '@/components/Header'
import { ChatInput } from '@/components/chat/ChatInput'
import { ChatMessages } from '@/components/chat/ChatMessages'
import { useChat } from '@/lib/hooks/useChat'

export default function DesignAssistant() {
  const { 
    messages, 
    input, 
    isLoading, 
    handleInputChange, 
    handleSubmit 
  }: {
    messages: Message[]
    input: string
    isLoading: boolean
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  } = useChat({
    initialMessages: [
      {
        id: '1',
        role: 'assistant',
        content: 'Hi! I\'m your Fanjoy AI design assistant. I\'ll help you create stunning merchandise that your fans will love. What kind of design would you like to create today?'
      }
    ]
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-20 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-semibold text-black mb-4">
              Design Your Merch With Fanjoy AI
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Create custom merchandise designs in seconds with our AI-powered design assistant
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-[600px] flex flex-col">
              <div className="flex-1 overflow-y-auto px-6 py-6">
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