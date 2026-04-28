---
name: tailwind-luxury-styling
description: >
  Arlie projesine özel Tailwind CSS styling kuralları.
  Lüks minimalist renk paleti, whitespace yönetimi, tipografi sistemi
  ve custom Tailwind config ayarları. Styling, tema, renk veya
  layout çalışmalarında tetiklenir.
---

# Tailwind Luxury Styling — Arlie Proje Skill'i

## Tailwind Config (Zorunlu)

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        arlie: {
          white: "#FFFFFF",
          light: "#F9F9F9",
          charcoal: "#1A1A1A",
          beige: "#F5F0EB",
          gold: "#C9A96E",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Helvetica Neue", "sans-serif"],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
      },
      letterSpacing: {
        luxury: "0.2em",
        subtle: "0.1em",
      },
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
      },
    },
  },
  plugins: [],
};

export default config;
```

## globals.css Temeli

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
  }
  
  ::selection {
    background-color: #F5F0EB;
    color: #1A1A1A;
  }
  
  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #F9F9F9;
  }
  ::-webkit-scrollbar-thumb {
    background: #1A1A1A20;
    border-radius: 3px;
  }
}

@layer components {
  .arlie-container {
    @apply max-w-7xl mx-auto px-6 md:px-12 lg:px-24;
  }
  
  .arlie-section {
    @apply py-16 md:py-24 lg:py-32;
  }
  
  .arlie-heading {
    @apply font-serif tracking-tight;
  }
  
  .arlie-subtext {
    @apply font-sans text-xs md:text-sm uppercase tracking-luxury text-arlie-charcoal/60;
  }
  
  .arlie-body {
    @apply font-sans text-base md:text-lg leading-relaxed text-arlie-charcoal/80;
  }
}
```

## Yasaklar

❌ `bg-red-500`, `text-blue-600` gibi Tailwind default renkleri YASAK
❌ `style={{ }}` inline stiller YASAK
❌ Hardcoded hex renk kodları YASAK
❌ `!important` kullanımı YASAK
❌ Dar spacing (`p-2`, `m-1`) — Arlie'de sıkışıklık yok

## İzin Verilenler

✅ Yalnızca `arlie-*` renk token'ları
✅ Opacity varyantları: `text-arlie-charcoal/60`, `bg-arlie-beige/50`
✅ Tailwind utility composition
✅ `@layer components` ile custom bileşen sınıfları
✅ CSS variable'lar (font family için)
