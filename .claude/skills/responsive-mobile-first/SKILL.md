---
name: responsive-mobile-first
description: >
  Arlie projesine özel mobil öncelikli responsive tasarım kuralları.
  Breakpoint stratejisi, touch-friendly hedefler, responsive grid,
  mobil navigasyon ve görsel optimizasyon. Responsive düzenleme
  veya mobil uyumluluk görevlerinde tetiklenir.
---

# Responsive Mobile-First — Arlie Proje Skill'i

## Breakpoint Stratejisi

Arlie **mobil öncelikli** tasarlanır. Varsayılan stiller mobil içindir.

```
Mobil (< 640px):    Temel deneyim — her şey tek kolon
sm  (≥ 640px):      Küçük tablet — minor ayarlamalar
md  (≥ 768px):      Tablet — 2 kolon grid, büyüyen spacing
lg  (≥ 1024px):     Laptop — 3-4 kolon grid, geniş padding
xl  (≥ 1280px):     Masaüstü — max-width container
2xl (≥ 1536px):     Geniş ekran — extra padding
```

## Grid Sistemleri

### Ürün Grid
```tsx
// Mobil: 2 kolon → Tablet: 3 kolon → Masaüstü: 4 kolon
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
```

### İçerik Grid
```tsx
// Mobil: tam genişlik → Masaüstü: yarım-yarım
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
```

### Hero Layout
```tsx
// Mobil: üst üste → Masaüstü: yan yana veya full-width
<section className="relative h-[70vh] md:h-[85vh] lg:h-screen">
```

## Responsive Tipografi

```tsx
// Hero başlık
"text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"

// Section başlık
"text-2xl md:text-3xl lg:text-4xl"

// Alt başlık
"text-xs md:text-sm"

// Gövde
"text-sm md:text-base lg:text-lg"
```

## Responsive Spacing

```tsx
// Container
"px-5 sm:px-6 md:px-12 lg:px-24 xl:px-32"

// Section padding
"py-12 md:py-20 lg:py-32 xl:py-40"

// Bileşen boşlukları
"space-y-8 md:space-y-12 lg:space-y-20"

// Navbar yüksekliği
"h-14 md:h-16 lg:h-20"
```

## Touch-Friendly Hedefler

```tsx
// Minimum dokunma alanı: 44x44px
<button className="min-h-[44px] min-w-[44px] p-3">

// Mobil menü öğeleri
<a className="block py-4 px-6 text-base">

// Filtre butonları
<button className="px-4 py-2.5 min-h-[40px]">
```

## Mobil Navigasyon Pattern

```tsx
// Hamburger menü — mobilde slide-in, masaüstünde gizli
<nav>
  {/* Mobil: hamburger ikonu */}
  <button className="md:hidden" aria-label="Menü">
    <Menu size={24} />
  </button>
  
  {/* Masaüstü: inline linkler */}
  <div className="hidden md:flex items-center gap-8">
    <Link href="/shop">Mağaza</Link>
    <Link href="/about">Hakkında</Link>
  </div>
</nav>

{/* Mobil menü — tam ekran overlay */}
<AnimatePresence>
  {isMenuOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-arlie-white z-50 flex flex-col items-center justify-center gap-8"
    >
      <Link href="/shop" className="font-serif text-2xl">Mağaza</Link>
      <Link href="/about" className="font-serif text-2xl">Hakkında</Link>
    </motion.div>
  )}
</AnimatePresence>
```

## Görsel Optimizasyon

```tsx
// Responsive sizes prop
<Image
  src={src}
  alt={alt}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
  className="object-cover"
/>

// Mobilde küçük, masaüstünde büyük görsel
<Image
  src={src}
  alt={alt}
  width={800}
  height={1000}
  className="w-full h-auto"
  priority={isHero}
/>
```

## Kurallar

- **Mobil önce yaz**, sonra büyük ekranlara uyarla
- Minimum dokunma hedefi: **44x44px**
- Yatay scroll ASLA olmamalı
- `overflow-x-hidden` root'ta ekle
- Görselde `sizes` prop zorunlu (responsive yükleme)
- Mobilde gereksiz animasyon azalt
