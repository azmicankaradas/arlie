---
name: product-catalog
description: >
  Arlie takı ürün katalogu yönetimi. Ürün kartları, ürün grid,
  kategori filtreleri (Yüzük, Küpe, Kolye, Bileklik), görsel galeri,
  ürün detay sayfası ve sticky sepete ekle butonu pattern'leri.
  Ürün listeleme veya detay sayfası çalışmalarında tetiklenir.
---

# Product Catalog — Arlie Proje Skill'i

## Ürün Veri Modeli

```typescript
// types/product.ts

export type Category = "rings" | "earrings" | "necklaces" | "bracelets";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  story: string;              // Ürün hikayesi
  price: number;
  currency: "TRY";
  category: Category;
  materials: string[];        // ["925 Ayar Gümüş", "18K Altın Kaplama"]
  sustainability: string;     // Sürdürülebilirlik bilgisi
  images: string[];           // Minimum 2 görsel (hover için)
  inStock: boolean;
  variants?: ProductVariant[];
  featured: boolean;
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;               // "Altın", "Gümüş"
  price?: number;             // Farklı fiyat varsa
  image?: string;
}

export const CATEGORIES: Record<Category, string> = {
  rings: "Yüzük",
  earrings: "Küpe",
  necklaces: "Kolye",
  bracelets: "Bileklik",
};
```

## Ürün Kartı Bileşeni

```tsx
// components/shop/ProductCard.tsx
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
      transition={{ duration: 0.5 }}
    >
      <Link href={`/product/${product.slug}`} className="group block">
        {/* Görsel alanı — hover'da ikinci görsel */}
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

        {/* Ürün bilgisi */}
        <div className="space-y-1">
          <h3 className="font-sans text-sm tracking-wide">{product.name}</h3>
          <p className="font-sans text-sm text-arlie-charcoal/60">
            {product.price.toLocaleString("tr-TR")} ₺
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
```

## Kategori Filtre

```tsx
// components/shop/CategoryFilter.tsx
"use client";
import { CATEGORIES, type Category } from "@/types/product";

interface CategoryFilterProps {
  active: Category | "all";
  onChange: (category: Category | "all") => void;
}

export default function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-6 md:gap-8 overflow-x-auto pb-4">
      <button
        onClick={() => onChange("all")}
        className={`font-sans text-xs uppercase tracking-luxury whitespace-nowrap transition-colors
          ${active === "all" ? "text-arlie-charcoal" : "text-arlie-charcoal/40 hover:text-arlie-charcoal/70"}`}
      >
        Tümü
      </button>
      {(Object.entries(CATEGORIES) as [Category, string][]).map(([key, label]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`font-sans text-xs uppercase tracking-luxury whitespace-nowrap transition-colors
            ${active === key ? "text-arlie-charcoal" : "text-arlie-charcoal/40 hover:text-arlie-charcoal/70"}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
```

## Sticky Sepete Ekle

```tsx
// Mobilde ekranın altına sabitlenir
<div className="fixed bottom-0 left-0 right-0 z-40 bg-arlie-white border-t border-arlie-light p-4 md:static md:border-0 md:p-0">
  <button className="w-full py-3.5 bg-arlie-charcoal text-arlie-white font-sans text-xs uppercase tracking-luxury hover:bg-arlie-charcoal/90 transition-colors">
    Sepete Ekle — {price.toLocaleString("tr-TR")} ₺
  </button>
</div>
```

## Kurallar

- Fiyat formatı: `toLocaleString("tr-TR")` + " ₺"
- Ürün kartında minimum 2 görsel (hover efekti için)
- Kategori isimleri Türkçe, slug'lar İngilizce
- Görsel aspect-ratio: `3:4` (ürün kartı), `1:1` veya `4:5` (detay)
