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
    const { prompt, style } = await req.json()
    console.log('API: Received request:', { prompt, style }) // Debug log

    if (!prompt) {
      return NextResponse.json(
        { error: "Please provide a prompt" },
        { status: 400 }
      )
    }

    const systemPrompt = style 
      ? `You are a merchandise design expert. Generate 4 different design concepts based on the user's prompt, emphasizing a ${style} style.
         Return a JSON object with a 'concepts' array containing exactly 4 objects with this structure:
         {
           "concepts": [
             {
               "title": "Catchy name for the design",
               "description": "Brief, visual description of how it would look on merch",
               "style": "${style}"
             }
           ]
         }
         Keep descriptions concise but visual. Focus on how it would look on actual merchandise.`
      : `You are a merchandise design expert. Generate 4 different design concepts based on the user's prompt.
         Return a JSON object with a 'concepts' array containing exactly 4 objects with this structure:
         {
           "concepts": [
             {
               "title": "Catchy name for the design",
               "description": "Brief, visual description of how it would look on merch",
               "style": "One of: Minimal, Bold, Vintage, or Modern"
             }
           ]
         }
         Keep descriptions concise but visual. Focus on how it would look on actual merchandise.`

    console.log('API: Sending prompt to OpenAI') // Debug log
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: systemPrompt
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

    console.log('API: OpenAI Response:', response) // Debug log

    const parsedResponse = JSON.parse(response)
    if (!parsedResponse.concepts || !Array.isArray(parsedResponse.concepts)) {
      throw new Error('Invalid response format from OpenAI')
    }

    const concepts: Concept[] = parsedResponse.concepts.map((concept: any) => ({
      ...concept,
      image: '/placeholder.png' // Add placeholder image
    }))

    console.log('API: Processed concepts:', concepts) // Debug log

    return NextResponse.json({ concepts })
  } catch (error) {
    console.error('API: Error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to generate concepts. Please try again.",
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
} 