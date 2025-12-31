"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FlowerPicker from "./components/FlowerPicker";
import ColorPicker from "./components/ColorPicker";
import WrapPicker from "./components/WrapPicker";
import Preview from "./components/Preview";
import ImageUploader from "./components/ImageUploader";

export interface DesignState {
    flowers: string[];
    colors: string[];
    wrap: string;
    imageUrl: string;
}

export default function DesignPage() {
    const searchParams = useSearchParams();
    const [mode, setMode] = useState<"manual" | "ai">("manual");
    const [hasAiSuggestions, setHasAiSuggestions] = useState(false);

    useEffect(() => {
        if (searchParams.get("mode") === "ai") {
            setMode("ai");
            setHasAiSuggestions(false);
        }
    }, [searchParams]);

    const [design, setDesign] = useState<DesignState>({
        flowers: [],
        colors: [],
        wrap: "",
        imageUrl: "",
    });

    const handleSuggestions = (suggestions: { flowers: string[], colors: string[], wrap: string }) => {
        // Map AI backend names (singular lowercase) to Frontend Picker names (Plural Title Case)
        const flowerMap: Record<string, string> = {
            "rose": "Roses",
            "tulip": "Tulips",
            "lily": "Lilies",
            "peony": "Peonies",
            "orchid": "Orchids",
            "sunflower": "Sunflowers",
            "marigold": "Marigolds",
            "jasmine": "Jasmine"
        };

        const mappedFlowers = (suggestions.flowers || []).map(f => flowerMap[f.toLowerCase()] || f);

        setDesign(prev => ({
            ...prev,
            flowers: mappedFlowers,
            colors: suggestions.colors || [],
            wrap: suggestions.wrap || "",
        }));

        setHasAiSuggestions(true);
    };

    const handleModeSwitch = (newMode: "manual" | "ai") => {
        setMode(newMode);
        if (newMode === "manual") {
            setHasAiSuggestions(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-8 md:p-12">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif text-stone-800 mb-4">
                        Bouquet Builder
                    </h1>
                    <p className="text-stone-500 text-lg mb-6">
                        Craft your perfect arrangement with our AI florist
                    </p>

                    <div className="flex justify-center gap-4 text-sm">
                        <button
                            onClick={() => handleModeSwitch("manual")}
                            className={`px-4 py-2 rounded-full transition-all ${mode === "manual" ? "bg-stone-800 text-white" : "bg-white text-stone-600 border border-stone-200"}`}
                        >
                            Manual Design
                        </button>
                        <button
                            onClick={() => handleModeSwitch("ai")}
                            className={`px-4 py-2 rounded-full transition-all ${mode === "ai" ? "bg-rose-500 text-white shadow-rose-200 shadow-md" : "bg-white text-stone-600 border border-stone-200"}`}
                        >
                            ✨ AI Assistant
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7 space-y-6">
                        {mode === "ai" && !hasAiSuggestions ? (
                            <ImageUploader onSuggestions={handleSuggestions} />
                        ) : (
                            <>
                                {mode === "ai" && hasAiSuggestions && (
                                    <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center justify-between animate-fade-in mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-lg">
                                                ✨
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-rose-900">AI Suggestions Applied</h3>
                                                <p className="text-sm text-rose-700">Review and customize your bouquet below</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setHasAiSuggestions(false)}
                                            className="text-sm text-stone-500 hover:text-stone-800 underline pl-4"
                                        >
                                            Start Over
                                        </button>
                                    </div>
                                )}

                                <FlowerPicker
                                    value={design.flowers}
                                    onChange={(v) => setDesign(d => ({ ...d, flowers: v }))}
                                />
                                <ColorPicker
                                    value={design.colors}
                                    onChange={(v) => setDesign(d => ({ ...d, colors: v }))}
                                />
                                <WrapPicker
                                    value={design.wrap}
                                    onChange={(v) => setDesign(d => ({ ...d, wrap: v }))}
                                />
                            </>
                        )}
                    </div>

                    <div className="lg:col-span-5">
                        <Preview design={design} />
                    </div>
                </div>
            </div>
        </div>
    );
}
