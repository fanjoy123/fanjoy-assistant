import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function generateAIResponse(prompt: string): Promise<string> {
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
    throw error
  }
} 