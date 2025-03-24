import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

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

    return NextResponse.json({ 
      content: response.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response."
    })
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    )
  }
} 