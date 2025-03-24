import { useState } from 'react'
import { type Message } from 'ai'

interface UseChatOptions {
  initialMessages?: Message[]
}

export function useChat({ initialMessages = [] }: UseChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

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

    // TODO: Add AI response logic here
  }

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit
  }
} 