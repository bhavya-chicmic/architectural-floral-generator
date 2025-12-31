"use client";

import { useState, useRef } from "react";

interface Suggestion {
    flowers: string[];
    colors: string[];
    wrap: string;
}

interface ImageUploaderProps {
    onSuggestions: (suggestion: any, imagePreview: string) => void;
}

export default function ImageUploader({ onSuggestions }: ImageUploaderProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate (optional)
        if (!file.type.startsWith("image/")) {
            setError("Please upload a valid image file.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // 1. Convert to Base64
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result as string;

                // 2. Call API
                try {
                    const res = await fetch("/api/generate-image", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            image: base64String,
                            mimeType: file.type,
                        }),
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error(data.error || "Failed to analyze image");
                    }

                    if (data.suggestions) {
                        onSuggestions(data.suggestions, base64String);
                    }
                } catch (apiErr: any) {
                    setError(apiErr.message || "Something went wrong.");
                } finally {
                    setLoading(false);
                }
            };
            reader.readAsDataURL(file);
        } catch (err) {
            setError("Failed to process image.");
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 mb-8 animate-fade-in-up">
            <h2 className="text-2xl font-serif text-stone-800 mb-2">
                🤖 AI Floral Assistant
            </h2>
            <p className="text-stone-500 mb-6">
                Upload a photo of a dress, venue, or inspiration, and we'll suggest the perfect bouquet.
            </p>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                    {error}
                </div>
            )}

            <div
                onClick={() => !loading && fileInputRef.current?.click()}
                className={`
          border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer group
          ${loading
                        ? "border-stone-200 bg-stone-50 cursor-wait"
                        : "border-rose-200 hover:border-rose-400 hover:bg-rose-50"
                    }
        `}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    disabled={loading}
                />

                {loading ? (
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
                        <p className="text-sm font-medium text-rose-600 animate-pulse">
                            Analyzing colors and style...
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                            📸
                        </div>
                        <div>
                            <p className="font-semibold text-stone-700">Click to upload photo</p>
                            <p className="text-sm text-stone-400">JPG, PNG up to 5MB</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
