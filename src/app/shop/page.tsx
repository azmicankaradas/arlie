"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SideCart from "@/components/cart/SideCart";
import CategoryFilter from "@/components/shop/CategoryFilter";
import ProductGrid from "@/components/shop/ProductGrid";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { products } from "@/lib/data";
import type { Category } from "@/types/product";

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <>
      <Navbar />
      <main className="pt-20 md:pt-24">
        <section className="px-6 md:px-12 lg:px-24 py-12 md:py-16 lg:py-20">
          <AnimatedSection className="mb-10 md:mb-14">
            <p className="font-sans text-xs uppercase tracking-[0.25em] text-arlie-charcoal/40 mb-3">
              Koleksiyon
            </p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight">
              Mağaza
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.1} className="mb-8 md:mb-12">
            <CategoryFilter
              active={activeCategory}
              onChange={setActiveCategory}
            />
          </AnimatedSection>

          <ProductGrid products={filteredProducts} />
        </section>
      </main>
      <Footer />
      <SideCart />
    </>
  );
}
