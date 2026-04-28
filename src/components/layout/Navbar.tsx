"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Search } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems);
  const openCart = useCartStore((s) => s.openCart);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const itemCount = mounted ? totalItems() : 0;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-arlie-white/90 backdrop-blur-md shadow-[0_1px_0_rgba(26,26,26,0.06)]"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-12 h-16 md:h-20">
          {/* Left — Menu / Links */}
          <div className="flex items-center gap-8 w-1/3">
            <button
              className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Menüyü aç"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/shop"
                className="font-sans text-xs uppercase tracking-[0.15em] text-arlie-charcoal/70 hover:text-arlie-charcoal transition-colors duration-300"
              >
                Mağaza
              </Link>
              <Link
                href="/about"
                className="font-sans text-xs uppercase tracking-[0.15em] text-arlie-charcoal/70 hover:text-arlie-charcoal transition-colors duration-300"
              >
                Hakkında
              </Link>
            </div>
          </div>

          {/* Center — Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="block">
              <span className="font-serif text-2xl md:text-3xl tracking-[0.05em]">
                ARLIE
              </span>
            </Link>
          </div>

          {/* Right — Search + Cart */}
          <div className="flex items-center justify-end gap-4 w-1/3">
            <button
              className="hidden md:flex min-h-[44px] min-w-[44px] items-center justify-center cursor-pointer"
              aria-label="Ara"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
            <button
              className="relative min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              onClick={openCart}
              aria-label="Sepet"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-arlie-charcoal text-arlie-white text-[10px] font-sans font-medium rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-arlie-white z-[60] flex flex-col"
          >
            <div className="flex items-center justify-between px-6 h-16">
              <span className="font-serif text-2xl tracking-[0.05em]">
                ARLIE
              </span>
              <button
                className="min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Menüyü kapat"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-10">
              {[
                { href: "/shop", label: "Mağaza" },
                { href: "/about", label: "Hakkında" },
              ].map((link) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="font-serif text-3xl tracking-wide"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
