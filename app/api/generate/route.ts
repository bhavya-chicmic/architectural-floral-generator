import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

function buildPrompt(flowerName: string): string {
  return `You are a professional architectural floral decorator and photorealistic image editor.

TASK:
Decorate the provided gate image using ONLY "${flowerName}" flowers.

STRICT RULES:
- Do NOT change the gate's structure, size, color, material, or shape
- Do NOT add people, animals, text, symbols, logos, or watermarks
- Do NOT distort or repaint the gate
- Flowers must look naturally attached (garlands, arches, hanging strings)
- Decoration must be elegant, symmetrical, and realistic
- Lighting, shadows, and perspective must remain consistent
- Background must remain unchanged

STYLE:
- Ultra-realistic photography
- High detail
- Natural colors
- Professional event decoration quality

OUTPUT:
Return only the final decorated image.`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, style } = body;

    if (!style) {
      return NextResponse.json(
        { error: "Style is required" },
        { status: 400 }
      );
    }

    if (!image) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    // Get API key from environment
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured. Please add GEMINI_API_KEY to your .env.local file" },
        { status: 500 }
      );
    }

    console.log("Generating image with Gemini...");
    console.log("Style:", style);

    // Initialize GoogleGenAI
    const ai = new GoogleGenAI({ apiKey });

    // Extract base64 and mime type from data URL
    const [mimeInfo, base64Data] = image.split(",");
    const mimeType = mimeInfo.match(/:(.*?);/)?.[1] || "image/png";

    const prompt = buildPrompt(style);

    // Generate content with image input
    const response = await ai.models.generateContent({
      model: "gemini-1.5-pro",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data,
              },
            },
          ],
        },
      ],
    });

    // Extract the generated image
    if (!response?.candidates || response.candidates.length === 0) {
      throw new Error("No candidates returned from Gemini");
    }

    let imageData = null;
    const firstCandidate = response.candidates[0];
    
    if (firstCandidate?.content?.parts) {
      for (const part of firstCandidate.content.parts) {
        if (part.inlineData) {
          imageData = part.inlineData.data;
          break;
        }
      }
    }

    if (!imageData) {
      // If no image data but we have text, maybe it's an error or description
      const textResponse = firstCandidate?.content?.parts?.[0]?.text;
      if (textResponse) {
        throw new Error(`AI returned text instead of an image: ${textResponse}`);
      }
      throw new Error("No image data returned from Gemini");
    }

    // Convert to data URL for frontend display
    const imageUrl = `data:image/png;base64,${imageData}`;

    console.log("Image generated successfully!");

    return NextResponse.json({
      imageUrl: imageUrl,
      success: true,
    });
  } catch (error: any) {
    console.error("Error generating image:", error);

    // Handle specific errors
    if (error?.message?.includes("API key")) {
      return NextResponse.json(
        { error: "Invalid Gemini API key" },
        { status: 401 }
      );
    }

    if (
      error?.message?.includes("429") ||
      error?.message?.includes("quota") ||
      error?.message?.includes("rate limit")
    ) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: error?.message || "Failed to generate image" },
      { status: 500 }
    );
  }
}
