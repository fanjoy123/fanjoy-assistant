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
    <div className="space-y-3">
      <AnimatePresence initial={false}>
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className={cn(
              'flex w-full items-start',
              message.role === 'assistant' ? 'justify-start' : 'justify-end'
            )}
          >
            <div
              className={cn(
                'relative rounded-xl px-3 py-2 text-sm shadow-sm max-w-[80%]',
                message.role === 'assistant'
                  ? 'bg-white border border-gray-100 text-gray-800'
                  : 'bg-blue-500 text-white'
              )}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {message.content}
              </motion.div>
              {message.role === 'assistant' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute -bottom-4 left-3 text-[10px] text-gray-400"
                >
                  •••
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  )
}