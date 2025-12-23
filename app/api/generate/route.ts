import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

/* ----------------------------------
   CONFIG
---------------------------------- */

const ALLOWED_FLOWERS = [
  "rose",
  "marigold",
  "jasmine",
  "orchid",
  "tulip",
  "sunflower",
  "lily"
];

const MAX_RETRIES = 1;

/* ----------------------------------
   HELPERS
---------------------------------- */

function normalizeFlowers(style: string | string[]): string[] {
  let flowers: string[] = [];
  
  if (Array.isArray(style)) {
    flowers = style;
  } else {
    flowers = style.split(",");
  }

  return flowers
    .map(f => f.trim().toLowerCase())
    .filter(f => ALLOWED_FLOWERS.includes(f));
}

function buildPrompt(flowers: string[]) {
  return `
    You are performing a REALISTIC, ADDITIVE IMAGE EDIT on a real photograph.

    CRITICAL PRESERVATION RULES (MUST FOLLOW):
    - Preserve the original photograph exactly
    - Do NOT regenerate, redraw, repaint, or stylize the image
    - Do NOT change gate structure, materials, colors, textures, or perspective
    - Do NOT alter tiles, ground, background, trees, sky, or lighting
    - Do NOT add depth effects, cinematic lighting, HDR, or 3D realism
    - Maintain original shadows, contrast, and camera characteristics

    EDITING SCOPE:
    - Only add floral decorations
    - Decorations must be physically attached to:
      • gate pillars
      • gate frame (top and side bars)
    - No flowers anywhere else

    DECORATION REQUIREMENTS (IMPORTANT):
    - Use clearly visible, WELL-DEFINED, DENSE floral arrangements
    - Flowers should be abundant, not sparse or minimal
    - Create continuous garlands and clustered arrangements
    - Decorations should look professionally installed (event/wedding style)
    - Flowers must feel like real objects added onto the existing gate

    STYLE & REALISM:
    - Photographic realism is more important than artistic beauty
    - Match the exact lighting, shadows, and color temperature of the original photo
    - Flowers must blend naturally without altering the base image
    - Avoid over-perfect symmetry or artificial smoothness

    FLOWER TYPE:
    Use ONLY the following flowers:
    ${flowers.join(", ")}

    FINAL CHECK BEFORE OUTPUT:
    If any part of the image other than flowers looks changed,
    undo that change and keep the original pixels.

    OUTPUT:
    Return the same photograph with visibly rich floral decorations added,
    and nothing else altered.
  `;
}

async function retry<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      console.warn(`Retry ${i + 1} failed`);
    }
  }
  throw lastError;
}

async function dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
}

/* ----------------------------------
   ROUTE
---------------------------------- */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, style, mask } = body;

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    if (!style) {
      return NextResponse.json({ error: "Style is required" }, { status: 400 });
    }

    const flowers = normalizeFlowers(style);

    if (flowers.length === 0) {
      return NextResponse.json(
        { error: `Invalid flower selection. Allowed: ${ALLOWED_FLOWERS.join(", ")}` },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });
    const prompt = buildPrompt(flowers);

    console.log("Generating decorated gate with GPT-4o Image…");

    const generateImage = async () => {
      const formData = new FormData();
      formData.append("model", "gpt-image-1.5");
      formData.append("prompt", prompt);
      
      const imageFile = await dataUrlToFile(image, "gate.png");
      formData.append("image[]", imageFile); // data URL

      // Optional mask for precise decoration area
      if (mask) {
        formData.append("mask", mask); // PNG with transparent areas
      }

      const response = await fetch("https://api.openai.com/v1/images/edits", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    };
    console.log("IMAGE GENERATION STARTED ", new Date().toISOString());
    const result = await retry(generateImage);
    console.log("IMAGE GENERATION ENDED ", new Date().toISOString());
    const imageInfo = result?.data?.[0];
    const imageUrl = imageInfo?.url;
    const b64Json = imageInfo?.b64_json;

    if (!imageUrl && !b64Json) {
      throw new Error("No image returned from GPT-4o");
    }

    console.log("Image generated successfully");

    const dataUrl = b64Json ? `data:image/png;base64,${b64Json}` : imageUrl;

    return NextResponse.json({ imageUrl: dataUrl, success: true });

  } catch (error: any) {
    console.error("Error generating image:", error);

    return NextResponse.json(
      { error: error?.message || "Failed to generate image" },
      { status: 500 }
    );
  }
}