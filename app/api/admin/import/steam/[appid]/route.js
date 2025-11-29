// app/api/admin/import/steam/[appid]/route.js
import { NextResponse } from 'next/server';
import { importFromSteam } from '@/lib/steamImporter';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request, { params }) {
  const { appid } = params;

  try {
    const body = await request.json();
    const { secret } = body;

    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    if (!appid) {
      return NextResponse.json(
        { error: 'AppID é obrigatório.' },
        { status: 400 }
      );
    }

    // Busca dados na Steam
    const gameData = await importFromSteam(appid);

    if (!gameData) {
      return NextResponse.json(
        { error: 'Não foi possível buscar dados na Steam.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('games')
      .insert(gameData)
      .select()
      .single();

    if (error) {
      console.error('Erro Supabase (import-steam):', error);
      return NextResponse.json(
        { error: 'Erro ao salvar no banco.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ game: data }, { status: 201 });
  } catch (err) {
    console.error('Erro inesperado (import-steam):', err);
    return NextResponse.json({ error: 'Erro inesperado.' }, { status: 500 });
  }
}
