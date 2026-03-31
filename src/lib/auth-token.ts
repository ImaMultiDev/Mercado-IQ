/**
 * Sesión firmada (HMAC-SHA256) con Web Crypto.
 * Válido en Server Actions (Node) y en middleware (Edge) sin dependencias extra.
 */

export const SESSION_COOKIE_NAME = "mercado_iq_session";

const MAX_AGE_SEC = 60 * 60 * 24 * 30; // 30 días

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function arrayBufferToBase64url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) {
    bin += String.fromCharCode(bytes[i]!);
  }
  const b64 = btoa(bin);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlToUint8Array(s: string): Uint8Array | null {
  try {
    const pad = "=".repeat((4 - (s.length % 4)) % 4);
    const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
    const raw = atob(b64);
    const out = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
      out[i] = raw.charCodeAt(i)!;
    }
    return out;
  } catch {
    return null;
  }
}

function payloadToBase64url(payload: string): string {
  const bytes = new TextEncoder().encode(payload);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) {
    bin += String.fromCharCode(bytes[i]!);
  }
  const b64 = btoa(bin);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlToUtf8(s: string): string | null {
  const bytes = base64urlToUint8Array(s);
  if (!bytes) return null;
  return new TextDecoder().decode(bytes);
}

export function sessionMaxAgeSeconds(): number {
  return MAX_AGE_SEC;
}

export async function signSessionToken(secret: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SEC;
  const payloadJson = JSON.stringify({ exp });
  const payloadB64 = payloadToBase64url(payloadJson);
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payloadB64),
  );
  const sigB64 = arrayBufferToBase64url(sig);
  return `${payloadB64}.${sigB64}`;
}

export async function verifySessionToken(
  token: string,
  secret: string,
): Promise<boolean> {
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const payloadB64 = token.slice(0, dot);
  const sigB64 = token.slice(dot + 1);
  const sigBytes = base64urlToUint8Array(sigB64);
  if (!sigBytes) return false;

  const key = await hmacKey(secret);
  const sigBuffer = new Uint8Array(sigBytes.length);
  sigBuffer.set(sigBytes);
  const ok = await crypto.subtle.verify(
    "HMAC",
    key,
    sigBuffer,
    new TextEncoder().encode(payloadB64),
  );
  if (!ok) return false;

  const json = base64urlToUtf8(payloadB64);
  if (!json) return false;
  try {
    const { exp } = JSON.parse(json) as { exp?: unknown };
    if (typeof exp !== "number") return false;
    return exp >= Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}
