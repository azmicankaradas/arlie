"use client";

/**
 * Arlie — Auth Provider
 *
 * Next-Auth SessionProvider wrapper.
 * Root layout'ta kullanılarak tüm client component'lere
 * session bilgisini sağlar.
 *
 * useSession() hook'u ile herhangi bir client component'te
 * oturum bilgisine erişilebilir.
 */

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
