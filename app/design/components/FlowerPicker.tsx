interface FlowerPickerProps {
    value: string[];
    onChange: (value: string[]) => void;
}

export default function FlowerPicker({ value = [], onChange }: FlowerPickerProps) {
    const flowers = ["Roses", "Tulips", "Lilies", "Peonies", "Orchids"];

    const getCount = (flower: string) => value.filter((f) => f === flower).length;

    const addFlower = (flower: string) => {
        onChange([...value, flower]);
    };

    const removeFlower = (flower: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const index = value.lastIndexOf(flower);
        if (index > -1) {
            const newValue = [...value];
            newValue.splice(index, 1);
            onChange(newValue);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <h2 className="font-serif text-xl font-medium mb-4 text-stone-800 flex items-center gap-2">
                <span className="text-2xl">🌷</span> Choose Flowers
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {flowers.map((f) => {
                    const count = getCount(f);
                    return (
                        <button
                            key={f}
                            onClick={() => addFlower(f)}
                            className={`
                relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200
                ${count > 0
                                    ? "border-rose-500 bg-rose-50 ring-2 ring-rose-200 ring-offset-1"
                                    : "border-stone-200 hover:border-rose-200 hover:bg-stone-50"
                                }
              `}
                        >
                            <div className="w-10 h-10 flex items-center justify-center text-2xl bg-white rounded-full shadow-sm mb-2">
                                {f === "Roses" && "🌹"}
                                {f === "Tulips" && "🌷"}
                                {f === "Lilies" && "⚜️"}
                                {f === "Peonies" && "🌸"}
                                {f === "Orchids" && "🌺"}
                            </div>
                            <span className={`text-sm font-medium ${count > 0 ? "text-rose-700" : "text-stone-600"}`}>
                                {f}
                            </span>

                            {count > 0 && (
                                <div className="flex items-center gap-1 mt-2">
                                    <div
                                        className=" absolute top-2 right-2 bg-rose-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-sm"
                                    >
                                        {count}
                                    </div>
                                    <span
                                        onClick={(e) => removeFlower(f, e)}
                                        className="text-xs text-rose-400 hover:text-rose-600 underline decoration-rose-200"
                                    >
                                        remove
                                    </span>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
            <p className="text-xs text-stone-400 mt-4 text-center">
                Click to add multiple stems.
            </p>
        </div>
    );
}
