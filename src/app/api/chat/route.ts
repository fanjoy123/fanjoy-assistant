import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const styles = ['Minimal', 'Bold & Vibrant', 'Vintage', 'Modern']

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    const responses = await Promise.all(
      styles.map(style =>
        openai.chat.completions.create({
          model: "gpt-4-turbo-preview",
          messages: [
            {
              role: "system",
              content: `You are a professional merchandise designer. Generate a ${style.toLowerCase()} merchandise concept in this exact format:

1. [Catchy name for the design]
2. [Brief, visual description of the design elements]
3. [Target audience and intended vibe]
4. [Color palette and typography suggestions]

Keep each response concise but descriptive. Focus on visual elements that would work well on merchandise.`
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      )
    )

    const concepts = responses.map((res, i) => ({
      id: `concept-${i + 1}`,
      style: styles[i],
      content: res.choices[0]?.message?.content || "Failed to generate concept"
    }))

    return NextResponse.json({ concepts })
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    )
  }
} 