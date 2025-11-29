import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdminClient";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      title,
      description,
      image_url,
      download_url,
      tags,
      admin_secret,
    } = body;

    if (admin_secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!title || !download_url) {
      return NextResponse.json(
        { error: "title e download_url são obrigatórios" },
        { status: 400 }
      );
    }

    const tagsArray =
      Array.isArray(tags)
        ? tags
        : typeof tags === "string" && tags.trim() !== ""
        ? tags.split(",").map((t) => t.trim())
        : [];

    const { data, error } = await supabaseAdmin
      .from("games")
      .insert({
        title,
        description: description || "",
        image_url: image_url || "",
        download_url,
        tags: tagsArray,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Erro ao inserir jogo:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, game: data }, { status: 201 });
  } catch (err) {
    console.error("Erro inesperado:", err);
    return NextResponse.json(
      { error: "Erro interno ao criar jogo" },
      { status: 500 }
    );
  }
}
