---
name: nextjs-app-router
description: >
  Next.js App Router ile route, layout, metadata, loading/error states ve
  React Server Components yönetimi. Yeni sayfa oluşturma, route grupları,
  dinamik rotalar ve metadata API kullanımında tetiklenir.
---

# Next.js App Router — Arlie Proje Skill'i

## Arlie Route Yapısı

```
app/
├── layout.tsx          # Root layout: Navbar + Footer + Font yükleme
├── page.tsx            # Anasayfa: Hero + Koleksiyonlar + Marka Hikayesi
├── loading.tsx         # Global loading skeleton
├── not-found.tsx       # 404 sayfası (Arlie estetiğinde)
├── globals.css         # Tailwind direktifleri + custom stiller
│
├── shop/
│   ├── page.tsx        # Ürün listeleme + Filtre
│   └── loading.tsx     # Shop skeleton
│
├── product/
│   └── [slug]/
│       ├── page.tsx    # Ürün detay sayfası
│       └── loading.tsx # Ürün detay skeleton
│
├── cart/
│   └── page.tsx        # Sepet sayfası
│
└── about/
    └── page.tsx        # Marka hikayesi
```

## Root Layout Şablonu

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Arlie — Minimalist Takı",
    template: "%s | Arlie",
  },
  description: "Modern, zarif ve minimalist takı tasarımları. Sürdürülebilir lüks.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans bg-arlie-white text-arlie-charcoal antialiased">
        <Navbar />
        <main className="min-h-screen pt-16 md:pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

## Metadata API Kullanımı

```tsx
// Statik metadata (basit sayfalar)
export const metadata: Metadata = {
  title: "Mağaza",
  description: "Arlie takı koleksiyonunu keşfedin.",
};

// Dinamik metadata (ürün detay)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug);
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      images: [product.image],
    },
  };
}
```

## Server vs Client Bileşen Kuralları

```
Server Component (varsayılan):
✅ Veri çekme (fetch, DB)
✅ Hassas bilgi (API key, token)
✅ Layout, sayfa yapısı
✅ Metadata

Client Component ("use client"):
✅ onClick, onChange, onSubmit
✅ useState, useEffect, useRef
✅ Framer Motion animasyonları
✅ Zustand store erişimi
✅ Browser API'leri
```

## Loading State Şablonu

```tsx
// app/shop/loading.tsx
export default function ShopLoading() {
  return (
    <div className="px-6 md:px-12 lg:px-24 py-16 md:py-24">
      <div className="h-8 w-48 bg-arlie-light animate-pulse rounded mb-12" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-[3/4] bg-arlie-light animate-pulse rounded" />
            <div className="h-4 w-3/4 bg-arlie-light animate-pulse rounded" />
            <div className="h-4 w-1/2 bg-arlie-light animate-pulse rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Kurallar

- Route dosyaları SADECE `app/` dizininde
- Her route grubunda `loading.tsx` oluştur
- Metadata her sayfada zorunlu
- `"use client"` sadece interaktif bileşenlerde
- Font yükleme yalnızca root layout'ta (`next/font`)
