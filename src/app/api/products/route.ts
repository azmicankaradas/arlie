/**
 * Arlie — Products API Route
 *
 * GET /api/products — Ürün listesi
 *
 * Public endpoint (auth gerektirmez):
 * - Pagination (page, limit)
 * - Category filtreleme
 * - Sorting (price_asc, price_desc, newest, oldest, name_asc)
 * - Search (isim bazlı)
 * - Featured / inStock filtreleri
 * - Zod query validation (productQuerySchema)
 * - Response caching headers
 */

import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { productQuerySchema } from "@/lib/validation";
import { apiSuccess, apiError, withValidation } from "@/lib/api-utils";
import type { Product } from "@/types/product";
import type { Prisma } from "@prisma/client";

// Statik fallback (data.ts'den import etmek yerine inline — circular dependency önleme)
import { products as staticProducts } from "@/lib/data";

/**
 * Prisma ürünü → frontend Product tipine dönüştür
 */
function toProduct(dbProduct: {
  id: string;
  slug: string;
  name: string;
  description: string;
  story: string;
  price: unknown;
  category: string;
  materials: string[];
  sustainability: string;
  images: string[];
  inStock: boolean;
  featured: boolean;
}): Product {
  return {
    id: dbProduct.id,
    slug: dbProduct.slug,
    name: dbProduct.name,
    description: dbProduct.description,
    story: dbProduct.story,
    price: Number(dbProduct.price),
    category: dbProduct.category as Product["category"],
    materials: dbProduct.materials,
    sustainability: dbProduct.sustainability,
    images: dbProduct.images,
    inStock: dbProduct.inStock,
    featured: dbProduct.featured,
  };
}

const handler = withValidation(productQuerySchema, async (_request, { validatedData }) => {
  const {
    category,
    page = 1,
    limit = 12,
    sort = "newest",
    search,
    featured,
    inStock,
  } = validatedData;

  try {
    // Prisma ile veritabanından çek
    if (process.env.DATABASE_URL) {
      try {
        // WHERE koşulları
        const where: Prisma.ProductWhereInput = {};
        if (category) where.category = category;
        if (featured !== undefined) where.featured = featured;
        if (inStock !== undefined) where.inStock = inStock;
        if (search) {
          where.name = { contains: search, mode: "insensitive" };
        }

        // Sıralama
        const orderBy: Prisma.ProductOrderByWithRelationInput = (() => {
          switch (sort) {
            case "price_asc":
              return { price: "asc" as const };
            case "price_desc":
              return { price: "desc" as const };
            case "newest":
              return { createdAt: "desc" as const };
            case "oldest":
              return { createdAt: "asc" as const };
            case "name_asc":
              return { name: "asc" as const };
            default:
              return { createdAt: "desc" as const };
          }
        })();

        // Toplam sayı ve ürünler (parallel)
        const [total, products] = await Promise.all([
          prisma.product.count({ where }),
          prisma.product.findMany({
            where,
            orderBy,
            skip: (page - 1) * limit,
            take: limit,
          }),
        ]);

        return apiSuccess(products.map(toProduct), {
          meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          },
        });
      } catch (dbError) {
        console.warn("[Products API] DB sorgusu başarısız, fallback kullanılıyor:", dbError);
      }
    }

    // Statik fallback
    let filtered = [...staticProducts];

    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (featured !== undefined) {
      filtered = filtered.filter((p) => p.featured === featured);
    }
    if (inStock !== undefined) {
      filtered = filtered.filter((p) => p.inStock === inStock);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(q));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sort) {
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "name_asc":
          return a.name.localeCompare(b.name, "tr");
        case "oldest":
          return 0; // Statik veride createdAt yok
        case "newest":
        default:
          return 0;
      }
    });

    const total = filtered.length;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return apiSuccess(paginated, {
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("[Products API] Error:", error);
    return apiError("Ürünler alınamadı.", {
      status: 500,
      code: "INTERNAL_ERROR",
    });
  }
});

export async function GET(request: NextRequest) {
  return handler(request);
}
