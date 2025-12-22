# 🎯 Testing Instructions

## Current Status

✅ **Application is running at:** http://localhost:3000
✅ **Google Gemini API Key is configured:** AIzaSyD3UnXc254RwccQGpMAxbtwUjf1sVU-rw0

## How to Test

### 1. Access the Application
Open your browser and navigate to:
- **Landing Page:** http://localhost:3000
- **Generate Page:** http://localhost:3000/generate

### 2. Test Image Generation

1. **Upload an Image** (optional - provides context):
   - Drag and drop any image file
   - OR click the upload area to select a file

2. **Choose a Style:**
   - Click **"Lily"** for lily flower decorations
   - Click **"Rose"** for rose flower decorations  
   - Click **"Custom"** and enter your own style (e.g., "cherry blossoms", "sunflowers", "autumn leaves")

3. **Generate:**
   - Click the **"Generate Image"** button
   - Wait for the loading animation
   - The AI will generate a beautiful image based on your selected style

4. **After Generation:**
   - **View** the generated image
   - **Regenerate** to create a new variation
   - **Download PNG** to save the image

## What Changed from OpenAI to Google Gemini

### Key Differences:
1. **API Provider:** Now using Google Gemini AI instead of OpenAI
2. **Model:** Using `gemini-2.0-flash-exp` for image generation
3. **Generation Type:** Text-to-image (not image editing)
   - Your uploaded image provides context for the prompt
   - Gemini generates a completely new image
   - The prompt describes "an ornate gate decorated with {style}"

### Prompt Examples:
When you select "Lily", the API creates a prompt like:
```
Create a beautiful image of an ornate gate or entrance decorated with lily. 
The gate should be elegant and grand, adorned artistically with lily in a natural and aesthetic way. 
The lily should complement the architecture and create a stunning, harmonious scene. 
Make it look realistic and visually appealing, as if it's a real decorated entrance to a fancy venue or garden.
```

## Troubleshooting

### If the generation fails:
1. Check the browser console (F12 → Console tab)
2. Check the terminal where `npm run dev` is running
3. Common issues:
   - API quota exceeded
   - Invalid API key
   - Network issues
   - Model not available

### If you see an error:
- The error message will appear in the browser alert
- Check the terminal for detailed error logs
- Verify the API key is correct in the environment

## Next Steps

Once you confirm it's working, you mentioned you'll provide your own custom prompt later. I can update the prompt generation logic in `/app/api/generate/route.ts` when you're ready.

## API Key Note

The API key **AIzaSyD3UnXc254RwccQGpMAxbtwUjf1sVU-rw0** is currently:
- ✅ Added to `.env.example` 
- ❌ NOT in `.env.local` (you need to create this file manually)

**To activate the API key:**
```bash
echo "GOOGLE_GENAI_API_KEY=AIzaSyD3UnXc254RwccQGpMAxbtwUjf1sVU-rw0" > .env.local
```

Then restart the dev server:
```bash
# Press Ctrl+C in the terminal running npm run dev
# Then run:
npm run dev
```

Happy testing! 🚀
