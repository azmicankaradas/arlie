/**
 * Arlie — Orders API Route
 *
 * GET  /api/orders — Kullanıcının siparişleri (auth required)
 * POST /api/orders — Yeni sipariş oluşturma (auth required)
 *
 * Güvenlik:
 * - Auth required (session kontrolü)
 * - Sadece kendi siparişlerini görebilir
 * - Zod validation (createOrderSchema, orderQuerySchema)
 * - Stock check before order
 * - Rate limiting (general API limiter)
 */

import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createOrderSchema, orderQuerySchema } from "@/lib/validation";
import { apiSuccess, apiError } from "@/lib/api-utils";

export const dynamic = "force-dynamic";

/**
 * GET /api/orders
 * Kullanıcının siparişlerini listeler (pagination + status filter)
 */
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return apiError("Oturum açmanız gerekiyor.", {
      status: 401,
      code: "UNAUTHORIZED",
    });
  }

  // Query params validation
  const searchParams = Object.fromEntries(
    request.nextUrl.searchParams.entries()
  );
  const parsed = orderQuerySchema.safeParse(searchParams);

  if (!parsed.success) {
    return apiError("Geçersiz sorgu parametreleri.", {
      status: 400,
      code: "INVALID_QUERY",
    });
  }

  const { page, limit, status } = parsed.data;

  try {
    const where = {
      userId: session.user.id,
      ...(status && { status }),
    };

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  slug: true,
                  name: true,
                  images: true,
                },
              },
            },
          },
          address: true,
        },
      }),
    ]);

    // Decimal → number dönüşümü
    const serialized = orders.map((order) => ({
      ...order,
      total: Number(order.total),
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
    }));

    return apiSuccess(serialized, {
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[Orders GET] Error:", error);
    return apiError("Siparişler alınamadı.", {
      status: 500,
      code: "INTERNAL_ERROR",
    });
  }
}

/**
 * POST /api/orders
 * Yeni sipariş oluşturur
 *
 * Flow:
 * 1. Auth kontrolü
 * 2. Input validation (createOrderSchema)
 * 3. Ürün ve stok kontrolü
 * 4. Toplam fiyat hesaplama (server-side — client'a güvenme)
 * 5. Transaction ile sipariş oluşturma
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return apiError("Oturum açmanız gerekiyor.", {
      status: 401,
      code: "UNAUTHORIZED",
    });
  }

  // Body validation
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("Geçersiz JSON formatı.", {
      status: 400,
      code: "INVALID_JSON",
    });
  }

  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    const details: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".") || "_root";
      if (!details[path]) details[path] = [];
      details[path].push(issue.message);
    }

    return apiError("Doğrulama hatası.", {
      status: 422,
      code: "VALIDATION_ERROR",
      details,
    });
  }

  const { items, addressId, note } = parsed.data;

  try {
    // 1. Adres ownership kontrolü
    const address = await prisma.address.findUnique({
      where: { id: addressId },
      select: { userId: true },
    });

    if (!address || address.userId !== session.user.id) {
      return apiError("Geçersiz teslimat adresi.", {
        status: 400,
        code: "INVALID_ADDRESS",
      });
    }

    // 2. Ürünleri çek ve stok kontrolü yap
    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, price: true, inStock: true },
    });

    // Tüm ürünler bulundu mu?
    if (products.length !== productIds.length) {
      return apiError("Bir veya daha fazla ürün bulunamadı.", {
        status: 400,
        code: "PRODUCTS_NOT_FOUND",
      });
    }

    // Stok kontrolü
    const outOfStock = products.filter((p) => !p.inStock);
    if (outOfStock.length > 0) {
      return apiError(
        `Stokta olmayan ürünler: ${outOfStock.map((p) => p.name).join(", ")}`,
        {
          status: 400,
          code: "OUT_OF_STOCK",
        }
      );
    }

    // 3. Toplam fiyat hesapla (SERVER-SIDE — client'a güvenme)
    const productMap = new Map(products.map((p) => [p.id, p]));
    let total = 0;
    const orderItems = items.map((item) => {
      const product = productMap.get(item.productId)!;
      const itemPrice = Number(product.price);
      total += itemPrice * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: itemPrice,
      };
    });

    // 4. Transaction ile sipariş oluştur
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          addressId,
          total,
          note: note ?? null,
          status: "PENDING",
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  slug: true,
                  name: true,
                  images: true,
                },
              },
            },
          },
          address: true,
        },
      });

      return newOrder;
    });

    // Decimal → number dönüşümü
    const serialized = {
      ...order,
      total: Number(order.total),
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
    };

    return apiSuccess({ order: serialized }, { status: 201 });
  } catch (error) {
    console.error("[Orders POST] Error:", error);
    return apiError("Sipariş oluşturulamadı.", {
      status: 500,
      code: "INTERNAL_ERROR",
    });
  }
}
