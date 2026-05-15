# Arlie — Minimalist Takı E-Ticaret Platformu

Lüks minimalist takı tasarımlarını sergileyen modern e-ticaret platformu. Tasarım felsefesi: *"Az ama öz"* — web sitesi bir mağaza değil, bir sanat galerisi hissi verir.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)
![Auth.js](https://img.shields.io/badge/Auth.js-v5-purple)

---

## 🚀 Hızlı Başlangıç

### Gereksinimler

- Node.js 20+
- npm 10+
- Supabase hesabı (PostgreSQL)

### Kurulum

```bash
# 1. Repoyu klonla
git clone https://github.com/azmicankaradas/arlie.git
cd arlie

# 2. Bağımlılıkları yükle (Prisma client otomatik generate edilir)
npm install

# 3. Environment değişkenlerini ayarla
cp .env.example .env.local
# .env.local dosyasını düzenleyip gerçek değerleri girin

# 4. Veritabanını hazırla
npx prisma migrate dev --name init
npm run db:seed

# 5. Geliştirme sunucusunu başlat
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde açılır.

---

## 🏗️ Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS 4 |
| Animasyon | Framer Motion |
| State | Zustand |
| Database | Supabase PostgreSQL + Prisma ORM |
| Auth | Auth.js v5 (Credentials, JWT, RBAC) |
| Validation | Zod |
| Deploy | Vercel (Frankfurt) |

---

## 📁 Proje Yapısı

```
arlie/
├── prisma/
│   ├── schema.prisma        # Veritabanı şeması
│   └── seed.ts              # Seed data
├── src/
│   ├── app/
│   │   ├── api/             # Backend API routes
│   │   ├── auth/            # Login & Register sayfaları
│   │   ├── shop/            # Ürün listeleme
│   │   ├── product/[slug]/  # Ürün detay
│   │   ├── cart/            # Sepet
│   │   └── layout.tsx       # Root layout
│   ├── components/          # UI bileşenleri
│   ├── lib/                 # Backend utilities
│   │   ├── auth.ts          # Auth.js v5 config
│   │   ├── db.ts            # Prisma singleton
│   │   ├── validation.ts    # Zod schemas
│   │   ├── security.ts      # bcrypt, rate limiter
│   │   ├── api-utils.ts     # API helpers
│   │   └── data.ts          # Data access layer
│   ├── store/               # Zustand stores
│   ├── types/               # TypeScript types
│   └── proxy.ts             # Security headers & CORS
├── vercel.json              # Vercel config
├── .env.example             # Env template (development)
└── .env.production.example  # Env template (production)
```

---

## 🔌 API Endpoints

### Public (Auth gerektirmez)

| Method | Path | Açıklama |
|--------|------|----------|
| GET | `/api/health` | Health check |
| GET | `/api/products` | Ürün listesi (pagination, filter, sort, search) |
| GET | `/api/products/:slug` | Ürün detay |
| POST | `/api/auth/register` | Kullanıcı kaydı |

### Protected (Auth gerektirir)

| Method | Path | Açıklama |
|--------|------|----------|
| POST | `/api/auth/change-password` | Şifre değiştirme |
| GET/PATCH | `/api/user/profile` | Profil görüntüleme/güncelleme |
| GET/POST | `/api/user/addresses` | Adres listesi/ekleme |
| PUT/DELETE | `/api/user/addresses/:id` | Adres güncelleme/silme |
| GET/POST | `/api/orders` | Sipariş listesi/oluşturma |

---

## 🔐 Güvenlik

- **Auth.js v5** — JWT sessions, Credentials provider
- **bcrypt** — Password hashing (12 rounds)
- **Zod** — Tüm API inputlarında validation
- **Rate limiting** — Auth: 5/15min, sensitive: 3/30min
- **Security headers** — CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- **CORS** — Whitelist-based origin kontrolü
- **OWASP** — Generic error messages, no user enumeration

---

## 📦 Scripts

```bash
npm run dev          # Geliştirme sunucusu
npm run build        # Production build
npm run start        # Production sunucusu
npm run lint         # ESLint
npm run db:generate  # Prisma client generate
npm run db:push      # Schema'yı DB'ye pushla
npm run db:migrate   # Migration oluştur ve uygula
npm run db:seed      # Seed data yükle
npm run db:studio    # Prisma Studio (DB GUI)
npm run db:reset     # Migration'ları sıfırla
```

---

## 🚀 Deploy (Vercel)

1. [Vercel Dashboard](https://vercel.com/new) → GitHub reposunu import et
2. Framework: Next.js (otomatik algılanır)
3. Environment Variables → `.env.production.example`'daki değişkenleri ekle
4. Deploy!

> **Not:** `AUTH_TRUST_HOST=true` Vercel'de zorunludur.

---

## 📄 Lisans

Private project — Tüm hakları saklıdır.
