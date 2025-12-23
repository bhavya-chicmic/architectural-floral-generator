import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

/* ----------------------------------
   CONFIG
---------------------------------- */
const ALLOWED_FLOWERS = ["rose", "marigold", "jasmine", "orchid", "tulip", "sunflower", "lily"];

/* ----------------------------------
   HELPERS
---------------------------------- */
function normalizeFlowers(style: string | string[]): string[] {
  const flowers = Array.isArray(style) ? style : style.split(",");
  return flowers
    .map(f => f.trim().toLowerCase())
    .filter(f => ALLOWED_FLOWERS.includes(f));
}

// Convert Data URL to a format Gemini understands
function dataUrlToGenerativePart(dataUrl: string) {
  const base64Data = dataUrl.split(",")[1];
  const mimeType = dataUrl.split(",")[0].split(":")[1].split(";")[0];
  return {
    inlineData: {
      data: base64Data,
      mimeType
    },
  };
}

function buildPrompt(flowers: string[]) {
  return `
    IMAGE EDITING TASK:
    You are an expert floral decorator. I am providing an image and you must add flowers to it.

    REQUIRED FLOWERS: ${flowers.join(", ")}

    CRITICAL RULES:
    1. PRESERVE THE ORIGINAL: Keep the background, structure, lighting, and people exactly as they are.
    2. ADDITIVE ONLY: Add floral garlands and clusters to architectural elements (pillars, gates, or frames).
    3. REALISM: The flowers must match the lighting and shadows of the original photo.
    4. PLACEMENT: Attach flowers to surfaces. Do not let them float.

    OUTPUT: Return the modified image with the decorations included.
  `;
}

/* ----------------------------------
   ROUTE
---------------------------------- */
export async function POST(request: NextRequest) {
  try {
    const { image, style } = await request.json();

    if (!image || !style) {
      return NextResponse.json({ error: "Image and style are required" }, { status: 400 });
    }

    const flowers = normalizeFlowers(style);
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey!);
    
    // Use gemini-2.0-flash-exp or gemini-1.5-pro
    const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash-image" 
    });
    
    const promptText = buildPrompt(flowers);
    const imagePart = dataUrlToGenerativePart(image);

    console.log("Gemini Generation Started...");

    // CRITICAL: We must pass the config with responseModalities
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [imagePart, { text: promptText }] }],
      generationConfig: {
        // @ts-ignore - The SDK types might not show this field yet in some versions
        responseModalities: ["IMAGE"],
      }
    });

    const response = await result.response;
    
    // The response will contain the edited image in the inlineData part
    const outputPart = response.candidates?.[0].content.parts.find(p => p.inlineData);

    if (!outputPart || !outputPart.inlineData) {
      throw new Error("The model returned text but failed to generate the image data.");
    }

    const base64Image = `data:${outputPart.inlineData.mimeType};base64,${outputPart.inlineData.data}`;

    return NextResponse.json({ imageUrl: base64Image, success: true });

  } catch (error: any) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ error: error?.message || "Generation failed" }, { status: 500 });
  }
}