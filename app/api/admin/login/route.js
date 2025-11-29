import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { password } = await req.json();

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { error: "ADMIN_PASSWORD não configurado!" },
        { status: 500 }
      );
    }

    if (password === adminPassword) {
      const res = NextResponse.json({ success: true });

      res.cookies.set("playspot_admin", "1", {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        maxAge: 60 * 60 * 24 * 7,
      });

      return res;
    }

    return NextResponse.json(
      { error: "Senha incorreta" },
      { status: 401 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Erro no servidor", detail: err.message },
      { status: 500 }
    );
  }
}
