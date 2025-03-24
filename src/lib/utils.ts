import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to generate AI response
export async function generateAIResponse(prompt: string) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt })
    })

    if (!response.ok) {
      throw new Error('Failed to generate response')
    }

    const data = await response.json()
    return data.content
  } catch (error) {
    console.error('Error generating AI response:', error)
    return "I apologize, but I encountered an error while processing your request. Please try again."
  }
} 