"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

/**
 * Preview component
 * @returns 
 */
export default function Preview() {
    /**
     * State for managing the current image index
     */
    const [currentImage, setCurrentImage] = useState(0);
    const images = ["/dashboard-preview.png", "/inventory-preview.png"];

    /**
     * Effect for automatically cycling through images
     */
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev === 0 ? 1 : 0));
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="aspect-video rounded-4xl bg-zinc-950 border border-zinc-800/50 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[40px_40px] z-0" />

            {images.map((src, index) => (
                <div
                    key={src}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentImage === index ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >
                    <Image
                        src={src}
                        alt={`Preview ${index}`}
                        fill
                        className="object-cover object-top p-1 rounded-4xl"
                        priority
                    />
                </div>
            ))}

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                {images.map((_, index) => (
                    <div
                        key={index}
                        className={`h-1 transition-all duration-500 rounded-full ${currentImage === index ? "w-8 bg-purple-500" : "w-2 bg-zinc-700"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}