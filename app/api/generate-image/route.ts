import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

/* ----------------------------------
   CONFIG
---------------------------------- */

const ALLOWED_FLOWERS = [
  "rose",
  "tulip",
  "lily",
  "orchid",
  "sunflower",
  "marigold",
  "peony",
  "jasmine"
];

/* ----------------------------------
   HELPERS
---------------------------------- */

function normalizeFlowers(input: string | string[]) {
  const list = Array.isArray(input) ? input : input.split(",");
  return list
    .map(f => f.trim().toLowerCase())
    .filter(f => ALLOWED_FLOWERS.includes(f));
}

function buildPrompt({
  flowers,
  colors,
  wrap,
}: {
  flowers: string[];
  colors: string[];
  wrap: string;
}) {
  return `
You are a professional floral designer and photographer.

TASK:
Generate a hyper-realistic bouquet product image.

BOUQUET DETAILS:
• Flowers: ${flowers.join(", ")}
• Color theme: ${colors.join(", ")}
• Wrapping style: ${wrap}

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

/* ----------------------------------
   ROUTE HANDLER
---------------------------------- */

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
        
        The flowers MUST be chosen from this allowed list: ${ALLOWED_FLOWERS.join(", ")}.
        
        Return ONLY a JSON object with the following structure:
        {
          "flowers": ["flower1", "flower2"],
          "colors": ["color1", "color2"],
          "wrap": "suggested wrapping style"
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
    const { flowers, colors, wrap } = body;

    if (!flowers || !colors || !wrap) {
      return NextResponse.json(
        { error: "Missing bouquet configuration" },
        { status: 400 }
      );
    }

    const normalizedFlowers = normalizeFlowers(flowers);

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

    // Use Imagen 3 for image generation
    const model = genAI.getGenerativeModel({
      model: "imagen-3.0-generate-001",
    });

    const prompt = buildPrompt({
      flowers: normalizedFlowers,
      colors,
      wrap,
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      // Imagen specific config might be needed, but 'responseModalities' is often inferred or not needed for Imagen model
      // keeping basic structure or adapting as needed
    });

    const imagePart = result.response.candidates?.[0]?.content?.parts?.find(
      (p: any) => p.inlineData
    );

    if (!imagePart?.inlineData) {
      throw new Error("No image returned from Gemini");
    }

    const imageBase64 = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;

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