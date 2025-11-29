import { NextResponse } from "next/server";
import { importFromSteam } from "@/lib/steamImporter";

export async function POST(request, { params }) {
  try {
    const appId = params.appid;
    const game = await importFromSteam(appId);

    return NextResponse.json(game, { status: 200 });
  } catch (error) {
    console.error("Erro ao importar jogo da Steam:", error);
    return NextResponse.json(
      { error: error.message ?? "Erro ao importar jogo da Steam" },
      { status: 500 }
    );
  }
}
