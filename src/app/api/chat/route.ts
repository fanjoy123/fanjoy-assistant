// ... existing code ...
      // Generate images for valid concepts
      console.log("🎨 Starting image generation for concepts...")
      const imageResponses = await Promise.all(
        validConcepts.map(async (concept, index) => {
          console.log(`🖼️ Generating image ${index + 1}/4:`, concept.description)
          try {
            const response = await openai.images.generate({
              model: "dall-e-3",
              prompt: `T-shirt design: ${concept.description}`,
              n: 1,
              size: "1024x1024",
              quality: "standard",
              response_format: "url"
            })

            const imageUrl = response?.data?.[0]?.url
            console.log(`✅ Image URL for concept ${index + 1}:`, imageUrl)

            if (!imageUrl || !imageUrl.startsWith('https://')) {
              console.error(`❌ Invalid image URL for concept ${index + 1}:`, imageUrl)
              return { success: false, url: "/placeholder.png" }
            }

            return { success: true, url: imageUrl }
          } catch (error) {
            console.error(`❌ Image generation failed for concept ${index + 1}:`, error)
            return { success: false, url: "/placeholder.png" }
          }
        })
      )

      console.log("🖼️ All image responses:", JSON.stringify(imageResponses, null, 2))

      // Combine concepts with generated images
      const conceptsWithImages = validConcepts.map((concept, index) => {
        const imageUrl = imageResponses[index]?.url
        console.log(`✅ Final image URL for concept ${index + 1}:`, imageUrl)
        
        return {
          title: concept.title.trim(),
          description: concept.description.trim(),
          style: concept.style || style || "Modern",
          image: typeof imageUrl === 'string' ? imageUrl : "/placeholder.png"
        }
      })

      console.log("✨ Final concepts with images:", JSON.stringify(conceptsWithImages, null, 2))
      return NextResponse.json({ 
        concepts: conceptsWithImages,
        status: "success"
      })