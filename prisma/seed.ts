/**
 * Prisma Seed Script
 *
 * Mevcut data.ts içindeki ürün verilerini PostgreSQL veritabanına aktarır.
 * Admin kullanıcı oluşturur.
 *
 * Kullanım:
 *   npx tsx prisma/seed.ts
 *   veya
 *   npm run db:seed
 */

import { PrismaClient, Category } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

// ────────────────────────────────────────────────────────────
// Mevcut data.ts'den alınan ürün verileri
// ────────────────────────────────────────────────────────────
const products = [
  {
    slug: "luna-kolye",
    name: "Luna Kolye",
    description:
      "Ayın en parlak halinden ilham alan Luna, minimalist çizgileriyle günlük zarafetinizi tamamlar.",
    story:
      "Her gece gökyüzünde parlayan ay, Luna koleksiyonumuzun ilham kaynağıdır. Ustalarımız tarafından tek tek elle cilalanır ve her parça benzersiz bir ışıltı taşır.",
    price: 1250,
    category: Category.necklaces,
    materials: ["925 Ayar Gümüş", "18K Altın Kaplama"],
    sustainability: "Geri dönüştürülmüş gümüş kullanılarak üretilmiştir.",
    images: ["/products/luna-1.jpg", "/products/luna-2.jpg"],
    inStock: true,
    featured: true,
  },
  {
    slug: "aurora-yuzuk",
    name: "Aurora Yüzük",
    description:
      "Kuzey ışıklarının büyüleyici dansından ilham alan Aurora, zarif ve cesur bir parça.",
    story:
      "Kuzey ışıklarının gökyüzünde yarattığı o büyülü anı yakalamak istedik. Aurora, ışığın metallerle buluştuğu minimalist bir başyapıttır.",
    price: 890,
    category: Category.rings,
    materials: ["925 Ayar Gümüş"],
    sustainability:
      "Etik kaynaklardan temin edilmiş malzemelerle üretilmiştir.",
    images: ["/products/aurora-1.jpg", "/products/aurora-2.jpg"],
    inStock: true,
    featured: true,
  },
  {
    slug: "stella-kupe",
    name: "Stella Küpe",
    description:
      "Yıldızların ışıltısını taşıyan Stella, her anınıza zarif bir parlaklık katar.",
    story:
      "Gece gökyüzündeki yıldızların sonsuz zarafetinden doğan Stella, kulağınızda hafif ve şık bir dokunuş bırakır.",
    price: 680,
    category: Category.earrings,
    materials: ["925 Ayar Gümüş", "Zirkon Taş"],
    sustainability: "Çevre dostu ambalaj ile teslim edilir.",
    images: ["/products/stella-1.jpg", "/products/stella-2.jpg"],
    inStock: true,
    featured: true,
  },
  {
    slug: "ivy-bileklik",
    name: "Ivy Bileklik",
    description:
      "Doğanın zarif kıvrımlarından ilham alan Ivy, bileğinizi sarmalayan ince bir dokunuş.",
    story:
      "Sarmaşıkların doğada yarattığı organik çizgiler, Ivy bilekliğimizin tasarım felsefesini oluşturur. Doğallık ve zarafet bir arada.",
    price: 750,
    category: Category.bracelets,
    materials: ["925 Ayar Gümüş", "18K Altın Kaplama"],
    sustainability: "Sürdürülebilir üretim süreçleriyle imal edilmiştir.",
    images: ["/products/ivy-1.jpg", "/products/ivy-2.jpg"],
    inStock: true,
    featured: true,
  },
  {
    slug: "nova-kolye",
    name: "Nova Kolye",
    description:
      "Bir yıldızın doğuşunu simgeleyen Nova, göğsünüzde parlayan zarif bir ışık.",
    story:
      "Evrenin derinliklerinde doğan yeni yıldızlar gibi, Nova kolye de her giyildiğinde yeni bir ışıltı sunar.",
    price: 1450,
    category: Category.necklaces,
    materials: ["925 Ayar Gümüş", "14K Altın"],
    sustainability: "Karbon nötr üretim süreciyle üretilmiştir.",
    images: ["/products/nova-1.jpg", "/products/nova-2.jpg"],
    inStock: true,
    featured: false,
  },
  {
    slug: "eden-yuzuk",
    name: "Eden Yüzük",
    description:
      "Cennet bahçesinin sadeliğinden ilham alan Eden, parmağınızda huzur veren bir parça.",
    story:
      "Eden, karmaşanın ortasında sadeliğin gücünü hatırlatır. Temiz çizgileri ve minimal formuyla günlük şıklığınızın vazgeçilmezi.",
    price: 720,
    category: Category.rings,
    materials: ["925 Ayar Gümüş"],
    sustainability: "Geri dönüştürülmüş malzemelerle üretilmiştir.",
    images: ["/products/eden-1.jpg", "/products/eden-2.jpg"],
    inStock: true,
    featured: false,
  },
  {
    slug: "pearl-kupe",
    name: "Pearl Küpe",
    description:
      "Denizin derinliklerinden gelen zarafet. Pearl, klasik inci estetiğini modern çizgilerle buluşturur.",
    story:
      "İncinin doğadaki yolculuğu, sabır ve zarafetin sembolüdür. Pearl küpelerimiz bu yolculuğun minimalist bir yansımasıdır.",
    price: 920,
    category: Category.earrings,
    materials: ["925 Ayar Gümüş", "Tatlı Su İncisi"],
    sustainability:
      "Sorumlu kaynaklardan temin edilmiş inciler kullanılmıştır.",
    images: ["/products/pearl-1.jpg", "/products/pearl-2.jpg"],
    inStock: true,
    featured: false,
  },
  {
    slug: "aura-bileklik",
    name: "Aura Bileklik",
    description:
      "Enerjinizi yansıtan Aura, bileğinizde ince ve zarif bir halka oluşturur.",
    story:
      "Her insanın kendine özgü bir aurası vardır. Bu bileklik, o görünmez enerjiyi gümüşün zarif çizgileriyle görünür kılar.",
    price: 580,
    category: Category.bracelets,
    materials: ["925 Ayar Gümüş"],
    sustainability:
      "Minimal ambalaj ve çevre dostu süreçlerle üretilmiştir.",
    images: ["/products/aura-1.jpg", "/products/aura-2.jpg"],
    inStock: true,
    featured: false,
  },
  {
    slug: "celeste-kolye",
    name: "Celeste Kolye",
    description:
      "Gökyüzünün sonsuz mavisinden ilham alan Celeste, zarafeti boyun çizginize taşır.",
    story:
      "Celeste, Latince'de 'göksel' anlamına gelir. Bu kolye, gökyüzünün uçsuz bucaksız güzelliğini minimalist bir formda sunar.",
    price: 1100,
    category: Category.necklaces,
    materials: ["925 Ayar Gümüş", "Akuamarin Taş"],
    sustainability:
      "Etik kaynaklı taşlar ve geri dönüştürülmüş gümüş ile üretilmiştir.",
    images: ["/products/celeste-1.jpg", "/products/celeste-2.jpg"],
    inStock: true,
    featured: false,
  },
  {
    slug: "sol-yuzuk",
    name: "Sol Yüzük",
    description:
      "Güneşin sıcaklığını parmağınızda hissedin. Sol, minimal formuyla dikkat çeker.",
    story:
      "Güneş, yaşamın kaynağıdır. Sol yüzük, bu sonsuz enerjiyi altın tonlarıyla parmağınıza taşır.",
    price: 980,
    category: Category.rings,
    materials: ["925 Ayar Gümüş", "18K Altın Kaplama"],
    sustainability:
      "Sürdürülebilir altın kaplama teknolojisi ile üretilmiştir.",
    images: ["/products/sol-1.jpg", "/products/sol-2.jpg"],
    inStock: true,
    featured: false,
  },
  {
    slug: "vega-kupe",
    name: "Vega Küpe",
    description:
      "En parlak yıldızdan ilham alan Vega, kulaklarınızda zarafetin ışıltısını yaşatır.",
    story:
      "Vega, gökyüzünün en parlak yıldızlarından biridir. Bu küpe, o ışığın minimalist bir yorumudur.",
    price: 760,
    category: Category.earrings,
    materials: ["925 Ayar Gümüş", "18K Altın Kaplama"],
    sustainability: "Çevre dostu üretim süreçleri ile imal edilmiştir.",
    images: ["/products/vega-1.jpg", "/products/vega-2.jpg"],
    inStock: true,
    featured: false,
  },
  {
    slug: "terra-bileklik",
    name: "Terra Bileklik",
    description:
      "Toprağın sağlamlığı ve zarafetini bir arada sunan Terra, günlük kullanım için idealdir.",
    story:
      "Terra, yeryüzünün gücünü ve güzelliğini bileğinize taşır. Dayanıklı yapısı ve zarif tasarımıyla her gün yanınızda.",
    price: 650,
    category: Category.bracelets,
    materials: ["925 Ayar Gümüş"],
    sustainability:
      "Geri dönüştürülmüş gümüş ve minimal ambalaj ile teslim edilir.",
    images: ["/products/terra-1.jpg", "/products/terra-2.jpg"],
    inStock: true,
    featured: false,
  },
];

