"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import type { CartItem as CartItemType } from "@/store/useCartStore";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex gap-4">
      {/* Image placeholder */}
      <div className="w-20 h-24 bg-arlie-light flex-shrink-0 flex items-center justify-center">
        <span className="font-serif text-2xl text-arlie-charcoal/10">
          {item.name.charAt(0)}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <h3 className="font-sans text-sm truncate">{item.name}</h3>
          <p className="font-sans text-sm text-arlie-charcoal/50 tabular-nums mt-0.5">
            {item.price.toLocaleString("tr-TR")} ₺
          </p>
        </div>

        <div className="flex items-center justify-between">
          {/* Quantity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="w-7 h-7 flex items-center justify-center border border-arlie-light hover:border-arlie-charcoal/30 transition-colors cursor-pointer"
              aria-label="Azalt"
            >
              <Minus size={12} />
            </button>
            <span className="font-sans text-sm tabular-nums w-4 text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center border border-arlie-light hover:border-arlie-charcoal/30 transition-colors cursor-pointer"
              aria-label="Artır"
            >
              <Plus size={12} />
            </button>
          </div>

          {/* Remove */}
          <button
            onClick={() => removeItem(item.id)}
            className="text-arlie-charcoal/30 hover:text-arlie-charcoal/70 transition-colors cursor-pointer"
            aria-label="Kaldır"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
