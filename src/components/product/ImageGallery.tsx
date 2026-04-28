"use client";

import Image from "next/image";
import { useState } from "react";

interface ImageGalleryProps {
  images: string[];
  name: string;
}

export default function ImageGallery({ images, name }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-square md:aspect-[4/5] bg-arlie-light overflow-hidden">
        <Image
          src={images[activeIndex]}
          alt={`${name} - görsel ${activeIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative w-16 h-16 md:w-20 md:h-20 bg-arlie-light overflow-hidden cursor-pointer transition-all duration-300 ${
                activeIndex === index
                  ? "ring-1 ring-arlie-charcoal"
                  : "ring-1 ring-transparent hover:ring-arlie-charcoal/20"
              }`}
              aria-label={`Görsel ${index + 1}`}
            >
              <Image
                src={img}
                alt={`${name} - küçük ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
