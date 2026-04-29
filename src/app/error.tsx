"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-arlie-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md text-center"
      >
        <p className="font-sans text-xs uppercase tracking-[0.25em] text-arlie-charcoal/30 mb-4">
          Bir şeyler ters gitti
        </p>
        <h1 className="font-serif text-3xl md:text-4xl tracking-tight mb-4">
          Hata Oluştu
        </h1>
        <p className="font-sans text-sm text-arlie-charcoal/50 leading-relaxed mb-8">
          Beklenmeyen bir hata meydana geldi. Lütfen sayfayı yenileyin veya ana
          sayfaya dönün.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 bg-arlie-charcoal text-arlie-white font-sans text-xs uppercase tracking-[0.15em] font-medium hover:bg-arlie-charcoal/90 transition-colors duration-300 cursor-pointer"
          >
            <RefreshCw size={14} />
            Tekrar Dene
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-arlie-charcoal text-arlie-charcoal font-sans text-xs uppercase tracking-[0.15em] font-medium hover:bg-arlie-charcoal hover:text-arlie-white transition-all duration-300"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
