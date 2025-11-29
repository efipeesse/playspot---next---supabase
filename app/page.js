// app/page.js
"use client";

import { useEffect, useMemo, useState } from "react";

function TagPill({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        borderRadius: 999,
        border: isActive
          ? "1px solid rgba(34,227,182,0.95)"
          : "1px solid rgba(148,163,184,0.45)",
        background: isActive
          ? "radial-gradient(circle at 20% 0%, #22e3b6, #020617)"
          : "rgba(15,23,42,0.85)",
        color: isActive ? "#020617" : "rgba(248,250,252,0.9)",
        padding: "4px 10px",
        fontSize: 11,
        fontWeight: 500,
        cursor: "pointer",
        boxShadow: isActive
          ? "0 0 14px rgba(34,227,182,0.7)"
          : "0 0 0 rgba(0,0,0,0)",
        transition: "all 0.18s ease",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

function TabButton({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        minWidth: 100,
        borderRadius: 999,
        border: isActive
          ? "1px solid rgba(34,211,238,0.95)"
          : "1px solid rgba(148,163,184,0.4)",
        background: isActive
          ? "radial-gradient(circle at 20% 0%, #22e3b6, #020617)"
          : "rgba(15,23,42,0.85)",
        color: isActive ? "#020617" : "rgba(248,250,252,0.9)",
        padding: "7px 10px",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        boxShadow: isActive
          ? "0 0 18px rgba(34,227,182,0.75)"
          : "0 0 0 rgba(0,0,0,0)",
        transition: "all 0.18s ease",
      }}
    >
      {label}
    </button>
  );
}

function GameCard({ game, isFavorite, onToggleFavorite }) {
  const storeLink = game.game_store_links?.[0];
  const storeName = storeLink?.stores?.name;
  const storeUrl = storeLink?.url;

  const tags =
    game.game_tags?.map((gt) => gt.tags?.name).filter(Boolean) || [];

  return (
    <article
      style={{
        borderRadius: 18,
        border: "1px solid rgba(148,163,184,0.35)",
        background:
          "radial-gradient(circle at top left, rgba(34,197,235,0.18), rgba(15,23,42,0.98))",
        padding: 10,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        boxShadow: "0 18px 45px rgba(15,23,42,0.9)",
      }}
    >
      <div
        style={{
          borderRadius: 14,
          overflow: "hidden",
          height: 132,
          background: "#020617",
          position: "relative",
        }}
      >
        {game.thumbnail_url ? (
          <img
            src={game.thumbnail_url}
            alt={game.title}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(135deg, #0f172a 0, #020617 40%, #22e3b6 100%)",
            }}
          />
        )}

        {game.is_free && (
          <span
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              borderRadius: 999,
              padding: "3px 8px",
              fontSize: 10,
              fontWeight: 600,
              background: "rgba(22,163,74,0.95)",
              color: "#ecfdf5",
              boxShadow: "0 0 10px rgba(22,163,74,0.85)",
            }}
          >
            Grátis para jogar
          </span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <h3
          style={{
            fontSize: 15,
            margin: 0,
            fontWeight: 650,
          }}
        >
          {game.title}
        </h3>
        <p
          style={{
            fontSize: 11,
            margin: 0,
            color: "rgba(226,232,240,0.88)",
          }}
        >
          {game.short_description || "Sem descrição curta cadastrada."}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          marginTop: 2,
          marginBottom: 2,
        }}
      >
        {storeName && (
          <span
            style={{
              borderRadius: 999,
              border: "1px solid rgba(56,189,248,0.85)",
              padding: "2px 8px",
              fontSize: 10,
              color: "#e0f2fe",
              background: "rgba(15,23,42,0.95)",
            }}
          >
            {storeName}
          </span>
        )}
        {tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            style={{
              borderRadius: 999,
              border: "1px solid rgba(148,163,184,0.45)",
              padding: "2px 8px",
              fontSize: 10,
              color: "rgba(226,232,240,0.9)",
              background: "rgba(15,23,42,0.9)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 4,
          alignItems: "center",
        }}
      >
        {storeUrl && (
          <a
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              borderRadius: 999,
              padding: "7px 10px",
              fontSize: 12,
              fontWeight: 650,
              textAlign: "center",
              textDecoration: "none",
              background: "radial-gradient(circle at 10% 0%, #22e3b6, #14b8a6)",
              color: "#020617",
              boxShadow: "0 0 18px rgba(34,227,182,0.7)",
            }}
          >
            Baixar na loja oficial
          </a>
        )}

        <button
          onClick={onToggleFavorite}
          style={{
            borderRadius: 999,
            padding: "7px 12px",
            fontSize: 11,
            fontWeight: 600,
            border: isFavorite
              ? "1px solid rgba(250,250,250,0.95)"
              : "1px solid rgba(148,163,184,0.7)",
            background: isFavorite
              ? "rgba(248,250,252,0.12)"
              : "rgba(15,23,42,0.92)",
            color: isFavorite
              ? "rgba(248,250,252,0.95)"
              : "rgba(226,232,240,0.9)",
            cursor: "pointer",
            minWidth: 90,
            transition: "all 0.16s ease",
          }}
        >
          {isFavorite ? "Favorito ✓" : "Favoritar"}
        </button>
      </div>
    </article>
  );
}

