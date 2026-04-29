import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sayfa Bulunamadı",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-arlie-white">
      <div className="max-w-md text-center">
        <p className="font-serif text-8xl md:text-9xl text-arlie-charcoal/5 mb-2">
          404
        </p>
        <p className="font-sans text-xs uppercase tracking-[0.25em] text-arlie-charcoal/30 mb-4">
          Sayfa Bulunamadı
        </p>
        <h1 className="font-serif text-3xl md:text-4xl tracking-tight mb-4">
          Kaybolmuş Görünüyorsunuz
        </h1>
        <p className="font-sans text-sm text-arlie-charcoal/50 leading-relaxed mb-8">
          Aradığınız sayfa taşınmış veya kaldırılmış olabilir. Koleksiyonumuzu
          keşfetmeye devam edin.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/shop"
            className="px-8 py-3 bg-arlie-charcoal text-arlie-white font-sans text-xs uppercase tracking-[0.15em] font-medium hover:bg-arlie-charcoal/90 transition-colors duration-300"
          >
            Mağazaya Git
          </Link>
          <Link
            href="/"
            className="px-8 py-3 border border-arlie-charcoal text-arlie-charcoal font-sans text-xs uppercase tracking-[0.15em] font-medium hover:bg-arlie-charcoal hover:text-arlie-white transition-all duration-300"
          >
            Ana Sayfa
          </Link>
        </div>
      </div>
    </div>
  );
}
