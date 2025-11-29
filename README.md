# PlaySpot Next.js + Supabase (base inicial)

Este projeto é uma base mínima para a PlaySpot conectada ao Supabase.

## O que já está pronto

- Next.js (app router) configurado.
- Supabase plugado:
  - Cliente público (`lib/supabaseClient.js`)
  - Cliente admin (`lib/supabaseAdmin.js`)
- Rota de API para listar jogos: `GET /api/games`
- Rota de API para importar um jogo da Steam: `POST /api/admin/import/steam/[appid]`
- Página inicial (`app/page.js`) que:
  - Chama `/api/games`
  - Lista os jogos vindos do Supabase
  - Mostra capa, título, descrição curta, badge de plataforma e botão "Baixar na loja oficial".

## Como usar

1. Instalar dependências:

   ```bash
   npm install
   # ou
   pnpm install
   ```

2. Copiar o arquivo de exemplo de ambiente:

   ```bash
   cp .env.local.example .env.local
   ```

3. Preencher `.env.local` com os dados do seu projeto Supabase:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (para importador da Steam)

4. Criar as tabelas no Supabase

   Use o SQL que foi enviado no ChatGPT (tabelas `games`, `stores`, `game_store_links`, etc.).

5. Rodar em desenvolvimento:

   ```bash
   npm run dev
   ```

6. Acessar:

   - Home: `http://localhost:3000/`
   - Listagem de jogos (API): `http://localhost:3000/api/games`

7. Importar um jogo da Steam (exemplo)

   Com o servidor rodando, faça um POST para:

   ```bash
   POST http://localhost:3000/api/admin/import/steam/1145360
   ```

   Isso vai importar o Hades para o banco (se a tabela estiver correta) e ele passará a aparecer na home.

Depois disso, é só evoluir o front-end para ficar igual ao visual refinado da PlaySpot que você já tem.
