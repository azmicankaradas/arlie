---
name: framer-motion-animations
description: >
  Arlie projesine özel Framer Motion animasyon pattern'leri.
  Scroll efektleri, sayfa geçişleri, hover animasyonları,
  stagger efektleri ve ürün kartı ikinci görsel geçişi.
  Animasyon ekleme veya düzenleme görevlerinde tetiklenir.
---

# Framer Motion Animations — Arlie Proje Skill'i

## Animasyon Felsefesi

Arlie'de animasyonlar **fark ettirmeden hissettirmeli**.
Abartılı efektler YASAK. Her animasyon zarif, yumuşak ve amaca yönelik olmalı.

## Temel Animasyon Variant'ları

```tsx
// lib/animations.ts — Paylaşılan animasyon tanımları

export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6, ease: "easeOut" },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
};

export const scaleOnHover = {
  whileHover: { scale: 1.02 },
  transition: { duration: 0.4, ease: "easeOut" },
};
```

## Scroll Animasyonu (Section Girişleri)

```tsx
"use client";
import { motion } from "framer-motion";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function AnimatedSection({ children, className, delay = 0 }: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

## Ürün Kartı Hover (İkinci Görsel)

```tsx
<motion.div className="group relative overflow-hidden" whileHover={{ scale: 1.01 }}>
  {/* Birinci görsel — hover'da kaybolur */}
  <motion.div className="transition-opacity duration-500 group-hover:opacity-0">
    <Image src={primaryImage} alt={name} fill className="object-cover" />
  </motion.div>
  
  {/* İkinci görsel — hover'da görünür */}
  <motion.div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
    <Image src={secondaryImage} alt={`${name} - alternatif`} fill className="object-cover" />
  </motion.div>
</motion.div>
```

## Sayfa Geçişleri

```tsx
// components/ui/PageTransition.tsx
"use client";
import { motion } from "framer-motion";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
```

## Erişilebilirlik (prefers-reduced-motion)

```tsx
import { useReducedMotion } from "framer-motion";

export default function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.7 }}
    >
      {/* İçerik */}
    </motion.div>
  );
}
```

## Kurallar

- Animasyon süreleri: **0.3s – 0.8s** (asla 1s üzeri)
- Ease: `[0.25, 0.1, 0.25, 1]` veya `easeOut` (asla `linear`)
- `viewport={{ once: true }}` — scroll animasyonları tekrar etmemeli
- `prefers-reduced-motion` desteği zorunlu
- Aynı sayfada 3'ten fazla farklı animasyon tipi YASAK
