interface ColorPickerProps {
    value: string[];
    onChange: (colors: string[]) => void;
}

const colorMap: Record<string, string> = {
    Red: "bg-red-500",
    Pastel: "bg-pink-200",
    "White & Green": "bg-green-100",
    Vibrant: "bg-orange-400",
};

export default function ColorPicker({ value = [], onChange }: ColorPickerProps) {
    const colors = ["Red", "Pastel", "White & Green", "Vibrant"];

    const toggleColor = (c: string) => {
        if (value.includes(c)) {
            onChange(value.filter((item) => item !== c));
        } else {
            onChange([...value, c]);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <h2 className="font-serif text-xl font-medium mb-4 text-stone-800 flex items-center gap-2">
                <span className="text-2xl">🎨</span> Color Theme
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {colors.map((c) => {
                    const isSelected = value.includes(c);
                    return (
                        <button
                            key={c}
                            onClick={() => toggleColor(c)}
                            className={`
                relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200
                ${isSelected
                                    ? "border-rose-500 bg-rose-50 ring-2 ring-rose-200 ring-offset-1"
                                    : "border-stone-200 hover:border-rose-200 hover:bg-stone-50"
                                }
              `}
                        >
                            <div className={`w-8 h-8 rounded-full shadow-inner ${colorMap[c] || "bg-gray-200"}`} />
                            <span className={`text-sm font-medium ${isSelected ? "text-rose-700" : "text-stone-600"}`}>
                                {c}
                            </span>
                            {isSelected && (
                                <div className="absolute top-2 right-2 text-rose-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
