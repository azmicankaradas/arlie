"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, User, ChevronRight, Search } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { products } from "@/lib/data";
import { CATEGORIES } from "@/types/product";
import type { Category } from "@/types/product";

const CATEGORY_ICONS: Record<Category, string> = {
  rings: "💍",
  earrings: "✨",
  necklaces: "📿",
  bracelets: "⭕",
};

const menuItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems);
  const openCart = useCartStore((s) => s.openCart);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Ctrl+K / Cmd+K keyboard shortcut for search
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setSearchQuery("");
  }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen || isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen, isSearchOpen]);

  // Auto-focus search input
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setSearchQuery("");
  }, []);
  const itemCount = mounted ? totalItems() : 0;

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        CATEGORIES[p.category].toLowerCase().includes(q)
    );
  }, [searchQuery]);

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
          {/* Left — MENÜ Button */}
          <div className="flex items-center gap-3 w-1/3">
            <button
              className="flex items-center gap-2 min-h-[44px] px-1 cursor-pointer group"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Menüyü aç"
              aria-expanded={isMenuOpen}
            >
              <Menu size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-200" />
              <span className="hidden sm:inline font-sans text-xs uppercase tracking-[0.15em] text-arlie-charcoal/70 group-hover:text-arlie-charcoal transition-colors duration-300">
                Menü
              </span>
            </button>
          </div>

          {/* Center — Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="block">
              <span className="font-serif text-2xl md:text-3xl tracking-[0.05em]">
                ARLIE
              </span>
            </Link>
          </div>

          {/* Right — Search + Profile + Cart */}
          <div className="flex items-center justify-end gap-1 md:gap-2 w-1/3">
            <button
              className="relative min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer group"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Ara"
            >
              <Search
                size={20}
                strokeWidth={1.5}
                className="group-hover:scale-110 transition-transform duration-200"
              />
            </button>
            <Link
              href="/profile"
              className="relative min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer group"
              aria-label="Hesabım"
            >
              <User
                size={20}
                strokeWidth={1.5}
                className="group-hover:scale-110 transition-transform duration-200"
              />
            </Link>
            <button
              className="relative min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer group"
              onClick={openCart}
              aria-label="Sepet"
            >
              <ShoppingBag
                size={20}
                strokeWidth={1.5}
                className="group-hover:scale-110 transition-transform duration-200"
              />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-arlie-charcoal text-arlie-white text-[10px] font-sans font-medium rounded-full flex items-center justify-center"
                >
                  {itemCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ========== Full-Screen Menu Overlay ========== */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-arlie-charcoal/20 z-[59] cursor-pointer"
            />

            {/* Menu Panel — left slide */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed left-0 top-0 h-full w-full max-w-sm bg-arlie-white z-[60] flex flex-col shadow-2xl"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between px-6 h-16 border-b border-arlie-light">
                <span className="font-sans text-xs uppercase tracking-[0.2em] text-arlie-charcoal/50">
                  Menü
                </span>
                <button
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                  onClick={closeMenu}
                  aria-label="Menüyü kapat"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              {/* Menu Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Categories Section */}
                <div className="px-6 pt-8 pb-4">
                  <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-arlie-charcoal/30 mb-5">
                    Kategoriler
                  </p>
                  <div className="space-y-1">
                    {(Object.entries(CATEGORIES) as [Category, string][]).map(
                      ([key, label], i) => (
                        <motion.div
                          key={key}
                          custom={i}
                          initial="hidden"
                          animate="visible"
                          variants={menuItemVariants}
                        >
                          <Link
                            href={`/shop?category=${key}`}
                            onClick={closeMenu}
                            className="flex items-center justify-between py-3 group"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{CATEGORY_ICONS[key]}</span>
                              <span className="font-sans text-sm tracking-wide text-arlie-charcoal/80 group-hover:text-arlie-charcoal transition-colors duration-200">
                                {label}
                              </span>
                            </div>
                            <ChevronRight
                              size={14}
                              strokeWidth={1.5}
                              className="text-arlie-charcoal/20 group-hover:text-arlie-charcoal/50 group-hover:translate-x-0.5 transition-all duration-200"
                            />
                          </Link>
                        </motion.div>
                      )
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="mx-6 border-t border-arlie-light" />

                {/* All Products */}
                <div className="px-6 pt-5 pb-4">
                  <motion.div
                    custom={4}
                    initial="hidden"
                    animate="visible"
                    variants={menuItemVariants}
                  >
                    <Link
                      href="/shop"
                      onClick={closeMenu}
                      className="flex items-center justify-between py-3 group"
                    >
                      <span className="font-sans text-sm tracking-wide text-arlie-charcoal/80 group-hover:text-arlie-charcoal transition-colors duration-200">
                        Tüm Ürünler
                      </span>
                      <ChevronRight
                        size={14}
                        strokeWidth={1.5}
                        className="text-arlie-charcoal/20 group-hover:text-arlie-charcoal/50 group-hover:translate-x-0.5 transition-all duration-200"
                      />
                    </Link>
                  </motion.div>
                </div>

                {/* Divider */}
                <div className="mx-6 border-t border-arlie-light" />

                {/* Navigation */}
                <div className="px-6 pt-5 pb-4">
                  <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-arlie-charcoal/30 mb-5">
                    Sayfalar
                  </p>
                  {[
                    { href: "/", label: "Ana Sayfa" },
                    { href: "/about", label: "Hakkımızda" },
                    { href: "/profile", label: "Hesabım" },
                  ].map((link, i) => (
                    <motion.div
                      key={link.href}
                      custom={i + 5}
                      initial="hidden"
                      animate="visible"
                      variants={menuItemVariants}
                    >
                      <Link
                        href={link.href}
                        onClick={closeMenu}
                        className="flex items-center justify-between py-3 group"
                      >
                        <span className="font-sans text-sm tracking-wide text-arlie-charcoal/80 group-hover:text-arlie-charcoal transition-colors duration-200">
                          {link.label}
                        </span>
                        <ChevronRight
                          size={14}
                          strokeWidth={1.5}
                          className="text-arlie-charcoal/20 group-hover:text-arlie-charcoal/50 group-hover:translate-x-0.5 transition-all duration-200"
                        />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Menu Footer */}
              <div className="px-6 py-5 border-t border-arlie-light bg-arlie-light/50">
                <p className="font-sans text-[10px] text-arlie-charcoal/30 text-center tracking-wider">
                  Sürdürülebilir lüks, zamansız zarafet.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ========== Search Overlay ========== */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeSearch}
              className="fixed inset-0 bg-arlie-charcoal/30 backdrop-blur-sm z-[70] cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const }}
              className="fixed top-0 left-0 right-0 z-[71] bg-arlie-white shadow-2xl"
            >
              {/* Search Input */}
              <div className="flex items-center gap-4 px-6 md:px-12 h-16 md:h-20 border-b border-arlie-light">
                <Search size={20} strokeWidth={1.5} className="text-arlie-charcoal/40 flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ürün ara..."
                  className="flex-1 font-sans text-base bg-transparent outline-none placeholder:text-arlie-charcoal/30"
                  autoComplete="off"
                />
                <div className="flex items-center gap-3">
                  <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-1 font-sans text-[10px] text-arlie-charcoal/30 bg-arlie-light rounded">
                    ESC
                  </kbd>
                  <button
                    onClick={closeSearch}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                    aria-label="Aramayı kapat"
                  >
                    <X size={20} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              {/* Search Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {searchQuery.trim() === "" ? (
                  <div className="px-6 md:px-12 py-8">
                    <p className="font-sans text-xs uppercase tracking-[0.2em] text-arlie-charcoal/30 mb-4">
                      Popüler Aramalar
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["Kolye", "Yüzük", "Gümüş", "Altın", "Luna", "Minimalist"].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setSearchQuery(tag)}
                          className="px-4 py-2 bg-arlie-light font-sans text-xs text-arlie-charcoal/60 hover:bg-arlie-beige/50 hover:text-arlie-charcoal transition-colors duration-200 cursor-pointer rounded-sm"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="px-6 md:px-12 py-12 text-center">
                    <p className="font-sans text-arlie-charcoal/40">
                      &ldquo;{searchQuery}&rdquo; için sonuç bulunamadı
                    </p>
                    <p className="font-sans text-xs text-arlie-charcoal/25 mt-1">
                      Farklı bir arama terimi deneyin
                    </p>
                  </div>
                ) : (
                  <div className="px-6 md:px-12 py-4">
                    <p className="font-sans text-xs text-arlie-charcoal/30 mb-4">
                      {searchResults.length} sonuç bulundu
                    </p>
                    <div className="space-y-1">
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          href={`/product/${product.slug}`}
                          onClick={closeSearch}
                          className="flex items-center gap-4 p-3 hover:bg-arlie-light/70 rounded-sm transition-colors duration-200 group"
                        >
                          <div className="w-12 h-14 bg-arlie-light flex-shrink-0 flex items-center justify-center rounded-sm overflow-hidden">
                            <span className="font-serif text-lg text-arlie-charcoal/10">
                              {product.name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-sans text-sm group-hover:text-arlie-gold transition-colors duration-200 truncate">
                              {product.name}
                            </p>
                            <p className="font-sans text-xs text-arlie-charcoal/40 mt-0.5">
                              {CATEGORIES[product.category]} · {product.price.toLocaleString("tr-TR")} ₺
                            </p>
                          </div>
                          <ChevronRight
                            size={14}
                            strokeWidth={1.5}
                            className="text-arlie-charcoal/15 group-hover:text-arlie-charcoal/40 flex-shrink-0"
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
