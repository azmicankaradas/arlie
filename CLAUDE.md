# Arlie — Minimalist Takı E-Ticaret Platformu

## Proje Kimliği
Arlie, **lüks minimalist takı** tasarımlarını sergileyen bir e-ticaret platformudur.
Tasarım felsefesi: *"Az ama öz"* — web sitesi bir mağaza değil, bir **sanat galerisi** hissi vermelidir.
İlham kaynağı: [alohas.com](https://alohas.com)

---

## Teknoloji Yığını

| Katman | Teknoloji | Notlar |
|--------|-----------|-------|
| Framework | **Next.js 14+** (App Router) | `app/` dizini, RSC varsayılan |
| Styling | **Tailwind CSS** | Custom renk token'ları zorunlu |
| Animasyon | **Framer Motion** | Scroll, hover, page transition |
| İkonlar | **Lucide React** | İnce hatlı, minimalist |
| State | **Zustand** | Sepet, filtre, UI state |
| Tipografi | Cormorant (başlık) + Montserrat (gövde) | Google Fonts |

---

## Renk Paleti (Zorunlu Token'lar)

```
--color-white:       #FFFFFF
--color-light-gray:  #F9F9F9
--color-charcoal:    #1A1A1A
--color-warm-beige:  #F5F0EB
--color-soft-gold:   #C9A96E
```

Başka renk KULLANMA. Tüm bileşenler bu palette kalmalıdır.

---

## Sayfa Mimarisi

```
src/app/
├── page.tsx                    # Anasayfa
├── layout.tsx                  # Root layout
├── globals.css                 # Global stiller
├── shop/page.tsx               # Ürün listeleme
├── product/[slug]/page.tsx     # Ürün detay
├── cart/page.tsx               # Sepet
└── about/page.tsx              # Marka hikayesi
```

## Bileşen Hiyerarşisi

```
src/components/
├── layout/   (Navbar, Footer)
├── home/     (HeroSection, FeaturedCollections, BrandStory)
├── shop/     (ProductCard, ProductGrid, CategoryFilter)
├── product/  (ImageGallery, ProductInfo, StickyAddToCart)
├── cart/     (SideCart, CartItem)
└── ui/       (Button, AnimatedSection)
```

## Kodlama Kuralları

- **TypeScript** zorunlu — `any` YASAK
- Dosya adları PascalCase (bileşenler), camelCase (yardımcılar)
- Her bileşen max **150 satır**
- `"use client"` sadece interaktif bileşenlerde
- Inline style YASAK → yalnızca Tailwind
- Görseller: `next/image` zorunlu
- Animasyonlar: `framer-motion` ile
- `prefers-reduced-motion` desteği zorunlu

## Agent & Skill Sistemi

Agent'lar: `.claude/agents/` — planner, builder, reviewer, ui-agent
Skill'ler: `.claude/skills/` — 8 custom + ui-ux-pro-max
