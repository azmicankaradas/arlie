/**
 * Arlie — Security Utilities
 *
 * Güvenlik yardımcı fonksiyonları:
 * - Password hashing (bcrypt, 12 rounds)
 * - XSS sanitization
 * - Secure token generation
 * - Rate limiting (in-memory, Redis'e upgrade edilebilir)
 *
 * OWASP Top 10 korumalarını destekler.
 */

import { hash, compare } from "bcryptjs";
import { randomBytes } from "crypto";

// ────────────────────────────────────────────────────────────
// Password Hashing
// ────────────────────────────────────────────────────────────

const BCRYPT_SALT_ROUNDS = 12;

/**
 * Şifreyi bcrypt ile hash'ler.
 * Salt rounds: 12 (güvenlik-performans dengesi)
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, BCRYPT_SALT_ROUNDS);
}

/**
 * Şifreyi hash ile karşılaştırır (timing-safe).
 * bcrypt.compare zaten timing-safe'dir.
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}

// ────────────────────────────────────────────────────────────
// Token Generation
// ────────────────────────────────────────────────────────────

/**
 * Kriptografik olarak güvenli rastgele token üretir.
 * @param bytes Token byte uzunluğu (varsayılan: 32 = 256 bit)
 * @returns Base64url encoded token
 */
export function generateSecureToken(bytes: number = 32): string {
  return randomBytes(bytes)
    .toString("base64url");
}

// ────────────────────────────────────────────────────────────
// Input Sanitization
// ────────────────────────────────────────────────────────────

/**
 * HTML özel karakterlerini escape eder (XSS koruması).
 * Bu, kullanıcı girdisinin HTML bağlamında güvenli olmasını sağlar.
 *
 * Not: React zaten JSX içinde otomatik escape yapar.
 * Bu fonksiyon, API response'larında ve log'larda ekstra koruma sağlar.
 */
export function sanitizeHtml(input: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };
  return input.replace(/[&<>"'/]/g, (char) => map[char] || char);
}

/**
 * Nesne içindeki tüm string değerlerini sanitize eder.
 * API response'ları için kullanılır.
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj };
  for (const key of Object.keys(sanitized)) {
    const value = sanitized[key];
    if (typeof value === "string") {
      (sanitized as Record<string, unknown>)[key] = sanitizeHtml(value);
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      (sanitized as Record<string, unknown>)[key] = sanitizeObject(
        value as Record<string, unknown>
      );
    }
  }
  return sanitized;
}

// ────────────────────────────────────────────────────────────
// Rate Limiting
// ────────────────────────────────────────────────────────────

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  /** Pencere süresi (milisaniye cinsinden) */
  windowMs: number;
  /** Pencere içindeki maksimum istek sayısı */
  maxRequests: number;
}

interface RateLimitResult {
  allowed: boolean;
  /** Kalan istek hakkı */
  remaining: number;
  /** Rate limit sıfırlanma zamanı (Unix timestamp, saniye) */
  resetTime: number;
  /** Toplam limit */
  limit: number;
}

/**
 * In-memory rate limiter.
 *
 * NOT: Bu, tek sunucu senaryoları için uygundur.
 * Production'da birden fazla instance varsa Redis kullanılmalıdır.
 *
 * Otomatik temizleme: Süresi geçmiş girdiler düzenli olarak silinir.
 */
export class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private config: RateLimitConfig;
  private cleanupInterval: ReturnType<typeof setInterval>;

  constructor(config: RateLimitConfig) {
    this.config = config;

    // 60 saniyede bir süresi geçmiş girdileri temizle
    this.cleanupInterval = setInterval(() => this.cleanup(), 60_000);

    // Node.js process'in kapanmasını engellemesini önle
    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref();
    }
  }

  /**
   * Verilen key için rate limit kontrolü yapar.
   * @param key Benzersiz tanımlayıcı (genellikle IP adresi veya user ID)
   */
  check(key: string): RateLimitResult {
    const now = Date.now();
    const entry = this.store.get(key);

    // Yeni giriş veya süresi geçmiş
    if (!entry || now > entry.resetTime) {
      const resetTime = now + this.config.windowMs;
      this.store.set(key, { count: 1, resetTime });
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: Math.ceil(resetTime / 1000),
        limit: this.config.maxRequests,
      };
    }

    // Limit dahilinde
    entry.count += 1;
    if (entry.count <= this.config.maxRequests) {
      return {
        allowed: true,
        remaining: this.config.maxRequests - entry.count,
        resetTime: Math.ceil(entry.resetTime / 1000),
        limit: this.config.maxRequests,
      };
    }

    // Limit aşıldı
    return {
      allowed: false,
      remaining: 0,
      resetTime: Math.ceil(entry.resetTime / 1000),
      limit: this.config.maxRequests,
    };
  }

  /** Süresi geçmiş girdileri temizler */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }

  /** Rate limiter'ı durdurur (test cleanup için) */
  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.store.clear();
  }
}

// ────────────────────────────────────────────────────────────
// Önceden Yapılandırılmış Rate Limiter'lar
// ────────────────────────────────────────────────────────────

/** Auth endpoint'leri: 5 istek / 15 dakika */
export const authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 dakika
  maxRequests: 5,
});

/** Genel API endpoint'leri: 100 istek / 15 dakika */
export const apiRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 dakika
  maxRequests: 100,
});

/** Hassas işlemler (şifre değiştirme vb.): 3 istek / 30 dakika */
export const sensitiveRateLimiter = new RateLimiter({
  windowMs: 30 * 60 * 1000, // 30 dakika
  maxRequests: 3,
});
