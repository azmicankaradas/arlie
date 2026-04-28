"use client";

import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <section className="relative h-[85vh] md:h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/hero.jpg"
          alt="Arlie minimalist takı koleksiyonu"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-arlie-white/90 via-arlie-white/70 to-arlie-white/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-3xl">
        <AnimatedSection>
          <p className="font-sans text-xs md:text-sm uppercase tracking-[0.25em] text-arlie-charcoal/50 mb-6 md:mb-8">
            Minimalist Takı Koleksiyonu
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1] mb-6 md:mb-8">
            Zarafetin <br />
            <span className="italic">En Saf Hali</span>
          </h1>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <p className="font-sans text-base md:text-lg text-arlie-charcoal/60 leading-relaxed mb-10 md:mb-12 max-w-lg">
            Her parça bir hikaye anlatır. Sürdürülebilir malzemeler, zamansız
            tasarımlar ve el işçiliğiyle üretilen minimalist takılar.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.45}>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Button href="/shop">Koleksiyonu Keşfet</Button>
            <Button href="/about" variant="ghost">
              Hikayemizi Okuyun
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
