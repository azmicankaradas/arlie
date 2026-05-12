/**
 * Arlie — User Address Detail API Route
 *
 * PUT    /api/user/addresses/:id — Adres güncelleme
 * DELETE /api/user/addresses/:id — Adres silme
 *
 * Auth required. Ownership kontrolü (sadece kendi adresini yönetebilir).
 */

import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { addressSchema } from "@/lib/validation";
import { apiSuccess, apiError } from "@/lib/api-utils";

export const dynamic = "force-dynamic";

/**
 * PUT /api/user/addresses/:id
 * Adres günceller (ownership kontrolü ile)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return apiError("Oturum açmanız gerekiyor.", {
      status: 401,
      code: "UNAUTHORIZED",
    });
  }

  const { id } = await params;

  try {
    // Ownership kontrolü
    const existing = await prisma.address.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      return apiError("Adres bulunamadı.", {
        status: 404,
        code: "NOT_FOUND",
      });
    }

    if (existing.userId !== session.user.id) {
      return apiError("Bu adrese erişim yetkiniz yok.", {
        status: 403,
        code: "FORBIDDEN",
      });
    }

    // Validation
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

    // Varsayılan adres yönetimi
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id, isDefault: true, NOT: { id } },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data: {
        ...addressData,
        isDefault: isDefault ?? false,
      },
    });

    return apiSuccess({ address });
  } catch (error) {
    console.error("[Address PUT] Error:", error);
    return apiError("Adres güncellenemedi.", {
      status: 500,
      code: "INTERNAL_ERROR",
    });
  }
}

/**
 * DELETE /api/user/addresses/:id
 * Adres siler (ownership kontrolü ile)
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return apiError("Oturum açmanız gerekiyor.", {
      status: 401,
      code: "UNAUTHORIZED",
    });
  }

  const { id } = await params;

  try {
    // Ownership kontrolü
    const existing = await prisma.address.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      return apiError("Adres bulunamadı.", {
        status: 404,
        code: "NOT_FOUND",
      });
    }

    if (existing.userId !== session.user.id) {
      return apiError("Bu adrese erişim yetkiniz yok.", {
        status: 403,
        code: "FORBIDDEN",
      });
    }

    await prisma.address.delete({ where: { id } });

    return apiSuccess({ message: "Adres başarıyla silindi." });
  } catch (error) {
    console.error("[Address DELETE] Error:", error);
    return apiError("Adres silinemedi.", {
      status: 500,
      code: "INTERNAL_ERROR",
    });
  }
}
