"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import BouquetTypePicker from "./components/BouquetTypePicker";
import FlowerPicker from "./components/FlowerPicker";
import ColorPicker from "./components/ColorPicker";
import WrapPicker from "./components/WrapPicker";
import AddonsPicker from "./components/AddonsPicker";
import Preview from "./components/Preview";
import ImageUploader from "./components/ImageUploader";

export interface DesignState {
    bouquetType: string;
    flowers: string[];
    quantity: "Minimal" | "Standard" | "Luxe";
    colors: string[];
    wrap: string;
    ribbonType: string;
    ribbonColor: string;
    imageUrl: string;
    addons: {
        cardMessage: string;
        hasChocolates: boolean;
        hasBalloons: boolean;
        hasVase: boolean;
        floristNote: string;
    };
}

export default function DesignPage() {
    const searchParams = useSearchParams();
    const [mode, setMode] = useState<"manual" | "ai">("manual");
    const [hasAiSuggestions, setHasAiSuggestions] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    useEffect(() => {
        if (searchParams.get("mode") === "ai") {
            setMode("ai");
            setHasAiSuggestions(false);
        }
    }, [searchParams]);

    const [design, setDesign] = useState<DesignState>({
        bouquetType: "Hand-tied",
        flowers: [],
        quantity: "Standard",
        colors: [],
        wrap: "",
        ribbonType: "Satin",
        ribbonColor: "Pink",
        imageUrl: "",
        addons: {
            cardMessage: "",
            hasChocolates: false,
            hasBalloons: false,
            hasVase: false,
            floristNote: ""
        }
    });

    const handleSuggestions = (suggestions: any, imagePreview: string) => {
        setDesign(prev => ({
            ...prev,
            bouquetType: suggestions.bouquetType || "Hand-tied",
            flowers: suggestions.flowers || [],
            quantity: suggestions.quantity || "Standard",
            colors: suggestions.colors || [],
            wrap: suggestions.wrap || "Kraft Paper",
            ribbonType: suggestions.ribbonType || "Satin",
            ribbonColor: suggestions.ribbonColor || "Pink",
        }));

        setUploadedImage(imagePreview);
        setHasAiSuggestions(true);
    };

    const handleModeSwitch = (newMode: "manual" | "ai") => {
        setMode(newMode);
        if (newMode === "manual") {
            setHasAiSuggestions(false);
            setUploadedImage(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8">
            <div className="w-full max-w-[1920px] mx-auto">
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
                                    <div className="bg-white border border-rose-100 p-6 rounded-2xl shadow-sm animate-fade-in mb-6 flex flex-col md:flex-row gap-6">
                                        {uploadedImage && (
                                            <div className="w-full md:w-48 h-48 rounded-xl overflow-hidden border border-stone-100 shrink-0 shadow-sm relative group">
                                                <img src={uploadedImage} alt="Uploaded Inspiration" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-2xl">✨</span>
                                                <h3 className="text-xl font-serif font-medium text-rose-900">AI Suggestions Applied</h3>
                                            </div>
                                            <p className="text-stone-600 mb-4 leading-relaxed">
                                                We've analyzed your reference image and selected the best matches for fresh flowers, color palette, and style.
                                                Feel free to customize any details below to perfect your arrangement!
                                            </p>
                                            <button
                                                onClick={() => setHasAiSuggestions(false)}
                                                className="px-4 py-2 bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200 text-sm font-medium transition-colors"
                                            >
                                                Start Over with New Photo
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <BouquetTypePicker
                                    value={design.bouquetType}
                                    onChange={(v) => setDesign(d => ({ ...d, bouquetType: v }))}
                                />

                                <FlowerPicker
                                    value={design.flowers}
                                    quantity={design.quantity}
                                    onChangeFlowers={(v) => setDesign(d => ({ ...d, flowers: v }))}
                                    onChangeQuantity={(v) => setDesign(d => ({ ...d, quantity: v }))}
                                />

                                <ColorPicker
                                    value={design.colors}
                                    onChange={(v) => setDesign(d => ({ ...d, colors: v }))}
                                />

                                <WrapPicker
                                    wrap={design.wrap}
                                    ribbonType={design.ribbonType}
                                    ribbonColor={design.ribbonColor}
                                    onChangeWrap={(v) => setDesign(d => ({ ...d, wrap: v }))}
                                    onChangeRibbonType={(v) => setDesign(d => ({ ...d, ribbonType: v }))}
                                    onChangeRibbonColor={(v) => setDesign(d => ({ ...d, ribbonColor: v }))}
                                />

                                <AddonsPicker
                                    value={design.addons}
                                    onChange={(v) => setDesign(d => ({ ...d, addons: v }))}
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
