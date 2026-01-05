"use client";

import { useState, useRef } from "react";

interface MultiImageUploaderProps {
    onImagesUploaded: (basketImage: string, flowerImages: string[]) => void;
}

export default function MultiImageUploader({ onImagesUploaded }: MultiImageUploaderProps) {
    const [basketImage, setBasketImage] = useState<string | null>(null);
    const [flowerImages, setFlowerImages] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const basketInputRef = useRef<HTMLInputElement>(null);
    const flowersInputRef = useRef<HTMLInputElement>(null);

    const handleBasketUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please upload a valid image file.");
            return;
        }

        setError(null);

        const reader = new FileReader();
        reader.onloadend = () => {
            const newBasketImage = reader.result as string;
            setBasketImage(newBasketImage);
            // Notify parent component with updated images
            onImagesUploaded(newBasketImage, flowerImages);
        };
        reader.readAsDataURL(file);
    };

    const handleFlowersUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newFlowerImages: string[] = [];
        let filesProcessed = 0;

        Array.from(files).forEach((file) => {
            if (!file.type.startsWith("image/")) {
                setError("Please upload valid image files only.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                newFlowerImages.push(reader.result as string);
                filesProcessed++;

                if (filesProcessed === files.length) {
                    setFlowerImages(prev => {
                        const updatedFlowers = [...prev, ...newFlowerImages];
                        // Notify parent component with updated images
                        if (basketImage) {
                            onImagesUploaded(basketImage, updatedFlowers);
                        }
                        return updatedFlowers;
                    });
                    setError(null);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeFlowerImage = (index: number) => {
        setFlowerImages(prev => {
            const updatedFlowers = prev.filter((_, i) => i !== index);
            // Notify parent component with updated images
            if (basketImage) {
                onImagesUploaded(basketImage, updatedFlowers);
            }
            return updatedFlowers;
        });
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 mb-8 animate-fade-in-up">
            <h2 className="text-2xl font-serif text-stone-800 mb-2">
                🎨 Custom Bouquet Creator
            </h2>
            <p className="text-stone-500 mb-6">
                Upload your basket and flower images to create a custom bouquet design
            </p>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                    {error}
                </div>
            )}

            {/* Basket Upload */}
            <div className="mb-6">
                <h3 className="text-lg font-medium text-stone-700 mb-3 flex items-center gap-2">
                    <span>🧺</span>
                    <span>Basket Image (Required)</span>
                </h3>

                {basketImage ? (
                    <div className="relative group">
                        <img
                            src={basketImage}
                            alt="Basket"
                            className="w-full h-80 object-contain rounded-xl border-2 border-stone-200 bg-stone-50"
                        />
                        <button
                            onClick={() => setBasketImage(null)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <div
                        onClick={() => basketInputRef.current?.click()}
                        className="border-2 border-dashed border-stone-300 hover:border-stone-400 rounded-xl p-8 text-center cursor-pointer transition-all group hover:bg-stone-50"
                    >
                        <input
                            type="file"
                            ref={basketInputRef}
                            onChange={handleBasketUpload}
                            accept="image/*"
                            className="hidden"
                        />
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🧺</div>
                        <p className="font-semibold text-stone-700">Upload Basket Image</p>
                        <p className="text-sm text-stone-400">Click to select</p>
                    </div>
                )}
            </div>

            {/* Flowers Upload */}
            <div className="mb-6">
                <h3 className="text-lg font-medium text-stone-700 mb-3 flex items-center gap-2">
                    <span>🌸</span>
                    Flower Images (Multiple)
                </h3>

                <div
                    onClick={() => flowersInputRef.current?.click()}
                    className="border-2 border-dashed border-rose-200 hover:border-rose-400 rounded-xl p-6 text-center cursor-pointer transition-all group hover:bg-rose-50 mb-4"
                >
                    <input
                        type="file"
                        ref={flowersInputRef}
                        onChange={handleFlowersUpload}
                        accept="image/*"
                        multiple
                        className="hidden"
                    />
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🌸</div>
                    <p className="font-semibold text-stone-700">Add Flower Images</p>
                    <p className="text-sm text-stone-400">Click to select multiple images</p>
                </div>

                {flowerImages.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                        {flowerImages.map((img, idx) => (
                            <div key={idx} className="relative group">
                                <img
                                    src={img}
                                    alt={`Flower ${idx + 1}`}
                                    className="w-full h-64 object-contain rounded-lg border-2 border-stone-200 bg-stone-50"
                                />
                                <button
                                    onClick={() => removeFlowerImage(idx)}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
