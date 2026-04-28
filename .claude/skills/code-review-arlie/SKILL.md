---
name: code-review-arlie
description: >
  Arlie projesine özel kod inceleme kontrol listesi ve standartlar.
  @reviewer agent'ının kullandığı detaylı inceleme kriterleri.
  Kod inceleme, kalite kontrolü ve standart denetimi sırasında tetiklenir.
---

# Code Review Arlie — Proje Skill'i

## Hızlı Kontrol Listesi

Her PR/değişiklik için bu listeyi uygula:

### ✅ Zorunlu Geçişler (Fail = Blok)

```
□ TypeScript: `any` tipi yok
□ Renkler: Yalnızca arlie-* token'ları
□ Görseller: next/image kullanılıyor
□ Fontlar: next/font ile yüklenmiş
□ "use client": Sadece gerekli yerde
□ Inline style: Yok
□ Console.log: Temizlenmiş
□ Erişilebilirlik: Alt text + ARIA label
□ Responsive: Mobil breakpoint'ler var
□ Whitespace: Cömert padding (py-16+)
```

### ⚠️ Önerilen İyileştirmeler (Fail ≠ Blok)

```
□ Animasyon: prefers-reduced-motion desteği
□ SEO: Metadata tanımlı
□ Loading: Skeleton state var
□ Error: Hata durumu yönetilmiş
□ Performans: Lazy loading uygulanmış
□ Bileşen boyutu: 150 satırı aşmıyor
□ Naming: PascalCase (bileşen), camelCase (helper)
```

## Detaylı İnceleme Kriterleri

### 1. Marka Tutarlılığı (Ağırlık: %25)

| Kriter | Kabul | Red |
|--------|-------|-----|
| Renk paleti | `arlie-white/light/charcoal/beige/gold` | `gray-50`, `#333`, `rgb(...)` |
| Tipografi | `font-serif` (başlık) + `font-sans` (gövde) | Varsayılan font, font-mono |
| Whitespace | `py-16+`, `px-6+`, `gap-6+` | `p-2`, `m-1`, sıkışık layout |
| Genel his | Galeri estetiği, nefes alan | Kalabalık, dashboard tarzı |

### 2. TypeScript Kalitesi (Ağırlık: %20)

| Kriter | Kabul | Red |
|--------|-------|-----|
| Tipler | Interface/type tanımlı | `any`, `unknown` (hariç: catch blokları) |
| Props | Typed interface | Inline object |
| Return | Belirgin veya çıkarılabilir | Ambiguous |
| Import | Explicit, named | `import *` |

### 3. Performans (Ağırlık: %20)

| Kriter | Kontrol |
|--------|---------|
| Bundle | Gereksiz import yok, tree-shakeable |
| Image | next/image, sizes prop, priority doğru |
| Font | next/font, display: swap |
| RSC | Client boundary minimize |
| Memo | useMemo/useCallback gerekli yerlerde |

### 4. Erişilebilirlik (Ağırlık: %15)

| Kriter | Kontrol |
|--------|---------|
| Semantic | nav, main, section, article, aside kullanımı |
| Alt text | Tüm görsellerde anlamlı alt text |
| ARIA | Interactive elementlerde aria-label |
| Klavye | Tab navigasyonu çalışıyor |
| Kontrast | arlie-charcoal on arlie-white = 16.75:1 ✅ |

### 5. SEO (Ağırlık: %10)

| Kriter | Kontrol |
|--------|---------|
| Title | Her sayfada unique title |
| Description | Meta description tanımlı |
| Headings | Tek h1, doğru hiyerarşi |
| OG | Open Graph meta tag'ları |

### 6. Kod Kalitesi (Ağırlık: %10)

| Kriter | Kontrol |
|--------|---------|
| DRY | Tekrarlayan kod yok |
| Dosya boyutu | ≤150 satır |
| Naming | Convention'a uygun |
| Yorum | Karmaşık lojikte açıklama var |

## Puanlama

```
90-100: ⭐⭐⭐⭐⭐ Mükemmel — Ship it!
75-89:  ⭐⭐⭐⭐  İyi — Minor düzeltmelerle merge
60-74:  ⭐⭐⭐   Orta — Düzeltmeler gerekli
40-59:  ⭐⭐    Zayıf — Önemli revizyonlar gerekli
0-39:   ⭐     Yetersiz — Yeniden yazılmalı
```

## Kurallar

- Zorunlu kontrollerin TAMAMI geçmeli
- Puan 75 altıysa düzeltme iste
- Her sorun için dosya:satır referansı ver
- Pozitif geri bildirim de ver
