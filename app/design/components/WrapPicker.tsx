import { useState } from "react";

interface WrapPickerProps {
    wrap: string;
    ribbonType: string;
    ribbonColor: string;
    onChangeWrap: (v: string) => void;
    onChangeRibbonType: (v: string) => void;
    onChangeRibbonColor: (v: string) => void;
}

const WRAPS = [
    { id: "Kraft Paper", emoji: "🟫" },
    { id: "Premium Matte", emoji: "📄" },
    { id: "Transparent", emoji: "🧊" },
    { id: "Fabric", emoji: "🧶" },
    { id: "Luxury Box", emoji: "🎁" },
];

const RIBBONS = ["Satin", "Jute", "Silk"];
const RIBBON_COLORS = ["Red", "Pink", "Gold", "Black", "White", "Sage"];

export default function WrapPicker({
    wrap,
    ribbonType,
    ribbonColor,
    onChangeWrap,
    onChangeRibbonType,
    onChangeRibbonColor
}: WrapPickerProps) {

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 animate-fade-in-up">
            <h2 className="font-serif text-2xl font-medium mb-2 text-stone-800 flex items-center gap-2">
                <span>🎀</span> Select Wrapping
            </h2>
            <p className="text-stone-500 mb-6 text-sm">Step 4 of 5</p>

            {/* Wrap Material */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-stone-700 mb-3">Wrapping Material</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {WRAPS.map((w) => (
                        <button
                            key={w.id}
                            onClick={() => onChangeWrap(w.id)}
                            className={`
                                flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all
                                ${wrap === w.id
                                    ? "border-rose-500 bg-rose-50 text-rose-900"
                                    : "border-stone-200 hover:border-rose-200 text-stone-600"
                                }
                            `}
                        >
                            <span className="text-xl mb-1">{w.emoji}</span>
                            <span className="text-sm font-medium">{w.id}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Ribbon Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-stone-50 p-4 rounded-xl border border-stone-100">
                <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-3">Ribbon Type</label>
                    <div className="flex flex-wrap gap-2">
                        {RIBBONS.map(r => (
                            <button
                                key={r}
                                onClick={() => onChangeRibbonType(r)}
                                className={`
                               px-3 py-1.5 rounded-lg text-sm border transition-all
                               ${ribbonType === r
                                        ? "bg-white border-rose-400 text-rose-700 shadow-sm"
                                        : "bg-transparent border-stone-300 text-stone-500 hover:bg-white"
                                    }
                             `}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-3">Ribbon Color</label>
                    <div className="flex flex-wrap gap-2">
                        {RIBBON_COLORS.map(c => (
                            <button
                                key={c}
                                onClick={() => onChangeRibbonColor(c)}
                                className={`
                                    w-8 h-8 rounded-full border-2 transition-transform hover:scale-105 tooltip
                                    ${ribbonColor === c ? "ring-2 ring-stone-400 ring-offset-1 border-white" : "border-stone-200"}
                                `}
                                style={{ backgroundColor: c.toLowerCase() === 'sage' ? '#9CA3AF' : c.toLowerCase() }} // simplify sage hex
                                title={c}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
