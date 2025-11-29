
import { NextResponse } from "next/server";
import { importSteamApp } from "@/lib/steamImporter";

export async function POST(_request, { params }) {
  try {
    const { appid } = params;
    const gameId = await importSteamApp(appid);
    return NextResponse.json({ success: true, gameId });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 },
    );
  }
}
