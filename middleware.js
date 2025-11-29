// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Permitir acesso ao login sempre
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  // Bloquear demais rotas /admin
  if (pathname.startsWith("/admin")) {
    const cookie = req.cookies.get("playspot_admin")?.value;

    const isAdmin = cookie === "1";

    if (!isAdmin) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
