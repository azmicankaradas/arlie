import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SideCart from "@/components/cart/SideCart";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Arlie'nin hikayesi — minimalist takı, sürdürülebilir lüks.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 md:pt-24">
        {/* Hero */}
        <section className="px-6 md:px-12 lg:px-24 py-16 md:py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedSection>
              <p className="font-sans text-xs uppercase tracking-[0.25em] text-arlie-charcoal/40 mb-6">
                Hikayemiz
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] mb-8">
                Az Ama Öz
              </h1>
              <p className="font-sans text-base md:text-lg leading-relaxed text-arlie-charcoal/70">
                Arlie, &ldquo;az ama öz&rdquo; felsefesiyle tasarlanan minimalist takı
                markasıdır. Her parçamız, zamansız tasarım ve sürdürülebilir
                üretim anlayışıyla hayata geçirilir.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Values */}
        <section className="bg-arlie-beige/30 px-6 md:px-12 lg:px-24 py-16 md:py-24 lg:py-32">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {[
              {
                title: "Sürdürülebilirlik",
                text: "Geri dönüştürülmüş gümüş ve etik kaynaklı malzemeler kullanıyoruz. Doğaya saygı, işimizin temelidir.",
              },
              {
                title: "El İşçiliği",
                text: "Her parça ustalarımız tarafından tek tek elle cilalanır. Kalite, seri üretimde değil, özen ve sabırda gizlidir.",
              },
              {
                title: "Zamansız Tasarım",
                text: "Trendlerin ötesinde, yıllar boyunca taşıyabileceğiniz parçalar tasarlıyoruz. Minimalizm, zamansızlığın anahtarıdır.",
              },
            ].map((value, i) => (
              <AnimatedSection key={value.title} delay={i * 0.15}>
                <div className="space-y-4">
                  <h3 className="font-serif text-xl md:text-2xl tracking-tight">
                    {value.title}
                  </h3>
                  <p className="font-sans text-sm md:text-base leading-relaxed text-arlie-charcoal/60">
                    {value.text}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* Quote */}
        <section className="px-6 md:px-12 lg:px-24 py-20 md:py-28 lg:py-36">
          <AnimatedSection className="max-w-2xl mx-auto text-center">
            <blockquote className="font-serif text-2xl md:text-3xl lg:text-4xl tracking-tight leading-[1.3] italic text-arlie-charcoal/80">
              &ldquo;Gerçek zarafet, eklemekte değil çıkarmakta gizlidir.&rdquo;
            </blockquote>
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-arlie-charcoal/40 mt-6">
              — Arlie Felsefesi
            </p>
          </AnimatedSection>
        </section>
      </main>
      <Footer />
      <SideCart />
    </>
  );
}
