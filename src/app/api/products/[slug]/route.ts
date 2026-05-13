/**
 * Arlie — Product Detail API Route
 *
 * GET /api/products/:slug — Tek ürün detayı
 *
 * Public endpoint (auth gerektirmez):
 * - Slug bazlı ürün çekme
 * - 404 handling
 * - Response caching headers
 */

import type { NextRequest } from "next/server";
import { getProductBySlug } from "@/lib/data";
import { apiSuccess, apiError } from "@/lib/api-utils";

/**
 * GET /api/products/:slug
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Slug validation
  if (!slug || typeof slug !== "string" || slug.length > 200) {
    return apiError("Geçersiz ürün slug'ı.", {
      status: 400,
      code: "INVALID_SLUG",
    });
  }

  try {
    const product = await getProductBySlug(slug);

    if (!product) {
      return apiError("Ürün bulunamadı.", {
        status: 404,
        code: "NOT_FOUND",
      });
    }

    return apiSuccess(
      { product },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("[Product Detail API] Error:", error);
    return apiError("Ürün bilgisi alınamadı.", {
      status: 500,
      code: "INTERNAL_ERROR",
    });
  }
}
