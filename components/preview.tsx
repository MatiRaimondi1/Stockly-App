"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Preview() {
    const [currentImage, setCurrentImage] = useState(0);
    const images = ["/dashboard-preview.png", "/inventory-preview.png"];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev === 0 ? 1 : 0));
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="aspect-video rounded-[2rem] bg-zinc-950 border border-zinc-800/50 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px] z-0" />

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
                        className="object-cover object-top p-1 rounded-[2rem]"
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
