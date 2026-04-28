"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [img1, img2] = product.images;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link href={`/product/${product.slug}`} className="group block cursor-pointer">
        {/* Image area with hover second image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-arlie-light mb-4">
          <Image
            src={img1}
            alt={product.name}
            fill
            className="object-cover transition-opacity duration-500 group-hover:opacity-0"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {img2 && (
            <Image
              src={img2}
              alt={`${product.name} - alternatif`}
              fill
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          )}
        </div>

        {/* Product info */}
        <div className="space-y-1">
          <h3 className="font-sans text-sm tracking-wide group-hover:text-arlie-gold transition-colors duration-300">
            {product.name}
          </h3>
          <p className="font-sans text-sm text-arlie-charcoal/50 tabular-nums">
            {product.price.toLocaleString("tr-TR")} ₺
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
