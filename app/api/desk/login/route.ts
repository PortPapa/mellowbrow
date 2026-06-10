import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, createSessionToken, sessionCookieOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  let password = "";
  try {
    const body = (await req.json()) as { password?: string };
    password = body.password ?? "";
  } catch {
    /* fallthrough */
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    console.warn("[desk] ADMIN_PASSWORD가 설정되지 않았습니다. 개발용 기본값 'mellow' 사용 중.");
  }
  if (!password || password !== (expected || "mellow")) {
    return NextResponse.json({ error: "비밀번호가 맞지 않아요." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, await createSessionToken(), sessionCookieOptions());
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  return res;
}
