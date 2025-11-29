
// Página inicial simples consumindo a API /api/games
"use client";

import { useEffect, useState } from "react";

function GameCard({ game }) {
  const storeLink = game.game_store_links?.[0];
  const storeName = storeLink?.stores?.name;
  const storeUrl = storeLink?.url;

  return (
    <article
      style={{
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "#050513",
        padding: 8,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div
        style={{
          borderRadius: 9,
          overflow: "hidden",
          height: 88,
          background: "#020617",
        }}
      >
        {game.thumbnail_url && (
          <img
            src={game.thumbnail_url}
            alt={game.title}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
      </div>
      <h3 style={{ fontSize: 13, margin: "2px 0", fontWeight: 600 }}>
        {game.title}
      </h3>
      <p
        style={{
          fontSize: 11,
          margin: "0 0 4px",
          color: "rgba(255,255,255,0.68)",
        }}
      >
        {game.short_description || "Sem descrição curta cadastrada."}
      </p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {storeName && (
          <span
            style={{
              borderRadius: 999,
              border: "1px solid #38bdf8",
              padding: "1px 6px",
              fontSize: 10,
              color: "#38bdf8",
            }}
          >
            {storeName}
          </span>
        )}
        {game.is_free && (
          <span
            style={{
              borderRadius: 999,
              border: "1px solid #22c55e",
              padding: "1px 6px",
              fontSize: 10,
              color: "#22c55e",
            }}
          >
            Grátis para jogar
          </span>
        )}
      </div>
      {storeUrl && (
        <div style={{ marginTop: 6 }}>
          <a
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 999,
              padding: "5px 10px",
              fontSize: 11,
              fontWeight: 600,
              background: "#22e3b6",
              color: "#020617",
              textDecoration: "none",
            }}
          >
            Baixar na loja oficial
          </a>
        </div>
      )}
    </article>
  );
}

export default function HomePage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadGames() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);

        const res = await fetch(`/api/games?${params.toString()}`);
        const json = await res.json();
        if (json.success) {
          setGames(json.games || []);
        } else {
          console.error(json.error);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadGames();
  }, [search]);

  return (
    <div
      style={{
        maxWidth: 1180,
        margin: "0 auto",
        padding: "16px 14px 24px",
        color: "#fff",
        background:
          "radial-gradient(circle at top, #181832 0, #050511 40%, #020208 100%)",
        minHeight: "100vh",
      }}
    >
      <header
        style={{
          marginBottom: 16,
          paddingBottom: 10,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 11,
                background:
                  "radial-gradient(circle at 20% 0%, #22e3b6, #020617)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                fontWeight: 700,
                color: "#020617",
                boxShadow: "0 0 16px rgba(34,227,182,0.85)",
              }}
            >
              P
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 18, fontWeight: 650 }}>PlaySpot</span>
                <span
                  style={{
                    fontSize: 10,
                    padding: "2px 7px",
                    borderRadius: 999,
                    border: "1px solid rgba(248,250,252,0.35)",
                    background: "rgba(15,23,42,0.9)",
                    color: "rgba(255,255,255,0.68)",
                  }}
                >
                  BETA
                </span>
              </div>
              <span
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.68)",
                }}
              >
                Catálogo de jogos com links para as lojas oficiais
              </span>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section style={{ marginBottom: 16 }}>
          <p
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.68)",
              marginBottom: 2,
            }}
          >
            Visão geral
          </p>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 620,
              marginBottom: 6,
            }}
          >
            Encontre jogos e vá direto para a loja oficial
          </h1>
          <p
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.68)",
              maxWidth: 640,
            }}
          >
            A <b>PlaySpot</b> organiza jogos em um só lugar. Você descobre
            títulos e, com um clique, é redirecionado para as lojas oficiais
            como Steam, Riot ou o site do estúdio. A PlaySpot não vende jogos —
            apenas conecta você ao lugar certo para baixar.
          </p>
        </section>

        <section
          style={{
            marginBottom: 14,
            padding: 12,
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "#090917",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome (ex: Hades, Counter-Strike...)"
              style={{
                flex: 1,
                minWidth: 190,
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.22)",
                background: "rgba(0,0,0,0.6)",
                padding: "7px 11px",
                fontSize: 12,
                color: "rgba(255,255,255,0.9)",
              }}
            />
          </div>
          <p
            style={{
              fontSize: 11,
              margin: 0,
              color: "rgba(255,255,255,0.68)",
            }}
          >
            Essa tela já está conectada ao Supabase. Os jogos mostrados abaixo
            vêm do banco de dados.
          </p>
        </section>

        {loading ? (
          <p
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.68)",
            }}
          >
            Carregando jogos do catálogo...
          </p>
        ) : games.length === 0 ? (
          <p
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.68)",
            }}
          >
            Nenhum jogo encontrado. Tente outro termo ou cadastre alguns jogos
            primeiro.
          </p>
        ) : (
          <section>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 10,
              }}
            >
              {games.map((g) => (
                <GameCard key={g.id} game={g} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
