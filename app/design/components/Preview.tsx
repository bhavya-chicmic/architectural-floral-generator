"use client";
import { useState } from "react";

interface PreviewProps {
    design: {
        bouquetType: string;
        flowers: string[];
        quantity: string;
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
    };
}

export default function Preview({ design }: PreviewProps) {
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<string | null>(null);

    const generate = async () => {
        if (design.flowers.length === 0) return;
        setLoading(true);
        try {
            const res = await fetch("/api/generate-image", {
                method: "POST",
                body: JSON.stringify({
                    bouquetType: design.bouquetType,
                    flowers: design.flowers,
                    quantity: design.quantity,
                    colors: design.colors,
                    wrap: design.wrap || "No wrapping",
                    ribbonType: design.ribbonType,
                    ribbonColor: design.ribbonColor,
                }),
            });

            const data = await res.json();
            if (data.image) {
                setImage(data.image);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const hasSelections = design.flowers.length > 0;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col h-full sticky top-8">
            <h2 className="font-serif text-xl font-medium mb-4 text-stone-800 flex items-center gap-2">
                <span className="text-2xl">✨</span> Your Bouquet
            </h2>

            <div className="flex-1 min-h-[300px] bg-stone-50 rounded-xl border border-dashed border-stone-200 flex flex-col items-center justify-center p-4 overflow-hidden relative">
                {image ? (
                    <img src={image} alt="Bouquet Preview" className="w-full h-full object-cover rounded-lg shadow-md animate-fade-in" />
                ) : (
                    <div className="text-center text-stone-400">
                        <div className="text-4xl mb-2 opacity-20">💐</div>
                        <p className="text-sm">Select flowers to see a preview</p>
                    </div>
                )}

                {loading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 transition-all">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
                            <p className="text-sm font-medium text-rose-600 animate-pulse">Arranging flowers...</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-6 space-y-4">
                {hasSelections ? (
                    <div className="text-sm text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-100 space-y-1">
                        <p><strong className="text-stone-800">Style:</strong> {design.bouquetType} ({design.quantity})</p>
                        <p><strong className="text-stone-800">Flowers:</strong> {design.flowers.join(", ")}</p>
                        {design.colors.length > 0 && <p><strong className="text-stone-800">Colors:</strong> {design.colors.join(", ")}</p>}
                        {design.wrap && <p><strong className="text-stone-800">Wrap:</strong> {design.wrap} w/ {design.ribbonColor} {design.ribbonType}</p>}
                        {(design.addons.hasChocolates || design.addons.hasBalloons) && (
                            <p><strong className="text-stone-800">Add-ons:</strong> {[
                                design.addons.hasChocolates && "Chocolates",
                                design.addons.hasBalloons && "Balloons"
                            ].filter(Boolean).join(", ")}</p>
                        )}
                    </div>
                ) : (
                    <div className="text-sm text-stone-400 italic text-center p-2">
                        Start adding items to build your bouquet
                    </div>
                )}

                <button
                    onClick={generate}
                    disabled={!hasSelections || loading}
                    className={`
            w-full py-4 rounded-xl font-semibold text-lg shadow-sm transition-all
            ${!hasSelections || loading
                            ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                            : "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200 hover:shadow-lg active:scale-[0.98]"
                        }
          `}
                >
                    {loading ? "Generating..." : "Generate Preview"}
                </button>
            </div>
        </div>
    );
}
