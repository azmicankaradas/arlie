"use client";

/**
 * Arlie — Register Page
 *
 * Minimalist, lüks estetikle tasarlanmış kayıt sayfası.
 * Zod validation ile client-side feedback.
 */

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

interface FieldErrors {
  [key: string]: string[];
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Yazarken field error'u temizle
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setIsLoading(true);

    try {
      // 1. Register API'ye gönder
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error?.details) {
          setFieldErrors(data.error.details);
        } else {
          setError(data.error?.message || "Kayıt sırasında bir hata oluştu.");
        }
        return;
      }

      // 2. Başarılı kayıt → otomatik login
      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        // Kayıt başarılı ama login başarısız — login sayfasına yönlendir
        router.push("/auth/login?registered=true");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Kayıt sırasında bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  }

  function getFieldError(field: string): string | undefined {
    return fieldErrors[field]?.[0];
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-arlie-white px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <h1 className="font-serif text-4xl tracking-[0.3em] text-arlie-charcoal">
              ARLIE
            </h1>
          </Link>
          <p className="mt-3 text-sm text-arlie-charcoal/50 tracking-[0.15em] uppercase">
            Hesap Oluşturun
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm rounded"
            >
              {error}
            </motion.div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-xs tracking-[0.15em] uppercase text-arlie-charcoal/60 font-medium"
            >
              Ad Soyad
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-arlie-light border text-arlie-charcoal 
                         placeholder:text-arlie-charcoal/30
                         focus:outline-none focus:border-arlie-gold/50 focus:ring-1 focus:ring-arlie-gold/20
                         transition-all duration-300 text-sm tracking-wide
                         ${getFieldError("name") ? "border-red-300" : "border-arlie-charcoal/10"}`}
              placeholder="Adınız Soyadınız"
            />
            {getFieldError("name") && (
              <p className="text-xs text-red-500 mt-1">{getFieldError("name")}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-xs tracking-[0.15em] uppercase text-arlie-charcoal/60 font-medium"
            >
              E-posta
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-arlie-light border text-arlie-charcoal 
                         placeholder:text-arlie-charcoal/30
                         focus:outline-none focus:border-arlie-gold/50 focus:ring-1 focus:ring-arlie-gold/20
                         transition-all duration-300 text-sm tracking-wide
                         ${getFieldError("email") ? "border-red-300" : "border-arlie-charcoal/10"}`}
              placeholder="ornek@email.com"
            />
            {getFieldError("email") && (
              <p className="text-xs text-red-500 mt-1">{getFieldError("email")}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-xs tracking-[0.15em] uppercase text-arlie-charcoal/60 font-medium"
            >
              Şifre
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-arlie-light border text-arlie-charcoal 
                         placeholder:text-arlie-charcoal/30
                         focus:outline-none focus:border-arlie-gold/50 focus:ring-1 focus:ring-arlie-gold/20
                         transition-all duration-300 text-sm tracking-wide
                         ${getFieldError("password") ? "border-red-300" : "border-arlie-charcoal/10"}`}
              placeholder="En az 8 karakter"
            />
            {getFieldError("password") && (
              <p className="text-xs text-red-500 mt-1">{getFieldError("password")}</p>
            )}
            <p className="text-xs text-arlie-charcoal/30 mt-1">
              En az 8 karakter, 1 büyük harf, 1 küçük harf, 1 rakam
            </p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="block text-xs tracking-[0.15em] uppercase text-arlie-charcoal/60 font-medium"
            >
              Şifre Tekrar
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-arlie-light border text-arlie-charcoal 
                         placeholder:text-arlie-charcoal/30
                         focus:outline-none focus:border-arlie-gold/50 focus:ring-1 focus:ring-arlie-gold/20
                         transition-all duration-300 text-sm tracking-wide
                         ${getFieldError("confirmPassword") ? "border-red-300" : "border-arlie-charcoal/10"}`}
              placeholder="••••••••"
            />
            {getFieldError("confirmPassword") && (
              <p className="text-xs text-red-500 mt-1">
                {getFieldError("confirmPassword")}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.01 }}
            whileTap={{ scale: isLoading ? 1 : 0.99 }}
            className="w-full py-3.5 bg-arlie-charcoal text-white text-xs tracking-[0.2em] uppercase
                       hover:bg-arlie-charcoal/90 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300 font-medium mt-2"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Kayıt Yapılıyor...
              </span>
            ) : (
              "Kayıt Ol"
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="mt-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-arlie-charcoal/10" />
          <span className="text-xs text-arlie-charcoal/30 tracking-wider">veya</span>
          <div className="flex-1 h-px bg-arlie-charcoal/10" />
        </div>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-arlie-charcoal/50">
            Zaten hesabınız var mı?{" "}
            <Link
              href="/auth/login"
              className="text-arlie-charcoal underline underline-offset-4 decoration-arlie-gold/40
                         hover:decoration-arlie-gold transition-all duration-300"
            >
              Giriş Yapın
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-xs text-arlie-charcoal/30 tracking-[0.1em] uppercase
                       hover:text-arlie-charcoal/60 transition-colors duration-300"
          >
            ← Ana Sayfaya Dön
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
