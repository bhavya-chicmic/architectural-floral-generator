interface WrapPickerProps {
    value: string;
    onChange: (wrap: string) => void;
}

const wrapStyles: Record<string, string> = {
    Kraft: "bg-[#D2B48C]",
    Matte: "bg-slate-200",
    Transparent: "bg-gradient-to-tr from-transparent via-blue-50 to-transparent border-dashed",
    "Luxury Box": "bg-stone-800",
};

export default function WrapPicker({ value, onChange }: WrapPickerProps) {
    const wraps = ["Kraft", "Matte", "Transparent", "Luxury Box"];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <h2 className="font-serif text-xl font-medium mb-4 text-stone-800 flex items-center gap-2">
                <span className="text-2xl">🎀</span> Wrapping Style
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {wraps.map((w) => {
                    const isSelected = value === w;
                    return (
                        <button
                            key={w}
                            onClick={() => onChange(w)}
                            className={`
                group relative flex flex-col items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200
                ${isSelected
                                    ? "border-rose-500 bg-rose-50"
                                    : "border-stone-200 hover:border-rose-200 hover:bg-stone-50"
                                }
              `}
                        >
                            <div
                                className={`
                  w-full h-12 rounded-lg shadow-sm border border-black/5 
                  ${wrapStyles[w]}
                  group-hover:scale-105 transition-transform duration-300
                `}
                            />
                            <span className={`text-sm font-medium ${isSelected ? "text-rose-700" : "text-stone-600"}`}>
                                {w}
                            </span>

                            {isSelected && (
                                <div className="absolute top-2 right-2 text-rose-500 bg-white rounded-full p-0.5 shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
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
