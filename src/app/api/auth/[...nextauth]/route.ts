/**
 * Auth.js v5 — Catch-all Route Handler
 *
 * /api/auth/* altındaki tüm auth isteklerini yönetir:
 * - /api/auth/signin
 * - /api/auth/signout
 * - /api/auth/session
 * - /api/auth/csrf
 * - /api/auth/callback/*
 * - /api/auth/providers
 */

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
