"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils"; // Assuming cn utility exists, otherwise I'll use template literals

export default function BlurImage({ className, src, alt, ...props }: ImageProps) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className={cn("relative overflow-hidden h-full w-full", className)}>
            <Image
                className={cn(
                    "duration-700 ease-in-out",
                    isLoading
                        ? "scale-110 blur-xl grayscale"
                        : "scale-100 blur-0 grayscale-0",
                    className
                )}
                src={src}
                alt={alt}
                onLoad={(event) => {
        const img = event.target as HTMLImageElement;
        if (img.src.indexOf("data:image/gif;base64") < 0) {
          setIsLoading(false);
        }
      }}
                {...props}
            />
        </div>
    );
}
