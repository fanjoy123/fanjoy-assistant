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

const FALLBACK_CONCEPTS = [
  {
    title: "Simple Black Tee",
    description: "Classic black t-shirt with minimalist design",
    image: "/placeholder.png"
  },
  {
    title: "White Essential",
    description: "Clean white t-shirt with subtle branding",
    image: "/placeholder.png"
  },
  {
    title: "Vintage Wash",
    description: "Distressed look with faded graphics",
    image: "/placeholder.png"
  },
  {
    title: "Modern Cut",
    description: "Contemporary fit with geometric patterns",
    image: "/placeholder.png"
  }
]

async function generateImage(description: string): Promise<string> {
  try {
    console.log("API: Generating image for description:", description)
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Professional t-shirt design: ${description}. Make it look like a real t-shirt mockup with the design clearly visible.`,
      n: 1,
      size: "1024x1024",
    })
    
    const imageUrl = response.data[0].url
    if (!imageUrl) {
      throw new Error("No image URL returned")
    }

    console.log("API: Image generated successfully")
    return imageUrl
  } catch (error) {
    console.error("API: Image generation failed:", error)
    return "/placeholder.png"
  }
}

export async function POST(req: Request) {
  console.log("API: Handler started")
  
  try {
    const body = await req.json()
    console.log("API: Received body:", body)

    const { prompt, style } = body
    if (!prompt?.trim()) {
      console.log("API: Empty prompt received")
      return NextResponse.json(
        { error: "Please provide a prompt" },
        { status: 400 }
      )
    }

    console.log("API: Processing prompt:", prompt)
    console.log("API: Selected style:", style || "none")

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
4. Use the requested style: ${style || 'any style'}
5. Make descriptions detailed enough for image generation`

    console.log("API: Calling OpenAI...")
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.8
      })

      const raw = completion.choices[0]?.message?.content || ""
      console.log("API: Raw OpenAI response:", raw)

      if (!raw) {
        console.log("API: Empty response from OpenAI, using fallback")
        return NextResponse.json({ concepts: FALLBACK_CONCEPTS })
      }

      const jsonStart = raw.indexOf("[")
      const jsonEnd = raw.lastIndexOf("]")
      
      if (jsonStart === -1 || jsonEnd === -1) {
        console.error("API: No JSON array found in response:", raw)
        return NextResponse.json({ concepts: FALLBACK_CONCEPTS })
      }

      const jsonString = raw.substring(jsonStart, jsonEnd + 1)
      console.log("API: Extracted JSON string:", jsonString)

      const concepts = JSON.parse(jsonString)
      console.log("API: Parsed concepts:", concepts)

      if (!Array.isArray(concepts) || concepts.length !== 4) {
        console.error("API: Invalid concepts array:", concepts)
        return NextResponse.json({ concepts: FALLBACK_CONCEPTS })
      }

      // Generate images for each concept
      console.log("API: Generating images for concepts...")
      const imagePromises = concepts.map(concept => 
        generateImage(concept.description)
      )
      
      const images = await Promise.all(imagePromises)
      console.log("API: All images generated")

      // Combine concepts with generated images
      const conceptsWithImages = concepts.map((concept, index) => ({
        title: concept.title || "Untitled Design",
        description: concept.description || "A unique t-shirt design",
        image: images[index]
      }))

      console.log("API: Returning concepts with images")
      return NextResponse.json({ concepts: conceptsWithImages })

    } catch (openaiError) {
      console.error("API: OpenAI call failed:", openaiError)
      return NextResponse.json(
        { 
          error: "Failed to generate concepts",
          concepts: FALLBACK_CONCEPTS
        },
        { status: 200 }
      )
    }

  } catch (error) {
    console.error("API: Request processing failed:", error)
    return NextResponse.json(
      { 
        error: "Failed to process request",
        concepts: FALLBACK_CONCEPTS
      },
      { status: 200 }
    )
  }
}