/**
 * Arlie — User Profile API Route
 *
 * GET  /api/user/profile — Profil bilgileri
 * PATCH /api/user/profile — Profil güncelleme
 *
 * Auth required. passwordHash asla döndürülmez.
 */

import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updateProfileSchema } from "@/lib/validation";
import { apiSuccess, apiError } from "@/lib/api-utils";

export const dynamic = "force-dynamic";

/**
 * GET /api/user/profile
 * Kullanıcı profil bilgilerini döndürür (passwordHash hariç)
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
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return apiError("Kullanıcı bulunamadı.", {
        status: 404,
        code: "NOT_FOUND",
      });
    }

    return apiSuccess({ user });
  } catch (error) {
    console.error("[Profile GET] Error:", error);
    return apiError("Profil bilgileri alınamadı.", {
      status: 500,
      code: "INTERNAL_ERROR",
    });
  }
}

/**
 * PATCH /api/user/profile
 * Profil güncelleme (name, phone)
 */
export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return apiError("Oturum açmanız gerekiyor.", {
      status: 401,
      code: "UNAUTHORIZED",
    });
  }

  try {
    const body = await request.json();
    const parsed = updateProfileSchema.safeParse(body);

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

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: parsed.data,
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        phone: true,
        role: true,
        updatedAt: true,
      },
    });

    return apiSuccess({ user });
  } catch (error) {
    console.error("[Profile PATCH] Error:", error);
    return apiError("Profil güncellenemedi.", {
      status: 500,
      code: "INTERNAL_ERROR",
    });
  }
}