// ────────────────────────────────────────────────────────────
// Seed Function
// ────────────────────────────────────────────────────────────
async function main() {
  console.log("🌱 Arlie veritabanı seed başlatılıyor...\n");

  // 1. Mevcut verileri temizle (geliştirme ortamında)
  console.log("🗑️  Mevcut veriler temizleniyor...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // 2. Admin kullanıcı oluştur
  console.log("👤 Admin kullanıcı oluşturuluyor...");
  const adminPasswordHash = await hash("Admin123!", 12);
  const admin = await prisma.user.create({
    data: {
      email: "admin@arlie.com.tr",
      name: "Arlie Admin",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });
  console.log(`   ✅ Admin: ${admin.email}`);

  // 3. Test müşteri oluştur
  console.log("👤 Test müşteri oluşturuluyor...");
  const customerPasswordHash = await hash("Customer123!", 12);
  const customer = await prisma.user.create({
    data: {
      email: "test@arlie.com.tr",
      name: "Test Müşteri",
      passwordHash: customerPasswordHash,
      role: "CUSTOMER",
      emailVerified: new Date(),
    },
  });
  console.log(`   ✅ Müşteri: ${customer.email}`);

  // 4. Test müşteri için adres oluştur
  console.log("📍 Test adres oluşturuluyor...");
  await prisma.address.create({
    data: {
      userId: customer.id,
      title: "Ev",
      fullName: "Test Müşteri",
      phone: "+90 555 123 4567",
      line1: "Bağdat Caddesi No: 123",
      line2: "Kat: 3 Daire: 5",
      city: "İstanbul",
      district: "Kadıköy",
      zipCode: "34710",
      isDefault: true,
    },
  });
  console.log("   ✅ Adres oluşturuldu");

  // 5. Ürünleri veritabanına aktar
  console.log("💎 Ürünler oluşturuluyor...");
  for (const product of products) {
    const created = await prisma.product.create({
      data: product,
    });
    console.log(`   ✅ ${created.name} (${created.slug})`);
  }

  console.log(`\n🎉 Seed tamamlandı!`);
  console.log(`   📊 ${products.length} ürün eklendi`);
  console.log(`   👤 2 kullanıcı oluşturuldu (admin + test)`);
  console.log(`   📍 1 adres oluşturuldu`);
  console.log(`\n   Admin giriş: admin@arlie.com.tr / Admin123!`);
  console.log(`   Test giriş:  test@arlie.com.tr / Customer123!`);
}

main()
  .catch((e) => {
    console.error("❌ Seed hatası:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
