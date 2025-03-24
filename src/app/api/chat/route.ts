import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

interface Concept {
  title: string
  description: string
  style: string
}

const EXAMPLE_CONCEPT = {
  title: "Mountain Minimalist",
  description: "Clean black line drawing of mountain peaks on a white tee, positioned small on the left chest",
  style: "Minimal"
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

    const systemPrompt = `You are a merchandise design expert. Generate exactly 4 design concepts.
    RESPOND ONLY WITH THIS EXACT JSON STRUCTURE:
    {
      "concepts": [
        {
          "title": "Catchy name for the design",
          "description": "Brief visual description of how it looks on merch",
          "style": "${style || 'Pick from: Minimal, Bold, Vintage, Modern'}"
        }
      ]
    }

    Example concept: ${JSON.stringify(EXAMPLE_CONCEPT)}
    
    Keep descriptions visual and concise. Focus on how it would look on actual merchandise.
    DO NOT include any other text or explanation - ONLY the JSON response.`

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
      response_format: { type: "json_object" }
    })

    const rawResponse = completion.choices[0]?.message?.content
    console.log('API: Raw OpenAI response:', rawResponse)

    if (!rawResponse) {
      throw new Error('Empty response from OpenAI')
    }

    let parsedResponse
    try {
      parsedResponse = JSON.parse(rawResponse)
      console.log('API: Parsed response:', parsedResponse)
    } catch (parseError) {
      console.error('API: JSON parse error:', parseError)
      console.log('API: Failed to parse response:', rawResponse)
      throw new Error('Failed to parse OpenAI response')
    }

    if (!parsedResponse?.concepts || !Array.isArray(parsedResponse.concepts)) {
      console.error('API: Invalid response format:', parsedResponse)
      throw new Error('Invalid response format: missing concepts array')
    }

    if (parsedResponse.concepts.length !== 4) {
      console.error('API: Wrong number of concepts:', parsedResponse.concepts.length)
      throw new Error('Invalid response: expected 4 concepts')
    }

    // Validate each concept
    parsedResponse.concepts.forEach((concept: any, index: number) => {
      if (!concept.title || !concept.description || !concept.style) {
        console.error('API: Invalid concept format at index', index, concept)
        throw new Error(`Invalid concept format at position ${index + 1}`)
      }
    })

    const concepts = parsedResponse.concepts.map((concept: Concept) => ({
      ...concept,
      image: '/placeholder.png'
    }))

    console.log('API: Final concepts to return:', concepts)
    return NextResponse.json({ concepts })

  } catch (error) {
    console.error('API Error:', error)
    const errorMessage = error instanceof Error 
      ? `Error generating concepts: ${error.message}`
      : 'Something went wrong generating your concepts. Please try again.'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}