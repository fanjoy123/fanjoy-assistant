import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'

// Log OpenAI key prefix to verify it's loaded
const OPENAI_KEY = process.env.OPENAI_API_KEY
console.log("🔑 OpenAI Key used:", OPENAI_KEY?.slice(0, 5))

if (!OPENAI_KEY) {
  console.error("❌ No OpenAI API key found in environment variables")
  throw new Error("OpenAI API key is required")
}

const openai = new OpenAI({
  apiKey: OPENAI_KEY
})

interface Concept {
  title: string
  productType: string
  description: string
}

const systemPrompt = `
You are a merch strategist for creators. Based on a short description of the creator's vibe, audience, or content, generate a creative pitch pack with 3-5 unique merch ideas.

For each concept, return:
- Title (a catchy product name)
- Product Type (e.g. crewneck, trucker hat, journal)
- Description (1-2 sentences max explaining the idea)

Format the response in JSON like this:
[
  {
    "title": "Midnight Rodeo Club",
    "productType": "Oversized Tee",
    "description": "Washed black t-shirt with bold western text and star graphics. Great for fans of coastal cowgirl and country aesthetics."
  },
  ...
]
Make sure each idea is creative, merch-ready, and aligned with creator culture and Gen Z aesthetics.
`;

async function generateImage(description: string): Promise<string> {
  try {
    console.log("🎨 Generating image for description:", description)
    
    if (!description?.trim()) {
      console.error("❌ Empty description provided for image generation")
      return "/placeholder.png"
    }

    const prompt = description
    console.log("📝 Image generation prompt:", prompt)

    try {
      console.log("🚀 Calling DALL·E API with prompt:", prompt)
      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024"
      })

      console.log("🧠 Full DALL·E response:", JSON.stringify(imageResponse, null, 2))

      if (!imageResponse?.data?.[0]?.url) {
        console.error("❌ No image URL in DALL·E response:", imageResponse)
        throw new Error("No image URL returned by DALL·E")
      }

      const imageUrl = imageResponse.data[0].url
      console.log("✅ Image URL:", imageUrl)

      if (!imageUrl || !imageUrl.startsWith("http")) {
        console.error("❌ Invalid image URL returned:", imageUrl)
        throw new Error("Invalid image URL format")
      }

      console.log("✅ Valid image URL generated:", imageUrl)
      return imageUrl

    } catch (apiError) {
      console.error("❌ DALL·E API error:", apiError)
      throw apiError
    }

  } catch (err) {
    const error = err as Error
    console.error("❌ Image generation failed:", {
      error: error.message,
      stack: error.stack,
      name: error.name
    })
    return "/placeholder.png"
  }
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    console.log('Generating concepts for prompt:', prompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      console.error('No response from OpenAI');
      return NextResponse.json({ error: 'Failed to generate concepts' }, { status: 500 });
    }

    console.log('Raw OpenAI response:', response);

    let concepts: Concept[];
    try {
      concepts = JSON.parse(response);
      
      if (!Array.isArray(concepts)) {
        throw new Error('Response is not an array');
      }

      // Validate each concept has required fields
      concepts = concepts.filter(concept => {
        const isValid = concept.title && concept.productType && concept.description;
        if (!isValid) {
          console.warn('Invalid concept found:', concept);
        }
        return isValid;
      });

    } catch (error) {
      console.error('Failed to parse concepts:', error);
      return NextResponse.json({ error: 'Failed to parse concepts' }, { status: 500 });
    }

    if (concepts.length === 0) {
      return NextResponse.json({ error: 'No valid concepts generated' }, { status: 500 });
    }

    console.log('Processed concepts:', concepts);
    return NextResponse.json({ concepts });

  } catch (error) {
    console.error('Error in route handler:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}