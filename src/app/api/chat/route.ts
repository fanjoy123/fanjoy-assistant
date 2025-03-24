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
    You MUST respond with a JSON object containing EXACTLY 4 concepts in this format:
    {
      "concepts": [
        {
          "title": "Short catchy name",
          "description": "Brief visual description under 100 chars",
          "style": "${style || 'Minimal'}"
        }
      ]
    }

    Here's an example of ONE concept (you must provide 4):
    {
      "concepts": [
        ${JSON.stringify(EXAMPLE_CONCEPT, null, 2)}
      ]
    }
    
    Rules:
    1. Generate EXACTLY 4 concepts
    2. Each concept MUST have title, description, and style
    3. Keep descriptions visual and under 100 characters
    4. ONLY return the JSON - no other text
    5. Ensure the JSON is valid and properly formatted`

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
      response_format: { type: "json_object" },
      max_tokens: 1000
    })

    const rawResponse = completion.choices[0]?.message?.content
    console.log('API: Raw OpenAI response:', rawResponse)

    if (!rawResponse) {
      console.error('API: Empty response from OpenAI')
      throw new Error('OpenAI returned an empty response')
    }

    let parsedResponse
    try {
      parsedResponse = JSON.parse(rawResponse)
      console.log('API: Parsed response:', parsedResponse)
    } catch (parseError) {
      console.error('API: JSON parse error:', parseError)
      console.error('API: Raw response that failed to parse:', rawResponse)
      throw new Error('Failed to parse OpenAI response as JSON')
    }

    // Validate response structure
    if (!parsedResponse || typeof parsedResponse !== 'object') {
      console.error('API: Response is not an object:', parsedResponse)
      throw new Error('Invalid response: not a JSON object')
    }

    if (!parsedResponse.concepts) {
      console.error('API: Missing concepts array:', parsedResponse)
      throw new Error('Invalid response: missing concepts array')
    }

    if (!Array.isArray(parsedResponse.concepts)) {
      console.error('API: Concepts is not an array:', parsedResponse.concepts)
      throw new Error('Invalid response: concepts is not an array')
    }

    if (parsedResponse.concepts.length !== 4) {
      console.error('API: Wrong number of concepts:', parsedResponse.concepts.length)
      throw new Error(`Invalid response: expected 4 concepts, got ${parsedResponse.concepts.length}`)
    }

    // Validate each concept
    parsedResponse.concepts.forEach((concept: any, index: number) => {
      const missingFields = []
      if (!concept.title) missingFields.push('title')
      if (!concept.description) missingFields.push('description')
      if (!concept.style) missingFields.push('style')
      
      if (missingFields.length > 0) {
        console.error(`API: Invalid concept at index ${index}:`, concept)
        throw new Error(`Concept ${index + 1} is missing required fields: ${missingFields.join(', ')}`)
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