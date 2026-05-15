/**
 * Arlie — Health Check API Route
 *
 * GET /api/health
 *
 * Deployment platformları (Vercel, Railway, etc.) için
 * uygulama durumu kontrol endpoint'i.
 *
 * Döndürdüğü bilgiler:
 * - status: "ok" | "degraded"
 * - version: package.json'dan
 * - uptime: process uptime (saniye)
 * - timestamp: ISO 8601
 * - environment: NODE_ENV
 * - database: bağlantı durumu (opsiyonel)
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Cache'lemeyi devre dışı bırak — her zaman gerçek zamanlı durum
export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: Request) {
  const startTime = Date.now();

  // DB bağlantı kontrolü (2 saniye timeout)
  let dbStatus: "connected" | "disconnected" | "unknown" = "unknown";
  try {
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("DB timeout")), 2000)
      ),
    ]);
    dbStatus = "connected";
  } catch {
    dbStatus = "disconnected";
  }

  const responseTime = Date.now() - startTime;

  const health = {
    status: dbStatus === "connected" ? "ok" : "degraded",
    version: process.env.npm_package_version ?? "0.2.0",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? "unknown",
    database: dbStatus,
    responseTime: `${responseTime}ms`,
  };

  return NextResponse.json(health, {
    status: health.status === "ok" ? 200 : 503,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
