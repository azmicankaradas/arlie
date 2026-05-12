"use client";

/**
 * Arlie — Login Page
 *
 * Minimalist, lüks estetikle tasarlanmış giriş sayfası.
 * Auth.js signIn fonksiyonu ile credentials authentication.
 */

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("E-posta veya şifre hatalı.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Giriş sırasında bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-arlie-white px-4">
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
            Hesabınıza Giriş Yapın
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-arlie-light border border-arlie-charcoal/10 
                         text-arlie-charcoal placeholder:text-arlie-charcoal/30
                         focus:outline-none focus:border-arlie-gold/50 focus:ring-1 focus:ring-arlie-gold/20
                         transition-all duration-300 text-sm tracking-wide"
              placeholder="ornek@email.com"
            />
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
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-arlie-light border border-arlie-charcoal/10 
                         text-arlie-charcoal placeholder:text-arlie-charcoal/30
                         focus:outline-none focus:border-arlie-gold/50 focus:ring-1 focus:ring-arlie-gold/20
                         transition-all duration-300 text-sm tracking-wide"
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.01 }}
            whileTap={{ scale: isLoading ? 1 : 0.99 }}
            className="w-full py-3.5 bg-arlie-charcoal text-white text-xs tracking-[0.2em] uppercase
                       hover:bg-arlie-charcoal/90 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300 font-medium"
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
                Giriş Yapılıyor...
              </span>
            ) : (
              "Giriş Yap"
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="mt-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-arlie-charcoal/10" />
          <span className="text-xs text-arlie-charcoal/30 tracking-wider">veya</span>
          <div className="flex-1 h-px bg-arlie-charcoal/10" />
        </div>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-arlie-charcoal/50">
            Hesabınız yok mu?{" "}
            <Link
              href="/auth/register"
              className="text-arlie-charcoal underline underline-offset-4 decoration-arlie-gold/40
                         hover:decoration-arlie-gold transition-all duration-300"
            >
              Kayıt Olun
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
