import { useState, useMemo } from "react";

interface ColorPickerProps {
    value: string[];
    onChange: (value: string[]) => void;
}

const THEMES = [
    { id: "Classic Red", colors: ["#D32F2F", "#B71C1C", "#FFEBEE"], desc: "Romantic & Timeless" },
    { id: "Pastel", colors: ["#F8BBD0", "#E1BEE7", "#B2DFDB"], desc: "Soft & Dreamy" },
    { id: "White & Green", colors: ["#FFFFFF", "#F1F8E9", "#A5D6A7"], desc: "Elegant & Fresh" },
    { id: "Bright & Vibrant", colors: ["#FFEB3B", "#FF9800", "#FF4081"], desc: "Joyful & Energetic" },
];

const CUSTOM_COLORS = [
    "#F44336", "#E91E63", "#9C27B0", "#673AB7",
    "#3F51B5", "#2196F3", "#00BCD4", "#009688",
    "#4CAF50", "#8BC34A", "#FFC107", "#FF9800"
];

const AI_TIPS: Record<string, string> = {
    "Classic Red": "Perfect for anniversaries and declarations of love.",
    "Pastel": "Ideal for baby showers, Mother's Day, or get-well-soon.",
    "White & Green": "Great for weddings, sympathy, or minimalist decor.",
    "Bright & Vibrant": "Best for birthdays and celebrations!",
    "Custom": "Express your unique style."
};

export default function ColorPicker({ value = [], onChange }: ColorPickerProps) {
    const [mode, setMode] = useState<"theme" | "custom">("theme");

    // Determine current theme selection or if it's custom
    const currentTheme = THEMES.find(t => t.id === value[0])?.id || "Custom";

    const handleThemeSelect = (themeId: string) => {
        onChange([themeId]);
    };

    const toggleCustomColor = (color: string) => {
        if (value.includes(color)) {
            onChange(value.filter(c => c !== color));
        } else {
            // Logic for single select strictly now
            onChange([color]);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 animate-fade-in-up">
            <div className="flex items-center justify-between mb-2">
                <h2 className="font-serif text-2xl font-medium text-stone-800 flex items-center gap-2">
                    <span>🎨</span> Select Color Theme
                </h2>
                {value.length > 0 && (
                    <button
                        onClick={() => onChange([])}
                        className="text-xs text-rose-500 hover:text-rose-700 underline font-medium"
                    >
                        Clear Selection
                    </button>
                )}
            </div>
            <p className="text-stone-500 mb-6 text-sm">Step 3 of 5</p>

            <div className="flex gap-4 border-b border-stone-100 mb-6">
                <button
                    onClick={() => setMode("theme")}
                    className={`pb-2 text-sm font-medium transition-all ${mode === "theme" ? "text-stone-800 border-b-2 border-stone-800" : "text-stone-400 hover:text-stone-600"}`}
                >
                    Curated Themes
                </button>
                <button
                    onClick={() => setMode("custom")}
                    className={`pb-2 text-sm font-medium transition-all ${mode === "custom" ? "text-stone-800 border-b-2 border-stone-800" : "text-stone-400 hover:text-stone-600"}`}
                >
                    Custom Palette
                </button>
            </div>

            {mode === "theme" && (
                <div className="space-y-3">
                    {THEMES.map((theme) => (
                        <button
                            key={theme.id}
                            onClick={() => handleThemeSelect(theme.id)}
                            className={`
                                w-full flex items-center justify-between p-4 rounded-xl border transition-all
                                ${value.includes(theme.id)
                                    ? "border-rose-500 bg-rose-50 ring-1 ring-rose-200"
                                    : "border-stone-200 hover:border-rose-200 hover:bg-stone-50"
                                }
                            `}
                        >
                            <div className="text-left">
                                <span className={`font-medium block ${value.includes(theme.id) ? "text-rose-900" : "text-stone-800"}`}>
                                    {theme.id}
                                </span>
                                <span className="text-xs text-stone-500">{theme.desc}</span>
                            </div>
                            <div className="flex -space-x-2">
                                {theme.colors.map(c => (
                                    <div key={c} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c }} />
                                ))}
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {mode === "custom" && (
                <div className="grid grid-cols-6 gap-3">
                    {CUSTOM_COLORS.map(c => {
                        const isSelected = value.includes(c);
                        return (
                            <button
                                key={c}
                                onClick={() => toggleCustomColor(c)}
                                className={`
                                    w-10 h-10 rounded-full border-2 hover:scale-110 transition-transform
                                    ${isSelected ? "ring-2 ring-stone-800 ring-offset-2 border-white" : "border-transparent"}
                                `}
                                style={{ backgroundColor: c }}
                            />
                        )
                    })}
                </div>
            )}

            {/* AI Tip using the active value to guess context */}
            {(currentTheme || mode === "custom") && (
                <div className="mt-6 flex items-start gap-3 bg-indigo-50 p-4 rounded-lg text-sm text-indigo-800 animate-fade-in">
                    <span className="text-xl">🤖</span>
                    <div>
                        <p className="font-bold mb-1">AI Tip:</p>
                        <p>{AI_TIPS[currentTheme] || (mode === "custom" ? AI_TIPS["Custom"] : "")}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
