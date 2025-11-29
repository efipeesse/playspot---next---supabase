// app/api/admin/login/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { password } = await req.json();

    const expected = process.env.ADMIN_PASSWORD;

    // Se a variável não estiver configurada no Vercel
    if (!expected) {
      console.error("ADMIN_PASSWORD não está definida no ambiente");
      return NextResponse.json(
        { ok: false, error: "SERVER_MISCONFIGURED" },
        { status: 500 }
      );
    }

    // Senha errada
    if (password !== expected) {
      return NextResponse.json(
        { ok: false, error: "INVALID_PASSWORD" },
        { status: 401 }
      );
    }

    // Senha correta → grava cookie de admin
    const res = NextResponse.json({ ok: true });

    res.cookies.set("playspot_admin", "1", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 4, // 4 horas
    });

    return res;
  } catch (err) {
    console.error("Erro no login admin:", err);
    return NextResponse.json(
      { ok: false, error: "UNKNOWN_ERROR" },
      { status: 500 }
    );
  }
}
