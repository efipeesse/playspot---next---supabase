import { NextResponse } from "next/server";

export function middleware(request) {
  // Cookie padrão que o Supabase usa para sessão
  const session = request.cookies.get("sb-access-token")?.value;

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  // Se for rota /admin e não tiver sessão, manda para o login
  if (isAdminRoute && !session) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
