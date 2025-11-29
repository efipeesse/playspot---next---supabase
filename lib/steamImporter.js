// lib/steamImporter.js
import "server-only";

const STEAM_API_KEY = process.env.STEAM_API_KEY;

// Se não tiver chave, só avisa no log
if (!STEAM_API_KEY) {
  console.warn(
    "STEAM_API_KEY não está configurada. Importação automática da Steam ficará desativada."
  );
}

/**
 * Busca dados básicos de um jogo na Steam pelo appid.
 */
export async function importFromSteam(appId) {
  if (!STEAM_API_KEY) {
    throw new Error(
      "Steam API desativada: defina STEAM_API_KEY nas variáveis de ambiente."
    );
  }

  const url = `https://store.steampowered.com/api/appdetails?appids=${appId}&key=${STEAM_API_KEY}&cc=br&l=portuguese`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Erro ao consultar Steam API: ${res.status}`);
  }

  const json = await res.json();
  const data = json[appId]?.data;

  if (!data) {
    throw new Error("Jogo não encontrado na Steam.");
  }

  return {
    title: data.name,
    description: data.short_description ?? "",
    image_url: data.header_image ?? "",
    download_url: `https://store.steampowered.com/app/${appId}`,
    tags: (data.genres || []).map((g) => g.description).slice(0, 5),
  };
}
