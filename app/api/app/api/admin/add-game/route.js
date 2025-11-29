// app/api/admin/add-game/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Nome da tabela que você criou no Supabase
const TABLE_NAME = "games";

export async function POST(request) {
  try {
    const body = await request.json();
    const { mode } = body;

    if (mode === "manual") {
      return await handleManualInsert(body);
    }

    if (mode === "steam") {
      return await handleSteamImport(body);
    }

    return NextResponse.json(
      { error: "Modo inválido. Use 'manual' ou 'steam'." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Erro geral em /api/admin/add-game:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}

// 🔹 MODO 1: inserir manualmente (qualquer plataforma)
async function handleManualInsert(body) {
  const { title, description, image_url, download_url, tags } = body;

  if (!title || !download_url) {
    return NextResponse.json(
      { error: "Título e URL de download são obrigatórios." },
      { status: 400 }
    );
  }

  // tags vem como array do front
  const normalizedTags = Array.isArray(tags)
    ? tags.filter(Boolean)
    : [];

  const { data, error } = await supabaseAdmin
    .from(TABLE_NAME)
    .insert({
      title,
      description: description || "",
      image_url: image_url || "",
      download_url,
      tags: normalizedTags, // text[]
    })
    .select()
    .single();

  if (error) {
    console.error("Erro ao inserir jogo manual:", error);
    return NextResponse.json(
      { error: "Erro ao salvar jogo no banco." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Jogo adicionado com sucesso.", game: data },
    { status: 201 }
  );
}

// 🔹 MODO 2: importar automaticamente da Steam
async function handleSteamImport(body) {
  const { appId } = body;

  if (!appId) {
    return NextResponse.json(
      { error: "AppID da Steam é obrigatório para modo 'steam'." },
      { status: 400 }
    );
  }

  // Endpoint público da Steam (não precisa de API key)
  const url = `https://store.steampowered.com/api/appdetails?appids=${appId}&l=portuguese&cc=br`;

  let steamJson;
  try {
    const res = await fetch(url, { cache: "no-store" });
    steamJson = await res.json();
  } catch (error) {
    console.error("Erro ao chamar API da Steam:", error);
    return NextResponse.json(
      { error: "Não foi possível consultar a Steam." },
      { status: 502 }
    );
  }

  const appData = steamJson?.[appId]?.data;
  if (!appData) {
    return NextResponse.json(
      { error: "Jogo não encontrado na Steam para esse AppID." },
      { status: 404 }
    );
  }

  // Monta os dados do jogo
  const title = appData.name;
  const description = appData.short_description || "";
  const image_url = appData.header_image || "";
  const download_url = `https://store.steampowered.com/app/${appId}`;
  const tags =
    appData.genres?.map((g) => g.description) || ["Steam", "PC"];

  const { data, error } = await supabaseAdmin
    .from(TABLE_NAME)
    .insert({
      title,
      description,
      image_url,
      download_url,
      tags,
    })
    .select()
    .single();

  if (error) {
    console.error("Erro ao salvar jogo importado da Steam:", error);
    return NextResponse.json(
      { error: "Erro ao salvar jogo importado no banco." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      message: "Jogo importado da Steam com sucesso.",
      game: data,
    },
    { status: 201 }
  );
}
