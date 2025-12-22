# 🚀 Quick Setup Guide

## Prerequisites
- Node.js 18+ installed
- Google Gemini API key ([Get one here](https://aistudio.google.com/apikey))

## Installation Steps

### 1. Install Dependencies
Dependencies are already installed! If you need to reinstall:
```bash
npm install
```

### 2. Configure Google Gemini API Key

Create a `.env.local` file in the root directory:

```bash
GEMINI_API_KEY=your_api_key_here
```

⚠️ **Important**: 
- Replace `your_api_key_here` with your actual Gemini API key
- Get your API key here: https://aistudio.google.com/app/apikey
- Never commit `.env.local` to git (it's already in `.gitignore`)
- The Gemini API may have usage limits based on your account

### 3. Start the Development Server

The server is already running! If you need to restart:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1. **Navigate to Generate Page**: Click "Get Started" or go to `/generate`

2. **Upload an Image**: 
   - Drag and drop an image into the upload area
   - Or click to browse and select a file
   - Supported formats: PNG, JPG, GIF

3. **Choose a Style**:
   - **Lily**: Decorates with lily flowers
   - **Rose**: Decorates with rose flowers
   - **Custom**: Enter your own decoration style (e.g., "sunflowers", "cherry blossoms", "autumn leaves")

4. **Generate**: Click "Generate Image" and wait for the AI to process

5. **Download or Regenerate**:
   - **Download PNG**: Save the generated image to your computer
   - **Regenerate**: Create a new variation with the same parameters

## Features Implemented ✅

### Frontend (`/app/generate/page.tsx`)
- ✅ Drag & drop image upload
- ✅ File selection fallback
- ✅ Image preview after upload
- ✅ Tab selection (Lily, Rose, Custom)
- ✅ Custom text input (shows when Custom tab is selected)
- ✅ Generate button with loading animation
- ✅ Generated image display with smooth fade-in
- ✅ Regenerate button (uses same parameters)
- ✅ Download button (saves as PNG)
- ✅ Premium UI with gradients and animations
- ✅ Responsive design
- ✅ Disabled state management

### Backend (`/app/api/generate/route.ts`)
- ✅ POST endpoint at `/api/generate`
- ✅ Accepts base64 image and flower style
- ✅ Google Gemini AI integration (gemini-1.5-pro)
- ✅ Direct REST API calls (no SDK dependencies)
- ✅ Image-to-image generation with proper configuration
- ✅ Proper error handling
- ✅ API key validation
- ✅ Rate limit error messages
- ✅ Returns image as base64 data URL

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **AI**: Google Gemini AI (gemini-2.0-flash-exp)
- **Font**: Inter (Google Fonts)

## API Details

### Endpoint: POST `/api/generate`

**Request Body:**
```json
{
  "image": "data:image/png;base64,..." (optional - provides context),
  "style": "lily" | "rose" | "custom text"
}
```

**Response:**
```json
{
  "imageUrl": "data:image/png;base64,...",
  "success": true
}
```

**Error Response:**
```json
{
  "error": "Error message"
}
```

## Troubleshooting

### API Key Issues
- Make sure `.env.local` exists in the root directory
- Verify the API key format is correct (starts with `AIza`)
- Restart the dev server after adding the key

### Image Upload Issues
- Check browser console for errors
- Ensure the image file size is under 10MB
- Try a different image format

### Generation Issues
- Verify your Google Gemini API quota/limits
- Check the browser console and terminal for error messages
- The API may have rate limits - wait a few seconds and try again

## Next Steps

- The `.env.local` file already contains your Google Gemini API key
- Test the image upload functionality
- Try generating images with different styles
- Customize the UI colors and animations in `tailwind.config.ts`

## Notes

- The application uses Google Gemini's text-to-image generation
- The uploaded image provides context for the prompt generation
- Each generation may consume API quota
- Generated images are returned as base64 data URLs
- Images should be downloaded if you want to keep them

Enjoy creating beautiful AI-generated images! 🎨✨
