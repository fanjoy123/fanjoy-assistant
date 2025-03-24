'use client'

import React, { ErrorInfo } from 'react'
import { motion } from 'framer-motion'
import { ChatInput } from './ChatInput'
import { ChatMessages } from './ChatMessages'
import { useChat, type UseChatReturn } from '@/lib/hooks/useChat'
import { type Message } from 'ai'

interface ChatInterfaceProps {
  initialMessages?: Message[]
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ChatInterface Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center">
          <p className="text-red-500">Something went wrong. Please try again.</p>
        </div>
      )
    }

    return this.props.children
  }
}

export function ChatInterface({ initialMessages = [] }: ChatInterfaceProps) {
  const { 
    messages, 
    input, 
    isLoading, 
    handleInputChange, 
    handleSubmit 
  }: UseChatReturn = useChat({
    initialMessages
  })

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <ChatMessages 
          messages={messages ?? []} 
          isLoading={isLoading} 
        />
        <ChatInput 
          input={input ?? ''}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
          handleSubmit={async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
            try {
              await handleSubmit(e)
            } catch (error) {
              console.error('Error submitting chat:', error)
            }
          }}
        />
      </div>
    </ErrorBoundary>
  )
} 