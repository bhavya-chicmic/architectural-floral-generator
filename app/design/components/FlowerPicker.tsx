import { useState } from "react";

interface FlowerPickerProps {
    value: string[];
    quantity: "Minimal" | "Standard" | "Luxe";
    onChangeFlowers: (value: string[]) => void;
    onChangeQuantity: (value: "Minimal" | "Standard" | "Luxe") => void;
}

const CATEGORIES = {
    "Roses": ["Red Rose", "White Rose", "Pink Rose", "Garden Rose"],
    "Lilies": ["White Lily", "Pink Lily", "Oriental Lily"],
    "Tulips": ["Red Tulip", "Yellow Tulip", "Pink Tulip"],
    "Orchids": ["White Orchid", "Purple Orchid"],
    "Peonies": ["Pink Peony", "White Peony", "Coral Peony"],
    "Seasonal": ["Sunflowers", "Daisies", "Hydrangeas", "Carnations"]
};

const QUANTITIES = [
    { id: "Minimal", emoji: "🌿", label: "Minimal" },
    { id: "Standard", emoji: "💐", label: "Standard" },
    { id: "Luxe", emoji: "✨", label: "Luxe" }
];

export default function FlowerPicker({ value = [], quantity, onChangeFlowers, onChangeQuantity }: FlowerPickerProps) {
    const [activeTab, setActiveTab] = useState("Roses");

    const toggleFlower = (flower: string) => {
        if (value.includes(flower)) {
            onChangeFlowers(value.filter(f => f !== flower));
        } else {
            onChangeFlowers([...value, flower]);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 animate-fade-in-up">
            <div className="flex items-center justify-between mb-2">
                <h2 className="font-serif text-2xl font-medium text-stone-800 flex items-center gap-2">
                    <span>🌷</span> Choose Your Flower
                </h2>
                {value.length > 0 && (
                    <button
                        onClick={() => onChangeFlowers([])}
                        className="text-xs text-rose-500 hover:text-rose-700 underline font-medium"
                    >
                        Clear Selection
                    </button>
                )}
            </div>
            <p className="text-stone-500 mb-6 text-sm">Step 2 of 5</p>

            {/* Quantity Selector */}
            <div className="mb-8 bg-stone-50 p-4 rounded-xl">
                <p className="text-sm font-semibold text-stone-700 mb-3">Bouquet Size</p>
                <div className="flex gap-2">
                    {QUANTITIES.map((q) => (
                        <button
                            key={q.id}
                            onClick={() => onChangeQuantity(q.id as any)}
                            className={`
                                flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2
                                ${quantity === q.id
                                    ? "bg-white text-rose-600 shadow-sm border border-rose-200"
                                    : "text-stone-500 hover:bg-white hover:text-stone-700"
                                }
                            `}
                        >
                            <span>{q.emoji}</span> {q.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto gap-2 mb-4 pb-2 scrollbar-none">
                {Object.keys(CATEGORIES).map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`
                            px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors
                            ${activeTab === cat
                                ? "bg-stone-800 text-white"
                                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                            }
                        `}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Flowers Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto p-1">
                {(CATEGORIES as any)[activeTab].map((flower: string) => {
                    const isSelected = value.includes(flower);
                    return (
                        <button
                            key={flower}
                            onClick={() => toggleFlower(flower)}
                            className={`
                                flex items-center gap-3 p-3 rounded-xl border text-left transition-all
                                ${isSelected
                                    ? "border-rose-500 bg-rose-50 ring-1 ring-rose-200"
                                    : "border-stone-200 hover:border-rose-200 hover:bg-stone-50"
                                }
                            `}
                        >
                            <div className={`
                                w-5 h-5 rounded-full border flex items-center justify-center
                                ${isSelected ? "bg-rose-500 border-rose-500" : "border-stone-300 bg-white"}
                            `}>
                                {isSelected && <span className="text-white text-xs">✓</span>}
                            </div>
                            <span className={`text-sm ${isSelected ? "text-rose-900 font-medium" : "text-stone-700"}`}>
                                {flower}
                            </span>
                        </button>
                    );
                })}
            </div>

            <p className="text-xs text-stone-400 mt-4 text-center">
                Mix and match flowers from any category! 🌸
            </p>
        </div>
    );
}
