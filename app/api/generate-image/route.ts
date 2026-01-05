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
    // OPTION A: Custom Bouquet with Basket + Flowers
    // ---------------------------------------------------------
    if (body.basketImage && body.flowerImages) {
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });

      // Prepare images for the prompt
      const parts: any[] = [];
      
      // Add basket image
      let basketData = body.basketImage;
      if (basketData.includes("base64,")) {
        basketData = basketData.split("base64,")[1];
      }
      parts.push({
        inlineData: {
          data: basketData,
          mimeType: "image/jpeg",
        },
      });

      // Add flower images
      body.flowerImages.forEach((img: string) => {
        let flowerData = img;
        if (flowerData.includes("base64,")) {
          flowerData = flowerData.split("base64,")[1];
        }
        parts.push({
          inlineData: {
            data: flowerData,
            mimeType: "image/jpeg",
          },
        });
      });

      // Add text prompt
      parts.push({
        text: `You are performing a STRICT VISUAL SUGGESTION AND PRESERVATION task.

TASK:
Show a visual suggestion of how the uploaded plants or flowers could be placed together inside the uploaded basket.

IMPORTANT:
This is NOT a creative redesign.
This is NOT an artistic reinterpretation.
This is a placement suggestion using ONLY the user-uploaded assets.

IMAGE RULES:
- First image: Basket / container (must remain unchanged)
- Remaining images: Plant or flower references

ABSOLUTE CONSTRAINTS:
- Preserve the exact basket shape, proportions, edges, and geometry
- Do NOT redesign, stylize, or reinterpret the basket
- Do NOT introduce any new plant species
- Do NOT add any flowers, foliage, or materials that are NOT visible in the uploaded images
- Do NOT change the identity, leaf shape, or flower type of the uploaded plants

PLANT USAGE RULES (VERY IMPORTANT):
- You MAY reuse and repeat the SAME uploaded plant or flower multiple times
- Repetition is allowed ONLY by duplicating the exact uploaded plant appearance
- All repeated plants must look identical to the uploaded reference
- Do NOT invent variations, colors, or new plant forms

COMPOSITION RULES:
- Use enough repeated plants to visually suggest a balanced arrangement
- Plants may overlap naturally
- The goal is to suggest where and how the plants could look good together
- Empty space is acceptable if needed to preserve accuracy

VISUAL STYLE:
- Conceptual arrangement preview
- Not photorealistic product photography
- Not a catalog or lifestyle render
- Avoid beautification or idealization

PRIORITY:
Object fidelity > basket accuracy > visual clarity > beauty

OUTPUT:
Generate a single image that visually suggests how multiple instances of the uploaded plants could be arranged inside the uploaded basket, using only the provided images.`, 
      });

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: parts,
          },
        ],
        generationConfig: {
          responseModalities: ["IMAGE"],
        } as any,
      });

      let imageBase64 = "";
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
    }
    
    // ---------------------------------------------------------
    // OPTION B: Handle Image Upload & AI Suggestions
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