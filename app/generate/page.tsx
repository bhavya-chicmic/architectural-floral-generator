"use client";

import { useState, useRef, DragEvent, ChangeEvent, useEffect } from "react";
import Image from "next/image";

const FLOWER_OPTIONS = [
  "rose",
  "marigold",
  "jasmine",
  "orchid",
  "tulip",
  "sunflower",
  "lily",
];

export default function GeneratePage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // State to store previous parameters for regenerate
  const [lastParams, setLastParams] = useState<{
    image: string;
    style: string[];
  } | null>(null);

  useEffect(() => {
    if (generatedImage && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [generatedImage]);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageFile(file);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const handleImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style)
        ? prev.filter((s) => s !== style)
        : [...prev, style]
    );
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;

    setIsGenerating(true);
    setGeneratedImage(null);

    const params = {
      image: selectedImage,
      style: selectedStyles,
    };

    // Store params for regenerate
    setLastParams(params);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();

      const finalImageUrl = data.imageUrl ||
        (data.b64_json ? `data:image/png;base64,${data.b64_json}` : null);

      if (!finalImageUrl) {
        throw new Error("No image data received");
      }

      setGeneratedImage(finalImageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    if (!lastParams) return;

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lastParams),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();

      const finalImageUrl = data.imageUrl ||
        (data.b64_json ? `data:image/png;base64,${data.b64_json}` : null);

      if (!finalImageUrl) {
        throw new Error("No image data received");
      }

      setGeneratedImage(finalImageUrl);
    } catch (error) {
      console.error("Error regenerating image:", error);
      alert("Failed to regenerate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `generated-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-6xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text mb-4"
            style={{ lineHeight: 1.2 }}
          >
            Transform Any Space with Floral Design
          </h1>
          <p className="text-gray-600 text-lg">
            See how flowers can elevate your space—instantly
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-200/50">
          {/* Image Upload Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              1. Upload Your Image
            </h2>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer ${isDragging
                ? "border-indigo-400 bg-indigo-50 scale-[1.02]"
                : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              {selectedImage ? (
                <div className="relative w-full h-64">
                  <Image
                    src={selectedImage}
                    alt="Selected"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 mb-4"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold text-indigo-500">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-gray-500 text-sm">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tab Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              2. Choose Decoration Style
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
              {FLOWER_OPTIONS.map((flower) => (
                <button
                  key={flower}
                  onClick={() => toggleStyle(flower)}
                  className={`py-3 px-4 rounded-lg font-medium transition-all duration-300 border capitalizing ${selectedStyles.includes(flower)
                    ? "bg-indigo-50 text-indigo-600 border-indigo-200 shadow-sm"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                    }`}
                >
                  {flower.charAt(0).toUpperCase() + flower.slice(1)}
                </button>
              ))}
            </div>
            {selectedStyles.length === 0 && (
              <p className="text-sm text-amber-600 mt-2">
                Please select at least one style.
              </p>
            )}
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!selectedImage || isGenerating || selectedStyles.length === 0}
            className="w-full py-4 bg-gradient-to-r from-indigo-400 to-purple-400 text-white font-semibold rounded-lg shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </span>
            ) : (
              "Generate Image"
            )}
          </button>
        </div>

        {/* Generated Image Section */}
        {generatedImage && (
          <div
            ref={resultsRef}
            className="mt-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-200/50 animate-fade-in"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Generated Image
            </h2>
            <div className="relative w-full h-[600px] mb-6 rounded-xl overflow-hidden shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={generatedImage}
                alt="Generated"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleRegenerate}
                disabled={isGenerating}
                className="flex-1 py-3 px-6 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isGenerating ? "Regenerating..." : "Regenerate"}
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-teal-400 to-emerald-400 text-white font-semibold rounded-lg shadow-lg shadow-teal-200 hover:shadow-teal-300 transition-all duration-300 hover:scale-[1.02]"
              >
                Download PNG
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
