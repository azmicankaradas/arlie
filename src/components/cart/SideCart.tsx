"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import CartItem from "./CartItem";

export default function SideCart() {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const totalPrice = useCartStore((s) => s.totalPrice);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 bg-arlie-charcoal/25 z-50 cursor-pointer"
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "tween",
              duration: 0.4,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-arlie-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-arlie-light">
              <h2 className="font-serif text-lg">Sepet</h2>
              <button
                onClick={closeCart}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                aria-label="Sepeti kapat"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="font-sans text-arlie-charcoal/40 mb-2">
                    Sepetiniz boş
                  </p>
                  <p className="font-sans text-xs text-arlie-charcoal/30">
                    Koleksiyonumuzu keşfetmeye başlayın
                  </p>
                </div>
              ) : (
                items.map((item) => <CartItem key={item.id} item={item} />)
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-arlie-light px-6 py-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-sm text-arlie-charcoal/60">
                    Toplam
                  </span>
                  <span className="font-sans text-base font-medium tabular-nums">
                    {totalPrice().toLocaleString("tr-TR")} ₺
                  </span>
                </div>
                <button className="w-full py-3.5 bg-arlie-charcoal text-arlie-white font-sans text-xs uppercase tracking-[0.15em] font-medium hover:bg-arlie-charcoal/90 transition-colors duration-300 cursor-pointer">
                  Ödemeye Geç
                </button>
                <button
                  onClick={closeCart}
                  className="w-full py-2 font-sans text-xs text-arlie-charcoal/50 hover:text-arlie-charcoal transition-colors duration-300 cursor-pointer"
                >
                  Alışverişe Devam Et
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
