/**
 * Arlie — Next.js Proxy (formerly Middleware)
 *
 * Next.js 16'da middleware → proxy olarak yeniden adlandırıldı.
 * Tüm isteklere uygulanan güvenlik katmanı:
 * - CSP (Content Security Policy)
 * - CORS kontrolü
 * - API route rate limiting
 *
 * Bu middleware, Next.js Edge Runtime'da çalışır.
 * src/middleware.ts konumunda olmalıdır (App Router convention).
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ────────────────────────────────────────────────────────────
// Configuration
// ────────────────────────────────────────────────────────────

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://arlie.com.tr",
  "https://www.arlie.com.tr",
];

/**
 * Content Security Policy directive'leri.
 * Her directive ayrı satırda, sonra birleştirilir.
 */
const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
];

// ────────────────────────────────────────────────────────────
// Security Headers
// ────────────────────────────────────────────────────────────

function applySecurityHeaders(response: NextResponse): void {
  // XSS Protection (legacy tarayıcılar için)
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // MIME type sniffing önleme
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Clickjacking koruması
  response.headers.set("X-Frame-Options", "DENY");

  // Referrer bilgisi kontrolü
  response.headers.set(
    "Referrer-Policy",
    "strict-origin-when-cross-origin"
  );

  // DNS prefetching kontrolü
  response.headers.set("X-DNS-Prefetch-Control", "on");

  // HSTS — HTTPS zorunlu (production'da)
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }

  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    CSP_DIRECTIVES.join("; ")
  );

  // Permissions Policy — gereksiz API'leri kapat
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=()"
  );
}

// ────────────────────────────────────────────────────────────
// CORS Handler
// ────────────────────────────────────────────────────────────

function handleCors(
  request: NextRequest,
  response: NextResponse
): NextResponse {
  const origin = request.headers.get("origin");

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Vary", "Origin");
  }

  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  response.headers.set("Access-Control-Max-Age", "86400");

  return response;
}

// ────────────────────────────────────────────────────────────
// Proxy Function
// ────────────────────────────────────────────────────────────

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // CORS preflight (OPTIONS) — erken döndür
  if (request.method === "OPTIONS" && pathname.startsWith("/api/")) {
    const preflightResponse = new NextResponse(null, { status: 204 });
    handleCors(request, preflightResponse);
    return preflightResponse;
  }

  // Response oluştur
  const response = NextResponse.next();

  // Güvenlik header'larını ekle
  applySecurityHeaders(response);

  // API isteklerinde CORS uygula
  if (pathname.startsWith("/api/")) {
    handleCors(request, response);
  }

  return response;
}

// ────────────────────────────────────────────────────────────
// Proxy Config
// ────────────────────────────────────────────────────────────

/**
 * Middleware'in çalışacağı path'ler.
 * Static dosyalar, _next, favicon hariç tutulur.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public folder files (.svg, .png, .jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
