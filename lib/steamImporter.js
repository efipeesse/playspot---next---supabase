
import { supabaseAdmin } from "./supabaseAdmin.js";

// Importa dados de um jogo da Steam usando o appid
export async function fetchSteamApp(appid, lang = "en") {
  const url = `https://store.steampowered.com/api/appdetails?appids=${appid}&l=${lang}`;
  const res = await fetch(url);
  const json = await res.json();
  const data = json[appid];

  if (!data?.success) {
    throw new Error(`Appid ${appid} não encontrado na Steam`);
  }

  const game = data.data;

  return {
    externalSource: "steam",
    externalId: appid,
    title: game.name,
    shortDescription: game.short_description,
    longDescription: game.detailed_description,
    isFree: game.is_free,
    thumbnailUrl: game.header_image,
    genres: (game.genres || []).map((g) => g.description),
    website: game.website || null,
    steamUrl: `https://store.steampowered.com/app/${appid}`,
  };
}

export async function importSteamApp(appid) {
  const steamGame = await fetchSteamApp(appid);

  // upsert no games
  const { data: upserted, error: upsertError } = await supabaseAdmin
    .from("games")
    .upsert(
      {
        external_source: "steam",
        external_id: steamGame.externalId,
        title: steamGame.title,
        short_description: steamGame.shortDescription,
        long_description: steamGame.longDescription,
        is_free: steamGame.isFree,
        thumbnail_url: steamGame.thumbnailUrl,
      },
      { onConflict: "external_source,external_id" },
    )
    .select()
    .single();

  if (upsertError || !upserted) {
    throw upsertError || new Error("Falha ao salvar jogo");
  }

  const gameId = upserted.id;

  // garantir store Steam
  const { data: store, error: storeErr } = await supabaseAdmin
    .from("stores")
    .select("id, slug")
    .eq("slug", "steam")
    .maybeSingle();

  if (!storeErr && store?.id) {
    await supabaseAdmin.from("game_store_links").upsert(
      {
        game_id: gameId,
        store_id: store.id,
        url: steamGame.steamUrl,
      },
      { onConflict: "game_id,store_id" },
    );
  }

  // tags / gêneros
  for (const genre of steamGame.genres) {
    const { data: tag, error: tagErr } = await supabaseAdmin
      .from("tags")
      .upsert({ name: genre }, { onConflict: "name" })
      .select()
      .single();

    if (!tagErr && tag) {
      await supabaseAdmin.from("game_tags").upsert(
        {
          game_id: gameId,
          tag_id: tag.id,
        },
        { onConflict: "game_id,tag_id" },
      );
    }
  }

  return gameId;
}
