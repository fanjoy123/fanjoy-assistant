import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

interface Concept {
  title: string
  description: string
  image: string
  style?: string
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
    console.log("🎨 Generating image for description:", description)
    
    if (!description?.trim()) {
      console.error("❌ Empty description provided for image generation")
      return "/placeholder.png"
    }

    const prompt = `Professional t-shirt design: ${description}. Create a realistic t-shirt mockup with the design clearly visible on a white background.`
    console.log("📝 Image generation prompt:", prompt)

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "url"
    })

    console.log("🖼️ DALL·E response:", JSON.stringify(response, null, 2))

    const imageUrl = response?.data?.[0]?.url
    if (!imageUrl || !imageUrl.startsWith('https://')) {
      console.error("❌ Invalid image URL returned:", imageUrl)
      return "/placeholder.png"
    }

    console.log("✅ Valid image URL generated:", imageUrl)
    return imageUrl

  } catch (err) {
    const error = err as Error
    console.error("❌ Image generation failed:", error.message)
    console.error("Full error:", error)
    return "/placeholder.png"
  }
}

export async function POST(req: Request) {
  console.log("🚀 API handler started")
  
  try {
    const body = await req.json()
    console.log("📥 Received request body:", body)

    const { prompt, style } = body
    if (!prompt?.trim()) {
      console.log("❌ Empty prompt received")
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
4. Use the requested style: ${style || 'any style'}
5. Make descriptions detailed enough for image generation`

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
      console.log("📝 Raw GPT response:", raw)

      if (!raw) {
        console.error("❌ Empty response from GPT")
        return NextResponse.json({ concepts: FALLBACK_CONCEPTS })
      }

      const jsonStart = raw.indexOf("[")
      const jsonEnd = raw.lastIndexOf("]")
      
      if (jsonStart === -1 || jsonEnd === -1) {
        console.error("❌ No JSON array found in response:", raw)
        return NextResponse.json({ concepts: FALLBACK_CONCEPTS })
      }

      const jsonString = raw.substring(jsonStart, jsonEnd + 1)
      console.log("📦 Extracted JSON string:", jsonString)

      const concepts = JSON.parse(jsonString)
      console.log("✅ Parsed concepts:", concepts)

      if (!Array.isArray(concepts) || concepts.length !== 4) {
        console.error("❌ Invalid concepts array:", concepts)
        return NextResponse.json(
          { error: "Invalid concepts generated" },
          { status: 400 }
        )
      }

      // Validate each concept
      const validConcepts = concepts.filter(c => 
        c && typeof c === 'object' && c.title?.trim() && c.description?.trim()
      )

      if (validConcepts.length !== 4) {
        console.error("❌ Some concepts are invalid:", concepts)
        return NextResponse.json(
          { error: "Invalid concept format" },
          { status: 400 }
        )
      }

      // Generate images for valid concepts
      console.log("🎨 Starting image generation for concepts...")
      const imageResponses = await Promise.all(
        validConcepts.map(async (concept, index) => {
          console.log(`🖼️ Generating image ${index + 1}/4:`, concept.description)
          try {
            const imageUrl = await generateImage(concept.description)
            return { success: true, url: imageUrl }
          } catch (error) {
            console.error(`❌ Image generation failed for concept ${index + 1}:`, error)
            return { success: false, url: "/placeholder.png" }
          }
        })
      )

      console.log("🖼️ Image generation results:", JSON.stringify(imageResponses, null, 2))

      // Combine concepts with generated images
      const conceptsWithImages = validConcepts.map((concept, index) => ({
        title: concept.title.trim(),
        description: concept.description.trim(),
        style: concept.style || style || "Modern",
        image: imageResponses[index]?.url || "/placeholder.png"
      }))

      console.log("✨ Final concepts with images:", JSON.stringify(conceptsWithImages, null, 2))
      return NextResponse.json({ 
        concepts: conceptsWithImages,
        status: "success"
      })

    } catch (err) {
      const openaiError = err as Error
      console.error("❌ OpenAI API error:", openaiError)
      return NextResponse.json(
        { 
          error: "Failed to generate concepts",
          concepts: FALLBACK_CONCEPTS,
          details: openaiError.message
        },
        { status: 200 }
      )
    }

  } catch (err) {
    const error = err as Error
    console.error("❌ Request processing error:", error)
    return NextResponse.json(
      { 
        error: "Failed to process request",
        concepts: FALLBACK_CONCEPTS,
        details: error.message
      },
      { status: 200 }
    )
  }
}