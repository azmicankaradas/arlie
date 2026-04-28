"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { CATEGORIES, CATEGORY_DESCRIPTIONS } from "@/types/product";
import type { Category } from "@/types/product";

const categoryImages: Record<Category, string> = {
  rings: "💍",
  earrings: "✨",
  necklaces: "📿",
  bracelets: "⭕",
};

export default function FeaturedCollections() {
  return (
    <section className="px-6 md:px-12 lg:px-24 py-20 md:py-28 lg:py-36">
      <AnimatedSection className="text-center mb-12 md:mb-16 lg:mb-20">
        <p className="font-sans text-xs uppercase tracking-[0.25em] text-arlie-charcoal/40 mb-4">
          Koleksiyonlar
        </p>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight">
          Kategorileri Keşfet
        </h2>
      </AnimatedSection>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto">
        {(Object.entries(CATEGORIES) as [Category, string][]).map(
          ([key, label], index) => (
            <AnimatedSection key={key} delay={index * 0.1}>
              <Link href={`/shop?category=${key}`} className="group block">
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="relative aspect-[3/4] bg-arlie-light rounded-sm overflow-hidden flex items-center justify-center mb-4 cursor-pointer"
                >
                  <div className="text-6xl md:text-7xl opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                    {categoryImages[key]}
                  </div>
                  <div className="absolute inset-0 bg-arlie-charcoal/0 group-hover:bg-arlie-charcoal/5 transition-colors duration-500" />
                </motion.div>
                <h3 className="font-sans text-sm uppercase tracking-[0.15em] text-center">
                  {label}
                </h3>
                <p className="font-sans text-xs text-arlie-charcoal/50 text-center mt-1">
                  {CATEGORY_DESCRIPTIONS[key]}
                </p>
              </Link>
            </AnimatedSection>
          )
        )}
      </div>
    </section>
  );
}
