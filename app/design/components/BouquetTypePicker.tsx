import { useState } from "react";

interface BouquetTypePickerProps {
    value: string;
    onChange: (value: string) => void;
}

const TYPES = [
    { id: "Hand-tied", emoji: "💐", label: "Hand-tied Bouquet", desc: "Classic & natural" },
    { id: "Round", emoji: "🟠", label: "Round Bouquet", desc: "Formal & symmetrical" },
    { id: "Cascading", emoji: "🌿", label: "Cascading Bouquet", desc: "Elegant & dramatic" },
    { id: "Box", emoji: "🎁", label: "Box Arrangement", desc: "Luxury gift box" },
    { id: "Basket", emoji: "🧺", label: "Basket Arrangement", desc: "Rustic & charming" },
    { id: "Vase", emoji: "🏺", label: "Vase Arrangement", desc: "Ready for display" },
];

export default function BouquetTypePicker({ value, onChange }: BouquetTypePickerProps) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 animate-fade-in-up">
            <h2 className="font-serif text-2xl font-medium mb-2 text-stone-800 flex items-center gap-2">
                <span>💐</span> Choose Your Bouquet Style
            </h2>
            <p className="text-stone-500 mb-6 text-sm">Step 1 of 5</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {TYPES.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => onChange(type.id)}
                        className={`
              flex flex-col items-center p-4 rounded-xl border-2 transition-all text-center
              ${value === type.id
                                ? "border-rose-500 bg-rose-50 shadow-md scale-105"
                                : "border-stone-100 hover:border-rose-200 hover:bg-stone-50"
                            }
            `}
                    >
                        <span className="text-4xl mb-3 filter drop-shadow-sm">{type.emoji}</span>
                        <span className="font-semibold text-stone-800">{type.label}</span>
                        <span className="text-xs text-stone-400 mt-1">{type.desc}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
