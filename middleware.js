// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();

  const isAdminRoute = url.pathname.startsWith("/admin");
  const isLoginRoute = url.pathname === "/admin/login";

  const hasToken = req.cookies.get("admin_token");

  // Se tentar acessar /admin (ou qualquer /admin/...) sem estar logado → manda pro /admin/login
  if (isAdminRoute && !isLoginRoute && !hasToken) {
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  // Se já estiver logado e tentar ir pra tela de login → manda pra /admin
  if (isLoginRoute && hasToken) {
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  // Qualquer outra rota segue normalmente
  return NextResponse.next();
}

// Só roda middleware nas rotas /admin/*
export const config = {
  matcher: ["/admin/:path*"],
};
