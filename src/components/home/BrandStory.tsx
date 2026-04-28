"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";

export default function BrandStory() {
  return (
    <section className="bg-arlie-beige/30">
      <div className="px-6 md:px-12 lg:px-24 py-20 md:py-28 lg:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
          {/* Image placeholder */}
          <AnimatedSection>
            <div className="aspect-[4/5] bg-arlie-light rounded-sm flex items-center justify-center">
              <span className="font-serif text-6xl text-arlie-charcoal/10">
                A
              </span>
            </div>
          </AnimatedSection>

          {/* Text */}
          <AnimatedSection delay={0.2}>
            <div className="space-y-6 md:space-y-8">
              <p className="font-sans text-xs uppercase tracking-[0.25em] text-arlie-charcoal/40">
                Arlie Dünyası
              </p>
              <h2 className="font-serif text-3xl md:text-4xl tracking-tight leading-[1.2]">
                Az Ama Öz
              </h2>
              <div className="space-y-4">
                <p className="font-sans text-base md:text-lg leading-relaxed text-arlie-charcoal/70">
                  Arlie, &ldquo;az ama öz&rdquo; felsefesiyle tasarlanan minimalist 
                  takı markasıdır. Her parçamız, zamansız tasarım ve 
                  sürdürülebilir üretim anlayışıyla hayata geçirilir.
                </p>
                <p className="font-sans text-base md:text-lg leading-relaxed text-arlie-charcoal/70">
                  Doğadan ilham alıyor, doğaya saygı duyuyoruz. Geri 
                  dönüştürülmüş malzemeler ve etik üretim süreçleriyle 
                  her kadının günlük zarafetine eşlik ediyoruz.
                </p>
              </div>
              <div className="pt-2">
                <Button href="/about" variant="secondary">
                  Hikayemizi Okuyun
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
