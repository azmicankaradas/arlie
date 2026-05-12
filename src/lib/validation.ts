/**
 * Arlie — Zod Validation Schemas
 *
 * Tüm API endpoint'leri için input validation şemaları.
 * Her schema, hem server-side API route'larında hem de
 * (ileride) client-side form validation'da kullanılabilir.
 *
 * Güvenlik prensibi: "Never trust user input."
 */

import { z } from "zod";

// ────────────────────────────────────────────────────────────
// Ortak Yardımcılar
// ────────────────────────────────────────────────────────────

const emailSchema = z
  .string()
  .email("Geçerli bir e-posta adresi giriniz")
  .max(255, "E-posta 255 karakteri geçemez")
  .transform((v) => v.toLowerCase().trim());

/**
 * Güvenli şifre kuralları:
 * - Minimum 8 karakter
 * - En az 1 büyük harf
 * - En az 1 küçük harf
 * - En az 1 rakam
 */
const passwordSchema = z
  .string()
  .min(8, "Şifre en az 8 karakter olmalıdır")
  .max(128, "Şifre 128 karakteri geçemez")
  .regex(/[A-Z]/, "Şifre en az bir büyük harf içermelidir")
  .regex(/[a-z]/, "Şifre en az bir küçük harf içermelidir")
  .regex(/[0-9]/, "Şifre en az bir rakam içermelidir");

// ────────────────────────────────────────────────────────────
// Auth Schemas
// ────────────────────────────────────────────────────────────

/** POST /api/auth/login */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Şifre gereklidir").max(128),
});

/** POST /api/auth/register */
export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    name: z
      .string()
      .min(2, "İsim en az 2 karakter olmalıdır")
      .max(100, "İsim 100 karakteri geçemez")
      .trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

/** PATCH /api/user/profile */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "İsim en az 2 karakter olmalıdır")
    .max(100, "İsim 100 karakteri geçemez")
    .trim()
    .optional(),
  phone: z
    .string()
    .regex(
      /^\+?[0-9\s()-]{7,20}$/,
      "Geçerli bir telefon numarası giriniz"
    )
    .optional(),
});

/** POST /api/auth/change-password */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mevcut şifre gereklidir"),
    newPassword: passwordSchema,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmNewPassword"],
  });

// ────────────────────────────────────────────────────────────
// Product Schemas
// ────────────────────────────────────────────────────────────

const categoryEnum = z.enum(["rings", "earrings", "necklaces", "bracelets"]);

/** GET /api/products — query parameters */
export const productQuerySchema = z.object({
  category: categoryEnum.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  sort: z
    .enum(["price_asc", "price_desc", "newest", "oldest", "name_asc"])
    .default("newest"),
  search: z.string().max(200).optional(),
  featured: z.coerce.boolean().optional(),
  inStock: z.coerce.boolean().optional(),
});

export type ProductQuery = z.infer<typeof productQuerySchema>;

// ────────────────────────────────────────────────────────────
// Order Schemas
// ────────────────────────────────────────────────────────────

const orderItemSchema = z.object({
  productId: z.string().min(1, "Ürün ID gereklidir"),
  quantity: z.number().int().min(1, "Miktar en az 1 olmalıdır").max(10, "Miktar en fazla 10 olabilir"),
});

/** POST /api/orders */
export const createOrderSchema = z.object({
  items: z
    .array(orderItemSchema)
    .min(1, "Sepette en az 1 ürün olmalıdır")
    .max(20, "Sepette en fazla 20 ürün olabilir"),
  addressId: z.string().min(1, "Teslimat adresi seçiniz"),
  note: z.string().max(500, "Not 500 karakteri geçemez").optional(),
});

/** GET /api/orders — query parameters */
export const orderQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  status: z
    .enum([
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
      "REFUNDED",
    ])
    .optional(),
});

// ────────────────────────────────────────────────────────────
// Address Schemas
// ────────────────────────────────────────────────────────────

/** POST / PUT /api/user/addresses */
export const addressSchema = z.object({
  title: z
    .string()
    .min(1, "Adres başlığı gereklidir")
    .max(50, "Adres başlığı 50 karakteri geçemez")
    .trim(),
  fullName: z
    .string()
    .min(2, "İsim en az 2 karakter olmalıdır")
    .max(100, "İsim 100 karakteri geçemez")
    .trim(),
  phone: z
    .string()
    .regex(
      /^\+?[0-9\s()-]{7,20}$/,
      "Geçerli bir telefon numarası giriniz"
    ),
  line1: z
    .string()
    .min(5, "Adres en az 5 karakter olmalıdır")
    .max(300, "Adres 300 karakteri geçemez")
    .trim(),
  line2: z.string().max(300).optional(),
  city: z
    .string()
    .min(2, "Şehir gereklidir")
    .max(50, "Şehir 50 karakteri geçemez")
    .trim(),
  district: z
    .string()
    .min(2, "İlçe gereklidir")
    .max(50, "İlçe 50 karakteri geçemez")
    .trim(),
  zipCode: z
    .string()
    .regex(/^[0-9]{5}$/, "Posta kodu 5 haneli olmalıdır"),
  isDefault: z.boolean().default(false),
});

// ────────────────────────────────────────────────────────────
// Yardımcı Tipler (Export)
// ────────────────────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type OrderQueryInput = z.infer<typeof orderQuerySchema>;
export type AddressInput = z.infer<typeof addressSchema>;
