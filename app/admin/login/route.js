export async function POST(req) {
  try {
    const { password } = await req.json();

    if (!password) {
      return new Response(
        JSON.stringify({ error: "Senha não informada." }),
        { status: 400 }
      );
    }

    // Valida a senha usando a variável de ambiente ADMIN_PASSWORD
    if (password !== process.env.ADMIN_PASSWORD) {
      return new Response(
        JSON.stringify({ error: "Senha incorreta." }),
        { status: 401 }
      );
    }

    // Define o cookie indicando que o admin está logado
    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          "Set-Cookie": `playspot_admin=1; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
        }
      }
    );

  } catch (error) {
    console.error("ERRO LOGIN ADMIN:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno." }),
      { status: 500 }
    );
  }
}
