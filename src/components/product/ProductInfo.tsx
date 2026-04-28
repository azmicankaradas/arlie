import type { Product } from "@/types/product";
import { CATEGORIES } from "@/types/product";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="space-y-8">
      {/* Category */}
      <p className="font-sans text-xs uppercase tracking-[0.25em] text-arlie-charcoal/40">
        {CATEGORIES[product.category]}
      </p>

      {/* Name & Price */}
      <div className="space-y-3">
        <h1 className="font-serif text-3xl md:text-4xl tracking-tight">
          {product.name}
        </h1>
        <p className="font-sans text-lg md:text-xl tabular-nums">
          {product.price.toLocaleString("tr-TR")} ₺
        </p>
      </div>

      {/* Description */}
      <p className="font-sans text-base leading-relaxed text-arlie-charcoal/70">
        {product.description}
      </p>

      {/* Story */}
      <div className="space-y-3 pt-4 border-t border-arlie-beige/50">
        <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-arlie-charcoal/40">
          Hikaye
        </h3>
        <p className="font-sans text-sm leading-relaxed text-arlie-charcoal/60">
          {product.story}
        </p>
      </div>

      {/* Materials */}
      <div className="space-y-3 pt-4 border-t border-arlie-beige/50">
        <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-arlie-charcoal/40">
          Malzeme
        </h3>
        <div className="flex flex-wrap gap-2">
          {product.materials.map((mat) => (
            <span
              key={mat}
              className="font-sans text-xs px-3 py-1.5 bg-arlie-light text-arlie-charcoal/70 rounded-sm"
            >
              {mat}
            </span>
          ))}
        </div>
      </div>

      {/* Sustainability */}
      <div className="space-y-3 pt-4 border-t border-arlie-beige/50">
        <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-arlie-charcoal/40">
          Sürdürülebilirlik
        </h3>
        <p className="font-sans text-sm leading-relaxed text-arlie-charcoal/60">
          {product.sustainability}
        </p>
      </div>
    </div>
  );
}
