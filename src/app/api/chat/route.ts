import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

interface Concept {
  title: string
  description: string
  image: string
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("API: Raw request body:", body)

    const { prompt, style } = body
    if (!prompt?.trim()) {
      return NextResponse.json(
        { error: "Please provide a prompt" },
        { status: 400 }
      )
    }

    const systemPrompt = `
You are a creative merchandise designer. Given a product idea and style, return exactly 4 unique merch design concepts.

🚫 Do NOT explain or describe anything outside of the JSON.
✅ Respond ONLY in raw JSON like this:

[
  {
    "title": "Hearts & Honey",
    "description": "A soft pink tee with hand-drawn hearts around the neckline and cursive 'love yourself' text.",
    "image": "/placeholder.png"
  }
]

Remember:
1. Return EXACTLY 4 concepts
2. Keep descriptions visual and concise
3. ONLY return the JSON array - no other text
4. Use the requested style: ${style || 'any style'}`

    console.log('API: Sending to OpenAI with prompt:', prompt)
    
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
      max_tokens: 1000
    })

    const rawResponse = completion.choices[0]?.message?.content
    console.log('API: Raw OpenAI response:', rawResponse)

    if (!rawResponse) {
      throw new Error('Empty response from OpenAI')
    }

    try {
      // Find the JSON array in the response
      const jsonStart = rawResponse.indexOf("[")
      const jsonEnd = rawResponse.lastIndexOf("]")
      
      if (jsonStart === -1 || jsonEnd === -1) {
        console.error('API: No JSON array found in response:', rawResponse)
        throw new Error('Invalid response format')
      }

      const jsonStr = rawResponse.substring(jsonStart, jsonEnd + 1)
      console.log('API: Extracted JSON string:', jsonStr)
      
      const concepts = JSON.parse(jsonStr)
      console.log('API: Parsed concepts:', concepts)

      if (!Array.isArray(concepts)) {
        throw new Error('Response is not an array')
      }

      if (concepts.length !== 4) {
        throw new Error(`Expected 4 concepts, got ${concepts.length}`)
      }

      // Validate each concept
      concepts.forEach((concept, index) => {
        if (!concept.title || !concept.description) {
          throw new Error(`Concept ${index + 1} is missing required fields`)
        }
      })

      // Ensure each concept has an image field
      const processedConcepts = concepts.map((concept: Concept) => ({
        ...concept,
        image: concept.image || '/placeholder.png'
      }))

      return NextResponse.json({ concepts: processedConcepts })

    } catch (parseError) {
      console.error('API: Failed to parse response:', parseError)
      console.error('API: Raw response that failed:', rawResponse)
      throw new Error('Failed to parse AI response. Please try again.')
    }

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { 
        error: "Whoops, something broke. Try a different prompt or reload the page.",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}