// app/api/admin/add-game/route.js
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request) {
  try {
    const body = await request.json();
    const { secret, title, description, image_url, tags, download_url } = body;

    // Confere senha de admin
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    if (!title || !download_url) {
      return NextResponse.json(
        { error: 'Título e link de download são obrigatórios.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('games')
      .insert({
        title,
        description: description || '',
        image_url: image_url || '',
        tags: tags || [],
        download_url,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro Supabase (add-game):', error);
      return NextResponse.json(
        { error: 'Erro ao salvar no banco.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ game: data }, { status: 201 });
  } catch (err) {
    console.error('Erro inesperado (add-game):', err);
    return NextResponse.json({ error: 'Erro inesperado.' }, { status: 500 });
  }
}
