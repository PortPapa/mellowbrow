import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { DESK_PATH } from "@/lib/constants";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 로그인 경로는 통과
  if (pathname === `${DESK_PATH}/login` || pathname === `/api${DESK_PATH}/login`) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (await verifySessionToken(token)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = `${DESK_PATH}/login`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/desk", "/desk/:path*", "/api/desk/:path*"],
};