export default function HomePage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("featured"); // featured | free | all
  const [activeFilterTag, setActiveFilterTag] = useState("all");
  const [favorites, setFavorites] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = window.localStorage.getItem("playspot-favorites");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Carrega jogos do Supabase via API Next
  useEffect(() => {
    async function loadGames() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("limit", "80");
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
  }, []);

  // Sincronizar favoritos com localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(
        "playspot-favorites",
        JSON.stringify(favorites),
      );
    } catch {
      // ignore
    }
  }, [favorites]);

  const toggleFavorite = (gameId) => {
    setFavorites((prev) =>
      prev.includes(gameId)
        ? prev.filter((id) => id !== gameId)
        : [...prev, gameId],
    );
  };

  const filteredGames = useMemo(() => {
    let list = [...games];

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      list = list.filter((g) =>
        (g.title || "").toLowerCase().includes(term),
      );
    }

    if (activeTab === "free") {
      list = list.filter((g) => g.is_free);
    } else if (activeTab === "featured") {
      // Destaques: pega os 12 primeiros como vitrine
      list = list.slice(0, 12);
    }

    if (activeFilterTag !== "all") {
      list = list.filter((g) =>
        (g.game_tags || []).some(
          (gt) =>
            gt.tags?.name &&
            gt.tags.name.toLowerCase().includes(activeFilterTag),
        ),
      );
    }

    return list;
  }, [games, search, activeTab, activeFilterTag]);

  const favoriteGames = useMemo(
    () => games.filter((g) => favorites.includes(g.id)),
    [games, favorites],
  );

  return (
    <div
      style={{
        maxWidth: 1180,
        margin: "0 auto",
        padding: "16px 14px 26px",
        color: "#f9fafb",
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #1f2937 0, #020617 42%, #020617 100%)",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          marginBottom: 18,
          paddingBottom: 10,
          borderBottom: "1px solid rgba(148,163,184,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 14,
              background:
                "radial-gradient(circle at 20% 0%, #22e3b6, #020617)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 800,
              color: "#020617",
              boxShadow: "0 0 20px rgba(34,227,182,0.9)",
            }}
          >
            P
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 650,
                  letterSpacing: "0.03em",
                }}
              >
                PlaySpot
              </span>
              <span
                style={{
                  fontSize: 10,
                  padding: "2px 8px",
                  borderRadius: 999,
                  border: "1px solid rgba(148,163,184,0.6)",
                  background: "rgba(15,23,42,0.92)",
                  color: "rgba(248,250,252,0.85)",
                }}
              >
                BETA
              </span>
            </div>
            <span
              style={{
                fontSize: 11,
                color: "rgba(226,232,240,0.9)",
              }}
            >
              Catálogo de jogos com links para lojas oficiais
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            fontSize: 10,
            color: "rgba(148,163,184,0.9)",
          }}
        >
          <span
            style={{
              padding: "3px 8px",
              borderRadius: 999,
              border: "1px solid rgba(148,163,184,0.5)",
              background: "rgba(15,23,42,0.92)",
            }}
          >
            Visitante · protótipo conectado ao Supabase
          </span>
        </div>
      </header>

      {/* HERO */}
      <section
        style={{
          marginBottom: 18,
          borderRadius: 22,
          padding: 16,
          background:
            "radial-gradient(circle at 0 0, rgba(34,211,238,0.22), rgba(15,23,42,0.98))",
          border: "1px solid rgba(148,163,184,0.55)",
          boxShadow: "0 28px 80px rgba(15,23,42,0.95)",
        }}
      >
        <p
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            color: "rgba(226,232,240,0.88)",
            margin: "0 0 4px",
          }}
        >
          Descubra & baixe
        </p>
        <h1
          style={{
            fontSize: 23,
            fontWeight: 700,
            margin: "0 0 8px",
            maxWidth: 720,
          }}
        >
          Um catálogo visual com links diretos para lojas oficiais
        </h1>
        <p
          style={{
            fontSize: 12,
            margin: "0 0 12px",
            maxWidth: 720,
            color: "rgba(226,232,240,0.92)",
          }}
        >
          A ideia da PlaySpot é simples: você encontra jogos, filtra por tags e
          clica em <b>Baixar</b> para ir direto à loja oficial. A PlaySpot não
          vende jogos — apenas conecta você ao lugar certo para baixar.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <button
            onClick={() => setActiveTab("featured")}
            style={{
              borderRadius: 999,
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 650,
              border: "none",
              background:
                "radial-gradient(circle at 10% 0, #22e3b6, #14b8a6)",
              color: "#020617",
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(34,227,182,0.85)",
            }}
          >
            Ver jogos em destaque
          </button>
          <button
            onClick={() => setActiveTab("all")}
            style={{
              borderRadius: 999,
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 600,
              border: "1px solid rgba(148,163,184,0.65)",
              background: "rgba(15,23,42,0.9)",
              color: "rgba(248,250,252,0.96)",
              cursor: "pointer",
            }}
          >
            Ver busca e filtros
          </button>
        </div>

        <div
          style={{
            borderRadius: 16,
            padding: 10,
            border: "1px solid rgba(148,163,184,0.6)",
            background: "rgba(15,23,42,0.94)",
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome (ex: Hades, Counter-Strike...)"
            style={{
              width: "100%",
              borderRadius: 999,
              border: "1px solid rgba(148,163,184,0.7)",
              background: "rgba(15,23,42,0.96)",
              padding: "8px 12px",
              fontSize: 12,
              color: "rgba(248,250,252,0.96)",
              outline: "none",
            }}
          />
          <p
            style={{
              fontSize: 11,
              margin: "6px 2px 0",
              color: "rgba(148,163,184,0.95)",
            }}
          >
            Essa tela já está conectada ao Supabase. Os jogos mostrados abaixo
            vêm do banco de dados.
          </p>
        </div>
      </section>

      {/* TABS + TAGS */}
      <section style={{ marginBottom: 18 }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 10,
          }}
        >
          <TabButton
            label="Destaques"
            isActive={activeTab === "featured"}
            onClick={() => setActiveTab("featured")}
          />
          <TabButton
            label="Jogos grátis"
            isActive={activeTab === "free"}
            onClick={() => setActiveTab("free")}
          />
          <TabButton
            label="Todos"
            isActive={activeTab === "all"}
            onClick={() => setActiveTab("all")}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 4,
          }}
        >
          <TagPill
            label="Todos os estilos"
            isActive={activeFilterTag === "all"}
            onClick={() => setActiveFilterTag("all")}
          />
          <TagPill
            label="Indie"
            isActive={activeFilterTag === "indie"}
            onClick={() => setActiveFilterTag("indie")}
          />
          <TagPill
            label="Soulslike"
            isActive={activeFilterTag === "souls"}
            onClick={() => setActiveFilterTag("souls")}
          />
          <TagPill
            label="RPG"
            isActive={activeFilterTag === "rpg"}
            onClick={() => setActiveFilterTag("rpg")}
          />
          <TagPill
            label="FPS"
            isActive={activeFilterTag === "fps"}
            onClick={() => setActiveFilterTag("fps")}
          />
          <TagPill
            label="Farm / Relax"
            isActive={activeFilterTag === "farm"}
            onClick={() => setActiveFilterTag("farm")}
          />
        </div>
      </section>

      {/* GRID DE JOGOS */}
      <section style={{ marginBottom: 22 }}>
        {loading ? (
          <p
            style={{
              fontSize: 12,
              color: "rgba(226,232,240,0.9)",
            }}
          >
            Carregando jogos do catálogo...
          </p>
        ) : filteredGames.length === 0 ? (
          <p
            style={{
              fontSize: 12,
              color: "rgba(226,232,240,0.9)",
            }}
          >
            Nenhum jogo encontrado com esses filtros. Tente outro termo ou
            importe alguns jogos pela API de admin.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: 12,
            }}
          >
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isFavorite={favorites.includes(game.id)}
                onToggleFavorite={() => toggleFavorite(game.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* FAVORITOS (VISUAL) */}
      {favoriteGames.length > 0 && (
        <section
          style={{
            borderTop: "1px solid rgba(148,163,184,0.35)",
            paddingTop: 14,
          }}
        >
          <h2
            style={{
              fontSize: 15,
              margin: "0 0 8px",
              fontWeight: 600,
            }}
          >
            Seus favoritos nesta sessão
          </h2>
          <p
            style={{
              fontSize: 11,
              margin: "0 0 10px",
              color: "rgba(148,163,184,0.95)",
            }}
          >
            Estes favoritos estão salvos apenas neste navegador. Em uma versão
            futura, o login vai guardar sua lista na conta PlaySpot.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
              gap: 10,
            }}
          >
            {favoriteGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isFavorite={true}
                onToggleFavorite={() => toggleFavorite(game.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
