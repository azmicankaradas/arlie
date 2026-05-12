/**
 * Arlie — Register API Route
 *
 * POST /api/auth/register
 *
 * Yeni kullanıcı kaydı:
 * - Zod validation (registerSchema)
 * - Email uniqueness kontrolü
 * - bcrypt password hashing (12 rounds)
 * - Rate limiting (5 req / 15 min)
 * - Generic error messages (user enumeration önleme)
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/security";
import { registerSchema } from "@/lib/validation";
import {
  apiSuccess,
  apiError,
  withValidation,
  withRateLimit,
  compose,
} from "@/lib/api-utils";
import { authRateLimiter } from "@/lib/security";

// Force dynamic — auth endpoints should never be cached
export const dynamic = "force-dynamic";

const handler = compose(
  (h) => withRateLimit(authRateLimiter, h),
)(
  withValidation(registerSchema, async (_request, { validatedData }) => {
    const { email, name, password } = validatedData;

    try {
      // 1. Email uniqueness kontrolü
      const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });

      if (existingUser) {
        // Generic error — "bu email zaten kayıtlı" deme
        // OWASP: User enumeration prevention
        return apiError("Kayıt işlemi gerçekleştirilemedi. Lütfen bilgilerinizi kontrol ediniz.", {
          status: 409,
          code: "REGISTRATION_FAILED",
        });
      }

      // 2. Password hash (bcrypt, 12 rounds)
      const passwordHash = await hashPassword(password);

      // 3. Kullanıcı oluştur
      const user = await prisma.user.create({
        data: {
          email,
          name,
          passwordHash,
          role: "CUSTOMER",
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });

      // 4. Başarılı response (passwordHash dahil değil)
      return apiSuccess(
        {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("[Register] Error:", error);
      return apiError("Kayıt sırasında bir hata oluştu.", {
        status: 500,
        code: "INTERNAL_ERROR",
      });
    }
  })
);

export async function POST(request: NextRequest) {
  return handler(request);
}
