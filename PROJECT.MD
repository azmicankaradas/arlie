PROJECT.md: Arlie - Minimalist Takı E-Ticaret Platformu
1. Proje Vizyonu
Arlie, modern, zarif ve minimalist takı tasarımlarını kullanıcıyla buluşturan lüks bir e-ticaret platformudur. Tasarım felsefesi "az ama öz" ilkesine dayanır. Web sitesi, bir mağazadan ziyade bir sanat galerisi hissi vermelidir.
İlham Kaynağı: https://alohas.com
Ana Renk Paleti: Beyaz (#FFFFFF), Çok Açık Gri (#F9F9F9), Kömür Siyahı (Metinler için - #1A1A1A) ve Yumuşak Bej tonları.
Tipografi: Modern Serif (başlıklar için) ve Minimalist Sans-serif (gövde metinleri için).
2. Kullanıcı Deneyimi (UX) Hedefleri
Akıcılık: Sayfalar arası geçişler yumuşak (fade-in) olmalı.
Mobil Öncelik: Tasarım mobil cihazlarda kusursuz görünmeli.
Görsel Odak: Ürün görselleri geniş, yüksek çözünürlüklü ve net olmalı.
Basitlik: Karmaşık menülerden kaçınılmalı, navigasyon sezgisel olmalı.
3. Teknik Özellikler (MVP)
Frontend
Framework: Next.js (App Router)
Styling: Tailwind CSS (Beyaz tonları ve özel spacing için)
Animasyonlar: Framer Motion (Scroll efektleri ve hover durumları için)
İkonlar: Lucide React (İnce hatlı, minimalist ikonlar)
Fonksiyonel Modüller
Anasayfa:
Full-width "Hero" bölümü (Video veya yüksek kaliteli görsel).
Öne çıkan koleksiyonlar (Grid yapısı).
"Arlie Dünyası" (Marka hikayesi kısa özeti).
Ürün Listeleme (Shop):
Kategori filtreleri (Yüzük, Küpe, Kolye, Bileklik).
Minimalist ürün kartları (Hover'da ikinci görselin görünmesi).
Ürün Detay Sayfası:
Büyük görsel galerisi.
Ürün hikayesi ve materyal bilgisi (Sürdürülebilirlik vurgusu).
"Sepete Ekle" butonu (Sticky/Sabit tasarım).
Sepet ve Ödeme:
Side-cart (Yandan açılan sepet paneli).
Temiz ve güven verici ödeme adımları.
4. Dosya Yapısı (Öngörülen)
code
Text
arlie/
├── app/                # Next.js App Router
├── components/         # UI Bileşenleri (Navbar, Footer, ProductCard)
├── public/             # Görseller ve Fontlar
├── styles/             # Global CSS ve Tailwind Konfigürasyonu
├── hooks/              # Custom React Hooks
├── lib/                # Yardımcı Fonksiyonlar (Utils)
└── PROJECT.md          # Proje dökümantasyonu
5. Agentlar ve Skill'ler İçin Notlar
Bu proje geliştirilirken aşağıdaki yetkinliklere ihtiyaç duyulacaktır:
UI Agent: Tailwind ile Alohas tarzı whitespace (beyaz boşluk) yönetimi.
Content Agent: Takı dünyasına uygun, lüks ve çekici ürün açıklamaları üretimi.
Logic Agent: Sepet yönetimi ve state yönetimi (Zustand veya React Context).