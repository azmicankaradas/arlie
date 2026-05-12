/**
 * Prisma Configuration
 *
 * Prisma CLI varsayılan olarak sadece .env dosyasını okur.
 * Next.js projesinde .env.local kullanıldığı için dotenv ile
 * bu dosyayı açıkça yüklüyoruz.
 */

import path from "node:path";
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

// .env.local dosyasını yükle (Next.js convention)
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

export default defineConfig({
  schema: path.resolve(process.cwd(), "prisma/schema.prisma"),
});
