import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SideCart from "@/components/cart/SideCart";
import ImageGallery from "@/components/product/ImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import StickyAddToCart from "@/components/product/StickyAddToCart";
import { getProductBySlug, products } from "@/lib/data";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Ürün Bulunamadı" };

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 md:pt-24 pb-24 md:pb-0">
        <div className="px-6 md:px-12 lg:px-24 py-8 md:py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 max-w-6xl mx-auto">
            {/* Image Gallery */}
            <ImageGallery images={product.images} name={product.name} />

            {/* Product Info + CTA */}
            <div>
              <ProductInfo product={product} />
              <StickyAddToCart product={product} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <SideCart />
    </>
  );
}
