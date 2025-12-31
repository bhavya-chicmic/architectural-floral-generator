import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

/* ----------------------------------
   CONFIG
---------------------------------- */

const ALLOWED_FLOWERS = [
  "Red Rose", "White Rose", "Pink Rose", "Garden Rose",
  "White Lily", "Pink Lily", "Oriental Lily",
  "Red Tulip", "Yellow Tulip", "Pink Tulip",
  "White Orchid", "Purple Orchid",
  "Pink Peony", "White Peony", "Coral Peony",
  "Sunflowers", "Daisies", "Hydrangeas", "Carnations"
];

/* ----------------------------------
   HELPERS
---------------------------------- */

function normalizeFlowers(input: string | string[]) {
  const list = Array.isArray(input) ? input : input.split(",");
  return list
    .map(f => f.trim())
    .filter(f => ALLOWED_FLOWERS.includes(f));
}

function buildPrompt({
  bouquetType,
  flowers,
  quantity,
  colors,
  wrap,
  ribbonType,
  ribbonColor,
}: {
  bouquetType: string;
  flowers: string[];
  quantity: string;
  colors: string[];
  wrap: string;
  ribbonType: string;
  ribbonColor: string;
}) {
  return `
You are a professional floral designer and photographer.

TASK:
Generate a hyper-realistic bouquet product image.

BOUQUET DETAILS:
• Style: ${bouquetType} (${quantity} volume)
• Flowers: ${flowers.join(", ")}
• Color theme: ${colors.join(", ")}
• Wrapping: ${wrap}
• Ribbon: ${ribbonColor} ${ribbonType} ribbon

VISUAL REQUIREMENTS:
- Studio lighting
- Natural shadows
- Premium florist quality
- Realistic flower textures
- Clean background
- Centered composition

STRICT RULES:
- DO NOT include text or watermarks
- DO NOT add people or hands
- Image must look like a professional product photo
- Photorealistic, not illustration or 3D render

OUTPUT:
Return a single realistic bouquet image.
`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // ---------------------------------------------------------
    // OPTION A: Handle Image Upload & AI Suggestions
    // ---------------------------------------------------------
    if (body.image) {
      // Initialize Gemini for Vision/Text
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
      // Use validated available model
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      const prompt = `
        You are a professional floral designer.
        Analyze this image and suggest a bouquet design based on it.
        
        The flowers MUST be chosen from this EXAACT allowed list: ${ALLOWED_FLOWERS.join(", ")}.
        Do NOT suggest generic names like "rose". You MUST choose specific types like "Red Rose" or "Pink Rose".
        
        Return ONLY a JSON object with the following structure:
        {
          "bouquetType": "Hand-tied" | "Round" | "Cascading" | "Box" | "Basket" | "Vase",
          "flowers": ["exact_flower_name_from_list"],
          "quantity": "Minimal" | "Standard" | "Luxe",
          "colors": ["Classic Red", "Pastel", "White & Green", "Bright & Vibrant", "Custom"],
          "wrap": "Kraft Paper" | "Premium Matte" | "Transparent" | "Fabric" | "Luxury Box",
          "ribbonType": "Satin" | "Jute" | "Silk",
          "ribbonColor": "string (e.g. Red, Gold)"
        }
      `;

      // Extract base64 data (assuming format "data:image/jpeg;base64,...") or raw base64
      // We'll normalize to raw base64 string for the API
      let imageData = body.image;
      if (imageData.includes("base64,")) {
        imageData = imageData.split("base64,")[1];
      }

      const result = await model.generateContent([
        {
           inlineData: {
             data: imageData,
             mimeType: body.mimeType || "image/jpeg",
           },
        },
        prompt
      ]);

      const responseText = result.response.text();
      
      // Clean up markdown code blocks if present
      const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const suggestions = JSON.parse(cleanedText);

      return NextResponse.json({
        success: true,
        suggestions
      });
    }

    // ---------------------------------------------------------
    // OPTION B: Standard Generation (Existing Logic)
    // ---------------------------------------------------------
    const { 
      flowers, 
      colors, 
      wrap,
      bouquetType = "Hand-tied",
      quantity = "Standard",
      ribbonType = "Satin",
      ribbonColor = "matching" 
    } = body;

    if (!flowers || !colors || !wrap) {
      return NextResponse.json(
        { error: "Missing bouquet configuration" },
        { status: 400 }
      );
    }

    const normalizedFlowers = normalizeFlowers(flowers);

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

    // Use validated available model (gemini-2.0-flash-exp supports multimodal generation)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-image",
    });

    const prompt = buildPrompt({
      bouquetType,
      flowers: normalizedFlowers,
      quantity,
      colors,
      wrap,
      ribbonType,
      ribbonColor,
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseModalities: ["IMAGE"],
      } as any,
    });

    let imageBase64 = "";

    // Parse response as requested
    const candidates = result.response.candidates;
    if (candidates && candidates[0].content && candidates[0].content.parts) {
        for (const part of candidates[0].content.parts) {
            if (part.inlineData) {
                imageBase64 = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                break;
            }
        }
    }

    if (!imageBase64) {
      throw new Error("No image returned from Gemini");
    }

    return NextResponse.json({
      success: true,
      image: imageBase64,
    });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return NextResponse.json(
      { error: error.message || "Operation failed" },
      { status: 500 }
    );
  }
}