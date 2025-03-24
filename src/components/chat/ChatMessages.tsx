'use client'

import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
    <div className="space-y-4 min-h-[200px] max-h-[400px] overflow-y-auto px-1">
      <AnimatePresence initial={false}>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'flex w-full items-start',
              message.role === 'assistant' ? 'justify-start' : 'justify-end'
            )}
          >
            <div
              className={cn(
                'rounded-xl px-4 py-2 text-sm max-w-[85%] leading-relaxed',
                message.role === 'assistant'
                  ? 'bg-gray-50 text-gray-800'
                  : 'bg-black text-white'
              )}
            >
              {message.content}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  )
}