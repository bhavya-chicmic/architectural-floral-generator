import { useState } from "react";

interface AddonsState {
    cardMessage: string;
    hasChocolates: boolean;
    hasBalloons: boolean;
    hasVase: boolean;
    floristNote: string;
}

interface AddonsPickerProps {
    value: AddonsState;
    onChange: (v: AddonsState) => void;
}

export default function AddonsPicker({ value, onChange }: AddonsPickerProps) {

    const toggle = (key: keyof AddonsState) => {
        onChange({ ...value, [key]: !value[key] });
    };

    const updateText = (key: keyof AddonsState, text: string) => {
        onChange({ ...value, [key]: text });
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 animate-fade-in-up">
            <h2 className="font-serif text-2xl font-medium mb-2 text-stone-800 flex items-center gap-2">
                <span>✨</span> Make It Special
            </h2>
            <p className="text-stone-500 mb-6 text-sm">Step 5 of 5</p>

            <div className="space-y-6">
                {/* Visual Add-ons Toggle */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                        onClick={() => toggle("hasChocolates")}
                        className={`flex items-center p-3 rounded-xl border transition-all ${value.hasChocolates ? "bg-amber-50 border-amber-300 text-amber-900" : "border-stone-200 text-stone-600 hover:bg-stone-50"}`}
                    >
                        <span className="text-2xl mr-3">🍫</span>
                        <div className="text-left">
                            <span className="block font-medium">Chocolates</span>
                            <span className="text-xs opacity-70">Premium Truffles</span>
                        </div>
                        {value.hasChocolates && <span className="ml-auto text-amber-600">✓</span>}
                    </button>

                    <button
                        onClick={() => toggle("hasBalloons")}
                        className={`flex items-center p-3 rounded-xl border transition-all ${value.hasBalloons ? "bg-rose-50 border-rose-300 text-rose-900" : "border-stone-200 text-stone-600 hover:bg-stone-50"}`}
                    >
                        <span className="text-2xl mr-3">🎈</span>
                        <div className="text-left">
                            <span className="block font-medium">Balloons</span>
                            <span className="text-xs opacity-70">Celebration Pack</span>
                        </div>
                        {value.hasBalloons && <span className="ml-auto text-rose-600">✓</span>}
                    </button>

                    <button
                        onClick={() => toggle("hasVase")}
                        className={`flex items-center p-3 rounded-xl border transition-all ${value.hasVase ? "bg-blue-50 border-blue-300 text-blue-900" : "border-stone-200 text-stone-600 hover:bg-stone-50"}`}
                    >
                        <span className="text-2xl mr-3">🏺</span>
                        <div className="text-left">
                            <span className="block font-medium">Glass Vase</span>
                            <span className="text-xs opacity-70">Added to order</span>
                        </div>
                        {value.hasVase && <span className="ml-auto text-blue-600">✓</span>}
                    </button>
                </div>

                {/* Greeting Card Message */}
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                    <label className="block text-sm font-semibold text-stone-700 mb-2">💌 Greeting Card Message</label>
                    <textarea
                        value={value.cardMessage}
                        onChange={(e) => updateText("cardMessage", e.target.value)}
                        placeholder="Type your personal message here..."
                        className="w-full text-base p-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none"
                        rows={3}
                    />
                </div>

                {/* Note for Florist */}
                <div>
                    <label className="block text-xs uppercase tracking-wide text-stone-400 font-bold mb-2">Note for Florist (Optional)</label>
                    <input
                        type="text"
                        value={value.floristNote}
                        onChange={(e) => updateText("floristNote", e.target.value)}
                        placeholder="e.g. Please avoid filler greenery"
                        className="w-full text-sm p-3 rounded-lg bg-stone-50 border-none focus:ring-1 focus:ring-stone-300"
                    />
                </div>
            </div>
        </div>
    );
}
