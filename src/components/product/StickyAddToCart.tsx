"use client";

import { useCartStore } from "@/store/useCartStore";
import type { Product } from "@/types/product";

interface StickyAddToCartProps {
  product: Product;
}

export default function StickyAddToCart({ product }: StickyAddToCartProps) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = () => {
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0],
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-arlie-white/95 backdrop-blur-sm border-t border-arlie-light p-4 md:static md:border-0 md:p-0 md:bg-transparent md:backdrop-blur-none md:mt-8">
      <button
        onClick={handleAdd}
        className="w-full py-3.5 bg-arlie-charcoal text-arlie-white font-sans text-xs uppercase tracking-[0.15em] font-medium hover:bg-arlie-charcoal/90 transition-colors duration-300 cursor-pointer"
      >
        Sepete Ekle — {product.price.toLocaleString("tr-TR")} ₺
      </button>
    </div>
  );
}
