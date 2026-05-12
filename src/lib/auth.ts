/**
 * Arlie — Auth.js v5 Configuration
 *
 * Credentials provider ile JWT tabanlı authentication.
 * Prisma Adapter ile veritabanı entegrasyonu.
 *
 * Güvenlik prensipleri (skill'lerden derlenen):
 * - bcrypt password hashing (12 rounds)
 * - Generic error messages (user enumeration önleme)
 * - JWT session strategy (Supabase PgBouncer uyumlu)
 * - Role-based access control (CUSTOMER, ADMIN)
 * - Timing-safe password comparison
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/security";
import { loginSchema } from "@/lib/validation";
import type { Role } from "@prisma/client";

// ────────────────────────────────────────────────────────────
// Type augmentation for Auth.js
// ────────────────────────────────────────────────────────────

declare module "next-auth" {
  interface User {
    role?: Role;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: Role;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}

// ────────────────────────────────────────────────────────────
// Auth.js Configuration
// ────────────────────────────────────────────────────────────

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  // JWT strategy — Supabase PgBouncer (connection pooling) ile uyumlu
  // Database sessions connection pool'u tüketir, JWT bunu önler
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 saat
  },

  pages: {
    signIn: "/auth/login",
    // newUser: "/auth/register", // Auth.js bunu destekler ama biz kendi route'umuzu kullanacağız
  },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "E-posta", type: "email" },
        password: { label: "Şifre", type: "password" },
      },

      async authorize(credentials) {
        // 1. Input validation (Zod)
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;

        // 2. Kullanıcıyı bul
        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            passwordHash: true,
            role: true,
          },
        });

        // Generic error — kullanıcı var mı yok mu belli etme
        if (!user || !user.passwordHash) {
          return null;
        }

        // 3. Şifre doğrulama (timing-safe bcrypt compare)
        const isValid = await verifyPassword(password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        // 4. Kullanıcı bilgilerini döndür (passwordHash hariç)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    /**
     * JWT callback — token'a user bilgilerini ekle
     * İlk login'de user objesi gelir, sonraki isteklerde sadece token
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user.role as Role) ?? "CUSTOMER";
      }
      return token;
    },

    /**
     * Session callback — token'dan session'a bilgi aktar
     * Client-side'da session.user.id ve session.user.role erişilebilir
     */
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },

  // Güvenlik: production'da hata detaylarını gizle
  debug: process.env.NODE_ENV === "development",
});
