'use client'

import React, { useEffect, useRef } from 'react'
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
    <div className="space-y-6">
      {messages.map((message, index) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          className={cn(
            'flex w-full items-start gap-x-3',
            message.role === 'assistant' ? 'justify-start' : 'justify-end'
          )}
        >
          {message.role === 'assistant' && (
            <div className="flex-shrink-0 rounded-lg bg-gray-100 p-2">
              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          )}
          <div
            className={cn(
              'rounded-xl px-4 py-3 text-base max-w-[85%] shadow-sm',
              message.role === 'assistant'
                ? 'bg-gray-50 text-gray-900'
                : 'bg-black text-white'
            )}
          >
            {message.content}
          </div>
          {message.role === 'user' && (
            <div className="flex-shrink-0 rounded-lg bg-gray-100 p-2">
              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </motion.div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}