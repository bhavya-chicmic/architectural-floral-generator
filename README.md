# AI Image Changer

A Next.js 14 application that uses OpenAI's API to decorate images with AI-generated elements.

## Features

- 🎨 Drag-and-drop or file selection for image upload (provides context for generation)
- 🌸 Choose from preset decoration styles (Lily, Rose) or create custom styles  
- ⚡ Real-time image generation with Google Gemini AI
- 🔄 Regenerate images with the same parameters
- 💾 Download generated images as PNG
- 🎭 Beautiful, modern UI with TailwindCSS
- 🌈 Premium gradient designs and smooth animations

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the root directory:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Navigate to `/generate` page
2. Upload an image using drag-and-drop or file selection
3. Choose a decoration style (Lily, Rose, or Custom)
4. Click "Generate Image" and wait for the AI to process
5. View your generated image
6. Use "Regenerate" to create a new variation or "Download" to save the image

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **AI**: OpenAI Images API
- **Font**: Inter (Google Fonts)

## Project Structure

```
/app
  /api
    /generate
      route.ts          # OpenAI API integration
  /generate
    page.tsx           # Main image generation page
  globals.css          # Global styles
  layout.tsx           # Root layout
  page.tsx             # Landing page
```

## API Route

The `/api/generate` endpoint:
- Accepts POST requests with `image` (base64) and `style` (string)
- Uses OpenAI's image edit API
- Returns the generated image URL

## Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key (required)

## License

MIT
