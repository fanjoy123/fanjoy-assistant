import { useState } from 'react'
import { type Message } from 'ai'
import { generateAIResponse } from '@/lib/utils'

interface UseChatOptions {
  initialMessages?: Message[]
}

export function useChat({ initialMessages = [] }: UseChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: String(Date.now()),
      role: 'user',
      content: input.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const aiResponse = await generateAIResponse(input.trim())
      
      const assistantMessage: Message = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: aiResponse
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error in chat:', error)
      const errorMessage: Message = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return {
    messages,
    input,
    isLoading,
    handleInputChange,
    handleSubmit
  }
} 