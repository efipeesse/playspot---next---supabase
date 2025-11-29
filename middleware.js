import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl;
  const path = url.pathname;

  const isAdminRoute = path.startsWith("/admin");
  const isLoginRoute =
    path === "/admin/login" || path === "/admin/login/";

  // Protege qualquer rota /admin, exceto /admin/login
  if (isAdminRoute && !isLoginRoute) {
    const auth = req.cookies.get("admin-auth")?.value;

    if (!auth) {
      // manda para a página de login
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  // para /admin/login (com ou sem /), apenas prossegue
  return NextResponse.next();
}

// Middleware só roda nas rotas /admin
export const config = {
  matcher: ["/admin/:path*"],
};
