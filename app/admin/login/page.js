import { NextResponse } from "next/server";

export async function POST(req) {
  const { password } = await req.json();

  if (!password) {
    return NextResponse.json({ error: "Senha obrigatória" }, { status: 400 });
  }

  // senha armazenada corretamente no Vercel
  const correctPassword = process.env.ADMIN_PASSWORD;

  if (password !== correctPassword) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
  }

  // cria cookie de autenticação
  const res = NextResponse.json({ success: true });

  res.cookies.set("admin-auth", "true", {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 12, // 12 horas
  });

  return res;
}
