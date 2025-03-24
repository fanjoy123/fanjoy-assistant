import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import OpenAI from 'openai'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, you should use server-side API calls
})

// Helper function to generate AI response
export async function generateAIResponse(prompt: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a helpful design assistant specializing in merchandise design. Help users create beautiful and meaningful designs for their merchandise."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    })

    return response.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response."
  } catch (error) {
    console.error('Error generating AI response:', error)
    return "I apologize, but I encountered an error while processing your request. Please try again."
  }
} 