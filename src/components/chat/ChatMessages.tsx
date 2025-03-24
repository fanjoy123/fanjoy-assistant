import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { type Message } from 'ai'
import { cn } from '@/lib/utils'

interface ChatMessagesProps {
  messages: Message[]
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex-1 space-y-6 overflow-y-auto px-4 py-8">
      {messages.map((message, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={cn(
            'flex w-full items-start gap-x-4 px-4',
            message.role === 'assistant' ? 'justify-start' : 'justify-end'
          )}
        >
          <div
            className={cn(
              'rounded-lg px-4 py-2 text-sm',
              message.role === 'assistant'
                ? 'bg-muted text-muted-foreground'
                : 'bg-primary text-primary-foreground'
            )}
          >
            {message.content}
          </div>
        </motion.div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
} 