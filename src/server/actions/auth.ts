"use server";

import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE_NAME,
  sessionMaxAgeSeconds,
  signSessionToken,
} from "@/lib/auth-token";

function safeCompare(a: string, b: string): boolean {
  const ua = new TextEncoder().encode(a);
  const ub = new TextEncoder().encode(b);
  if (ua.length !== ub.length) return false;
  return timingSafeEqual(ua, ub);
}

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState | undefined,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const expectedUser = process.env.AUTH_USERNAME;
  const expectedPass = process.env.AUTH_PASSWORD;
  const secret = process.env.AUTH_SECRET;

  if (!expectedUser || !expectedPass || !secret) {
    return {
      error: "Falta configurar AUTH_USERNAME, AUTH_PASSWORD y AUTH_SECRET en el servidor.",
    };
  }

  if (!safeCompare(username, expectedUser) || !safeCompare(password, expectedPass)) {
    return { error: "Usuario o contraseña incorrectos." };
  }

  const token = await signSessionToken(secret);
  const jar = await cookies();
  jar.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionMaxAgeSeconds(),
  });

  redirect("/");
}

export async function logoutAction(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE_NAME);
  redirect("/login");
}
