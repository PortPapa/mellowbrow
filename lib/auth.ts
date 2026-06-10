// 관리자 세션 — HMAC-SHA256 서명 쿠키 (Web Crypto 사용: middleware/edge 호환)

export const SESSION_COOKIE = "mb_desk_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7일

function secret(): string {
  const s = process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD;
  if (!s) {
    console.warn("[mellowbrow] AUTH_SECRET이 설정되지 않아 개발용 기본값을 사용합니다.");
    return "mellowbrow-dev-secret";
  }
  return s;
}

async function hmac(value: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  // base64url
  let b64 = "";
  const bytes = new Uint8Array(sig);
  for (const b of bytes) b64 += String.fromCharCode(b);
  return btoa(b64).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function createSessionToken(): Promise<string> {
  const exp = Date.now() + SESSION_TTL_MS;
  return `${exp}.${await hmac(String(exp))}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [expStr, sig] = token.split(".");
  if (!expStr || !sig) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  return (await hmac(expStr)) === sig;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  };
}
