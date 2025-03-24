'use client'

import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { type Message } from 'ai'
import { cn } from '@/lib/utils'

interface ChatMessagesProps {
  messages: Message[]
  isLoading?: boolean
}

interface ParsedConcept {
  title: string
  description: string
  style: string
  details: string
}

function parseConceptMessage(content: string): ParsedConcept | null {
  try {
    const [style, details] = content.split('Concept:\n\n')
    const lines = details.split('\n')
    const title = lines[0].replace('1. ', '').trim()
    const description = lines[1].replace('2. ', '').trim()
    
    return {
      style: style.trim(),
      title,
      description,
      details: lines.slice(2).join('\n')
    }
  } catch (e) {
    return null
  }
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Get concepts from the last set of assistant messages after a user message
  const lastUserIndex = [...messages].reverse().findIndex(m => m.role === 'user')
  const conceptMessages = lastUserIndex >= 0 
    ? messages.slice(-(lastUserIndex)).filter(m => m.role === 'assistant')
    : []
  
  const concepts = conceptMessages
    .map(m => parseConceptMessage(m.content))
    .filter((c): c is ParsedConcept => c !== null)

  return (
    <div className="space-y-6">
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-50 rounded-xl p-8 text-center"
        >
          <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Generating your concepts...</p>
        </motion.div>
      ) : concepts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {concepts.map((concept, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="bg-gray-100 h-64 rounded-t-xl" />
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{concept.title}</h3>
                  <p className="text-sm text-gray-500">{concept.style}</p>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {concept.description}
                </p>
                <div className="flex gap-2">
                  <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                    Download
                  </button>
                  <button className="border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    Refine
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
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
      )}
    </div>
  )
}