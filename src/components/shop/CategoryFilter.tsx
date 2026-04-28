"use client";

import { CATEGORIES } from "@/types/product";
import type { Category } from "@/types/product";

interface CategoryFilterProps {
  active: Category | "all";
  onChange: (category: Category | "all") => void;
}

export default function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-6 md:gap-8 overflow-x-auto pb-4 scrollbar-hide">
      <button
        onClick={() => onChange("all")}
        className={`font-sans text-xs uppercase tracking-[0.2em] whitespace-nowrap transition-colors duration-300 cursor-pointer min-h-[44px] flex items-center ${
          active === "all"
            ? "text-arlie-charcoal"
            : "text-arlie-charcoal/35 hover:text-arlie-charcoal/60"
        }`}
      >
        Tümü
      </button>
      {(Object.entries(CATEGORIES) as [Category, string][]).map(
        ([key, label]) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`font-sans text-xs uppercase tracking-[0.2em] whitespace-nowrap transition-colors duration-300 cursor-pointer min-h-[44px] flex items-center ${
              active === key
                ? "text-arlie-charcoal"
                : "text-arlie-charcoal/35 hover:text-arlie-charcoal/60"
            }`}
          >
            {label}
          </button>
        )
      )}
    </div>
  );
}
