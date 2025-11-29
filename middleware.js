import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl;
  
  // Proteger qualquer rota /admin, exceto /admin/login
  if (url.pathname.startsWith("/admin") && url.pathname !== "/admin/login") {
    const auth = req.cookies.get("admin-auth")?.value;

    if (!auth) {
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Middleware só roda nessas rotas
export const config = {
  matcher: ["/admin/:path*"]
};
