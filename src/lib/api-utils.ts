/**
 * Arlie — API Utilities
 *
 * API response standardizasyonu ve middleware wrapper'ları.
 * Tüm API endpoint'leri bu helper'ları kullanarak tutarlı
 * response formatı, hata yönetimi ve güvenlik sağlar.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ZodError, type ZodSchema } from "zod";
import type { RateLimiter } from "@/lib/security";

// ────────────────────────────────────────────────────────────
// Response Types
// ────────────────────────────────────────────────────────────

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: Record<string, string[]>;
  };
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// ────────────────────────────────────────────────────────────
// Response Helpers
// ────────────────────────────────────────────────────────────

/**
 * Başarılı API response oluşturur.
 * Tutarlı format: { success: true, data: T, meta?: {...} }
 */
export function apiSuccess<T>(
  data: T,
  options?: {
    status?: number;
    headers?: HeadersInit;
    meta?: ApiSuccessResponse["meta"];
  }
): NextResponse<ApiSuccessResponse<T>> {
  const body: ApiSuccessResponse<T> = { success: true, data };
  if (options?.meta) {
    body.meta = options.meta;
  }
  return NextResponse.json(body, {
    status: options?.status ?? 200,
    headers: options?.headers,
  });
}

/**
 * Hata API response oluşturur.
 * Stack trace ve dahili hata detayları asla client'a gönderilmez.
 */
export function apiError(
  message: string,
  options?: {
    status?: number;
    code?: string;
    details?: Record<string, string[]>;
    headers?: HeadersInit;
  }
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        ...(options?.code && { code: options.code }),
        ...(options?.details && { details: options.details }),
      },
    },
    {
      status: options?.status ?? 400,
      headers: options?.headers,
    }
  );
}

// ────────────────────────────────────────────────────────────
// Error Formatters
// ────────────────────────────────────────────────────────────

/**
 * Zod hata mesajlarını field bazlı düzenli bir formata dönüştürür.
 * { fieldName: ["error message 1", "error message 2"] }
 */
function formatZodErrors(error: ZodError): Record<string, string[]> {
  const details: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".") || "_root";
    if (!details[path]) {
      details[path] = [];
    }
    details[path].push(issue.message);
  }
  return details;
}

// ────────────────────────────────────────────────────────────
// IP Helper
// ────────────────────────────────────────────────────────────

/**
 * Request'ten IP adresini çıkarır.
 * Proxy/load balancer arkasındayken X-Forwarded-For header'ını kullanır.
 */
export function getClientIp(request: NextRequest | Request): string {
  // NextRequest has headers directly accessible
  const forwarded =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip");

  if (forwarded) {
    // X-Forwarded-For birden fazla IP içerebilir (client, proxy1, proxy2)
    return forwarded.split(",")[0].trim();
  }

  return "unknown";
}

// ────────────────────────────────────────────────────────────
// Middleware Wrappers
// ────────────────────────────────────────────────────────────

type RouteHandler = (
  request: NextRequest,
  context?: { params: Promise<Record<string, string>> }
) => Promise<NextResponse>;

/**
 * Zod validation middleware wrapper.
 *
 * Request body'yi belirtilen schema ile validate eder.
 * Hata durumunda detaylı field-bazlı hata mesajları döner.
 *
 * @example
 * export const POST = withValidation(loginSchema, async (req, { validatedData }) => {
 *   // validatedData tipli ve doğrulanmış
 * });
 */
export function withValidation<T>(
  schema: ZodSchema<T>,
  handler: (
    request: NextRequest,
    extra: {
      validatedData: T;
      params?: Promise<Record<string, string>>;
    }
  ) => Promise<NextResponse>
): RouteHandler {
  return async (request, context) => {
    try {
      let rawData: unknown;

      // GET request → URL search params
      if (request.method === "GET") {
        const searchParams = Object.fromEntries(
          request.nextUrl.searchParams.entries()
        );
        rawData = searchParams;
      } else {
        // POST/PUT/PATCH → JSON body
        try {
          rawData = await request.json();
        } catch {
          return apiError("Geçersiz JSON formatı", {
            status: 400,
            code: "INVALID_JSON",
          });
        }
      }

      const result = schema.safeParse(rawData);

      if (!result.success) {
        return apiError("Doğrulama hatası", {
          status: 422,
          code: "VALIDATION_ERROR",
          details: formatZodErrors(result.error),
        });
      }

      return handler(request, {
        validatedData: result.data,
        params: context?.params,
      });
    } catch (error) {
      console.error("[API] Validation wrapper error:", error);
      return apiError("Sunucu hatası", { status: 500, code: "INTERNAL_ERROR" });
    }
  };
}

/**
 * Rate limiting middleware wrapper.
 *
 * IP bazlı rate limiting uygular.
 * Aşılırsa 429 Too Many Requests döner.
 * Response header'larına rate limit bilgisi eklenir.
 *
 * @example
 * export const POST = withRateLimit(authRateLimiter, async (req) => {
 *   // Rate limit kontrolünden geçmiş request
 * });
 */
export function withRateLimit(
  limiter: RateLimiter,
  handler: RouteHandler
): RouteHandler {
  return async (request, context) => {
    const ip = getClientIp(request);
    const result = limiter.check(ip);

    const rateLimitHeaders: HeadersInit = {
      "X-RateLimit-Limit": result.limit.toString(),
      "X-RateLimit-Remaining": result.remaining.toString(),
      "X-RateLimit-Reset": result.resetTime.toString(),
    };

    if (!result.allowed) {
      return apiError("Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyiniz.", {
        status: 429,
        code: "RATE_LIMIT_EXCEEDED",
        headers: {
          ...rateLimitHeaders,
          "Retry-After": Math.ceil(
            (result.resetTime * 1000 - Date.now()) / 1000
          ).toString(),
        },
      });
    }

    const response = await handler(request, context);

    // Rate limit header'larını response'a ekle
    for (const [key, value] of Object.entries(rateLimitHeaders)) {
      response.headers.set(key, value);
    }

    return response;
  };
}

/**
 * Birden fazla middleware'i zincirler.
 *
 * @example
 * export const POST = compose(
 *   (handler) => withRateLimit(authRateLimiter, handler),
 *   (handler) => withAuth(handler),
 * )(actualHandler);
 */
export function compose(
  ...wrappers: Array<(handler: RouteHandler) => RouteHandler>
): (handler: RouteHandler) => RouteHandler {
  return (handler) =>
    wrappers.reduceRight((acc, wrapper) => wrapper(acc), handler);
}
