/**
 * Prisma Client Singleton
 *
 * Next.js hot-reload sırasında birden fazla PrismaClient
 * instance oluşmasını önlemek için globalThis üzerinde saklanır.
 *
 * Production'da her zaman tek bir instance kullanılır.
 * Development'ta ise hot-reload sonrası mevcut instance yeniden kullanılır.
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
