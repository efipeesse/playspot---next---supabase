// app/api/admin/simple-login/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  const { password } = await request.json();

  // Senha definida no painel da Vercel (variável ADMIN_PASSWORD)
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD não configurada no ambiente" },
      { status: 500 }
    );
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });

  // Cookie simples só pra proteger /admin
  res.cookies.set("admin_token", "ok", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 horas
  });

  return res;
}
