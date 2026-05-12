/**
 * Arlie — User Addresses API Route
 *
 * GET  /api/user/addresses — Kullanıcının adresleri
 * POST /api/user/addresses — Yeni adres ekleme
 *
 * Auth required. Sadece kendi adreslerini görebilir/ekleyebilir.
 */

import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { addressSchema } from "@/lib/validation";
import { apiSuccess, apiError } from "@/lib/api-utils";

export const dynamic = "force-dynamic";

/**
 * GET /api/user/addresses
 * Kullanıcının tüm adreslerini döndürür
 */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return apiError("Oturum açmanız gerekiyor.", {
      status: 401,
      code: "UNAUTHORIZED",
    });
  }

  try {
    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { isDefault: "desc" },
        { createdAt: "desc" },
      ],
    });

    return apiSuccess({ addresses });
  } catch (error) {
    console.error("[Addresses GET] Error:", error);
    return apiError("Adresler alınamadı.", {
      status: 500,
      code: "INTERNAL_ERROR",
    });
  }
}

/**
 * POST /api/user/addresses
 * Yeni adres ekler
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return apiError("Oturum açmanız gerekiyor.", {
      status: 401,
      code: "UNAUTHORIZED",
    });
  }

  try {
    const body = await request.json();
    const parsed = addressSchema.safeParse(body);

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

    const { isDefault, ...addressData } = parsed.data;

    // Eğer bu adres varsayılan yapılıyorsa, diğerlerini kaldır
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        ...addressData,
        isDefault: isDefault ?? false,
        userId: session.user.id,
      },
    });

    return apiSuccess({ address }, { status: 201 });
  } catch (error) {
    console.error("[Addresses POST] Error:", error);
    return apiError("Adres eklenemedi.", {
      status: 500,
      code: "INTERNAL_ERROR",
    });
  }
}
