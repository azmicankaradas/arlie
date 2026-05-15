# Arlie — Minimalist Takı E-Ticaret Platformu

## Proje Kimliği
Arlie, **lüks minimalist takı** tasarımlarını sergileyen bir e-ticaret platformudur.
Tasarım felsefesi: *"Az ama öz"* — web sitesi bir mağaza değil, bir **sanat galerisi** hissi vermelidir.
İlham kaynağı: [alohas.com](https://alohas.com)

---

## Teknoloji Yığını

| Katman | Teknoloji | Notlar |
|--------|-----------|-------|
| Framework | **Next.js 16** (App Router) | `app/` dizini, RSC varsayılan |
| Styling | **Tailwind CSS 4** | Custom renk token'ları zorunlu |
| Animasyon | **Framer Motion** | Scroll, hover, page transition |
| İkonlar | **Lucide React** | İnce hatlı, minimalist |
| State | **Zustand** | Sepet, filtre, UI state |
| Tipografi | Cormorant (başlık) + Montserrat (gövde) | Google Fonts |
| Database | **Supabase PostgreSQL** + **Prisma ORM** | Dual-mode: pooler (6543) + session (5432) |
| Auth | **Auth.js v5** (next-auth) | Credentials provider, JWT sessions, RBAC |
| Validation | **Zod** | Tüm API input'ları validate edilir |
| Security | **bcryptjs** | Password hashing (12 rounds) |
| Deploy | **Vercel** | Frankfurt region (fra1) |

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
├── layout.tsx                  # Root layout (AuthProvider sarılı)
├── globals.css                 # Global stiller
├── shop/page.tsx               # Ürün listeleme
├── product/[slug]/page.tsx     # Ürün detay
├── cart/page.tsx               # Sepet
├── about/page.tsx              # Marka hikayesi
├── auth/login/page.tsx         # Giriş sayfası
├── auth/register/page.tsx      # Kayıt sayfası
└── api/                        # Backend API routes
    ├── health/route.ts         # Health check
    ├── auth/[...nextauth]/     # Auth.js catch-all
    ├── auth/register/          # Kayıt endpoint
    ├── auth/change-password/   # Şifre değiştirme
    ├── products/               # Ürün listesi
    ├── products/[slug]/        # Ürün detay
    ├── orders/                 # Sipariş yönetimi
    ├── user/profile/           # Profil yönetimi
    └── user/addresses/         # Adres yönetimi
```

## Bileşen Hiyerarşisi

```
src/components/
├── layout/       (Navbar, Footer)
├── home/         (HeroSection, FeaturedCollections, BrandStory)
├── shop/         (ProductCard, ProductGrid, CategoryFilter)
├── product/      (ImageGallery, ProductInfo, StickyAddToCart)
├── cart/         (SideCart, CartItem)
├── ui/           (Button, AnimatedSection)
└── AuthProvider.tsx
```

## Backend Mimarisi

```
src/lib/
├── db.ts              # Prisma client singleton
├── auth.ts            # Auth.js v5 config (Credentials + JWT + RBAC)
├── validation.ts      # Zod schemas (tüm API inputları)
├── security.ts        # bcrypt, sanitize, rate limiter
├── api-utils.ts       # apiSuccess, apiError, withAuth, withValidation
└── data.ts            # Dual-mode data layer (Prisma DB + static fallback)

src/proxy.ts           # Security headers, CORS, CSP (Next.js 16 proxy)
```

## API Endpoint Özeti

| Method | Path | Auth | Açıklama |
|--------|------|------|----------|
| GET | `/api/health` | ❌ | Health check |
| GET | `/api/products` | ❌ | Ürün listesi (pagination, filter, sort) |
| GET | `/api/products/:slug` | ❌ | Ürün detay |
| POST | `/api/auth/register` | ❌ | Kullanıcı kaydı |
| POST | `/api/auth/change-password` | ✅ | Şifre değiştirme |
| GET/PATCH | `/api/user/profile` | ✅ | Profil |
| GET/POST | `/api/user/addresses` | ✅ | Adres listesi/ekleme |
| PUT/DELETE | `/api/user/addresses/:id` | ✅ | Adres güncelleme/silme |
| GET/POST | `/api/orders` | ✅ | Sipariş listesi/oluşturma |

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
