import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const systemPrompt = `
You are a pitch strategist helping a creator quickly generate powerful messaging ideas for their merch, brand, or product.
Create exactly 4 distinct pitch angles. Each angle must include:
1. A short, catchy name for the pitch direction (like "Hype Reel Hook" or "Community Champion")
2. A 1-line summary explaining the pitch direction and strategy
3. An example headline that captures the essence of this angle

Format your response as a JSON array with exactly 4 objects, each containing:
{
  "title": "Name of pitch angle",
  "description": "One-line strategic summary",
  "headline": "Example headline"
}

Make each pitch angle distinct and compelling. Focus on emotional hooks, cultural relevance, and memorable phrases.
`

export async function POST(req: Request) {
  try {
    const { prompt, tone } = await req.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const userPrompt = tone 
      ? `Generate pitch ideas for: ${prompt}\nDesired tone: ${tone}`
      : `Generate pitch ideas for: ${prompt}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      throw new Error('No response from OpenAI')
    }

    let concepts
    try {
      concepts = JSON.parse(response)
      
      if (!Array.isArray(concepts) || concepts.length !== 4) {
        throw new Error('Invalid response format')
      }

      // Validate each concept has required fields
      concepts.forEach(concept => {
        if (!concept.title || !concept.description || !concept.headline) {
          throw new Error('Invalid concept format')
        }
      })

    } catch (error) {
      console.error('Failed to parse concepts:', error)
      throw new Error('Failed to generate valid pitch concepts')
    }

    return NextResponse.json({ concepts })

  } catch (error) {
    console.error('Error in generate-pitch:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
} 