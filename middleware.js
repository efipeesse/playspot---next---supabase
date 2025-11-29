// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Login pode ser acessado sem estar logado
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  // Outras rotas /admin precisam do cookie
  const isAdminRoute = pathname.startsWith("/admin");
  if (!isAdminRoute) {
    return NextResponse.next();
  }

  const isAdmin =
    req.cookies.get("playspot_admin")?.value === "1";

  if (!isAdmin) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
