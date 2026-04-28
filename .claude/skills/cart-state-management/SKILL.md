---
name: cart-state-management
description: >
  Arlie sepet yönetimi ve Zustand state pattern'leri.
  Sepet CRUD işlemleri, side-cart paneli, persist middleware,
  ödeme akışı ve sepet hesaplamaları. Sepet veya ödeme
  çalışmalarında tetiklenir.
---

# Cart State Management — Arlie Proje Skill'i

## Zustand Store Yapısı

```typescript
// store/useCartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;             // Side-cart açık/kapalı

  // Actions
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Computed
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.id === newItem.id && item.variant === newItem.variant
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === newItem.id && item.variant === newItem.variant
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
              isOpen: true,
            };
          }
          return {
            items: [...state.items, { ...newItem, quantity: 1 }],
            isOpen: true,
          };
        });
      },

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: quantity <= 0
            ? state.items.filter((item) => item.id !== id)
            : state.items.map((item) =>
                item.id === id ? { ...item, quantity } : item
              ),
        })),

      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: "arlie-cart",     // localStorage key
      partialize: (state) => ({ items: state.items }), // sadece items persist
    }
  )
);
```

## Side-Cart Pattern

```tsx
// components/cart/SideCart.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import CartItem from "./CartItem";

export default function SideCart() {
  const { items, isOpen, closeCart, totalPrice } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-arlie-charcoal/30 z-50"
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-arlie-white z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-arlie-light">
              <h2 className="font-serif text-lg">Sepet</h2>
              <button onClick={closeCart} aria-label="Sepeti kapat">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {items.length === 0 ? (
                <p className="text-arlie-charcoal/50 text-center py-12">
                  Sepetiniz boş
                </p>
              ) : (
                items.map((item) => <CartItem key={item.id} item={item} />)
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-arlie-light px-6 py-5 space-y-4">
                <div className="flex justify-between">
                  <span className="font-sans text-sm">Toplam</span>
                  <span className="font-sans text-sm font-medium">
                    {totalPrice().toLocaleString("tr-TR")} ₺
                  </span>
                </div>
                <button className="w-full py-3.5 bg-arlie-charcoal text-arlie-white font-sans text-xs uppercase tracking-luxury">
                  Ödemeye Geç
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
```

## Kurallar

- `persist` middleware ile `localStorage` kullan
- `isOpen` state'i persist EDİLMEMELİ (partialize ile hariç tut)
- Sepete ekleme sonrası side-cart otomatik açılmalı
- Fiyatlar `toLocaleString("tr-TR")` formatında
- Hydration uyarısı için `useEffect` ile client-side kontrol
