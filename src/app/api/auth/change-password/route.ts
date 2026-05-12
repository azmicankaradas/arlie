/**
 * Arlie — Change Password API Route
 *
 * POST /api/auth/change-password
 *
 * Şifre değiştirme (auth required):
 * - Session kontrolü
 * - Mevcut şifre doğrulama
 * - Yeni şifre validation (changePasswordSchema)
 * - bcrypt hash ile güncelleme
 * - Rate limiting (3 req / 30 min — hassas işlem)
 */

import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword, sensitiveRateLimiter } from "@/lib/security";
import { changePasswordSchema } from "@/lib/validation";
import {
  apiSuccess,
  apiError,
  withValidation,
  withRateLimit,
  compose,
} from "@/lib/api-utils";

export const dynamic = "force-dynamic";

const handler = compose(
  (h) => withRateLimit(sensitiveRateLimiter, h),
)(
  withValidation(changePasswordSchema, async (_request, { validatedData }) => {
    // 1. Auth kontrolü
    const session = await auth();
    if (!session?.user?.id) {
      return apiError("Oturum açmanız gerekiyor.", {
        status: 401,
        code: "UNAUTHORIZED",
      });
    }

    const { currentPassword, newPassword } = validatedData;

    try {
      // 2. Kullanıcıyı bul
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, passwordHash: true },
      });

      if (!user || !user.passwordHash) {
        return apiError("İşlem gerçekleştirilemedi.", {
          status: 400,
          code: "INVALID_REQUEST",
        });
      }

      // 3. Mevcut şifre doğrula
      const isCurrentValid = await verifyPassword(currentPassword, user.passwordHash);
      if (!isCurrentValid) {
        return apiError("Mevcut şifre hatalı.", {
          status: 400,
          code: "INVALID_PASSWORD",
        });
      }

      // 4. Yeni şifre hash'le ve güncelle
      const newHash = await hashPassword(newPassword);
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: newHash },
      });

      return apiSuccess({ message: "Şifreniz başarıyla güncellendi." });
    } catch (error) {
      console.error("[ChangePassword] Error:", error);
      return apiError("Şifre değiştirme sırasında bir hata oluştu.", {
        status: 500,
        code: "INTERNAL_ERROR",
      });
    }
  })
);

export async function POST(request: NextRequest) {
  return handler(request);
}
