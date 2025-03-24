import { useState } from 'react'
import { type Message } from 'ai'
import { generateAIResponse } from '@/lib/utils'

interface UseChatOptions {
  initialMessages?: Message[]
}

interface Concept {
  id: string
  style: string
  content: string
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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input.trim() })
      })

      if (!response.ok) {
        throw new Error('Failed to generate concepts')
      }

      const data = await response.json()
      
      if (data.concepts) {
        const conceptMessages: Message[] = data.concepts.map((concept: Concept) => ({
          id: concept.id,
          role: 'assistant',
          content: `${concept.style} Concept:\n\n${concept.content}`
        }))

        setMessages(prev => [...prev, ...conceptMessages])
      } else {
        throw new Error('No concepts generated')
      }
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