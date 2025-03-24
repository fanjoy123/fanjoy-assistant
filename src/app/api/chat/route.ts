import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const styles = ['Minimal', 'Bold', 'Vintage', 'Modern']

interface Concept {
  title: string
  description: string
  image: string
  style: string
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json(
        { error: "Please provide a prompt" },
        { status: 400 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a merchandise design expert. Generate 4 different design concepts based on the user's prompt.
          Return ONLY a JSON array of 4 objects with this exact structure:
          [
            {
              "title": "Catchy name for the design",
              "description": "Brief, visual description of how it would look on merch",
              "style": "One of: Minimal, Bold, Vintage, or Modern"
            }
          ]
          Keep descriptions concise but visual. Focus on how it would look on actual merchandise.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    const parsedResponse = JSON.parse(response)
    const concepts: Concept[] = parsedResponse.concepts.map((concept: any) => ({
      ...concept,
      image: '/placeholder.png' // Add placeholder image
    }))

    return NextResponse.json({ concepts })
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { error: "Failed to generate concepts. Please try again." },
      { status: 500 }
    )
  }
} 