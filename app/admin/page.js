"use client";

import { useState } from "react";

export default function AdminPage() {
  const [mode, setMode] = useState("manual"); // "manual" ou "steam"

  // Campos modo manual
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [tagsText, setTagsText] = useState("");

  // Campo modo steam
  const [steamAppId, setSteamAppId] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success" | "error", text: string }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      let body;

      if (mode === "manual") {
        const tagsArray = tagsText
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);

        body = {
          mode: "manual",
          title,
          description,
          image_url: imageUrl,
          download_url: downloadUrl,
          tags: tagsArray,
        };
      } else {
        // modo steam
        body = {
          mode: "steam",
          appId: steamAppId.trim(),
        };
      }

      const res = await fetch("/api/admin/add-game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao salvar jogo.");
      }

      setMessage({
        type: "success",
        text: data.message || "Jogo salvo com sucesso!",
      });

      // Limpa os campos
      if (mode === "manual") {
        setTitle("");
        setDescription("");
        setImageUrl("");
        setDownloadUrl("");
        setTagsText("");
      } else {
        setSteamAppId("");
      }
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.message || "Erro inesperado.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #02101f, #000)",
        color: "#f3f4f6",
        padding: "40px 16px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "720px",
          background:
            "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(15,23,42,0.9))",
          borderRadius: "24px",
          border: "1px solid rgba(148,163,184,0.3)",
          boxShadow: "0 0 40px rgba(56,189,248,0.25)",
          padding: "24px 20px 32px",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            marginBottom: "4px",
          }}
        >
          PlaySpot · Admin
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "rgba(148,163,184,0.9)",
            marginBottom: "20px",
          }}
        >
          Gerencie o catálogo de jogos. Aqui você pode adicionar jogos
          manualmente ou importar informações básicas da Steam usando o AppID.
        </p>

        {/* Toggle de modo */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "20px",
            backgroundColor: "rgba(15,23,42,0.9)",
            padding: "4px",
            borderRadius: "999px",
            border: "1px solid rgba(51,65,85,0.9)",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode("manual");
              setMessage(null);
            }}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
              background:
                mode === "manual"
                  ? "linear-gradient(135deg, #22c55e, #0ea5e9)"
                  : "transparent",
              color: mode === "manual" ? "#0b1120" : "#e5e7eb",
              transition: "all 0.15s ease-out",
            }}
          >
            Adicionar manualmente
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("steam");
              setMessage(null);
            }}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
              background:
                mode === "steam"
                  ? "linear-gradient(135deg, #0ea5e9, #6366f1)"
                  : "transparent",
              color: mode === "steam" ? "#0b1120" : "#e5e7eb",
              transition: "all 0.15s ease-out",
            }}
          >
            Importar da Steam (AppID)
          </button>
        </div>

        {/* Mensagens */}
        {message && (
          <div
            style={{
              marginBottom: "16px",
              padding: "10px 12px",
              borderRadius: "10px",
              fontSize: "13px",
              backgroundColor:
                message.type === "success"
                  ? "rgba(34,197,94,0.12)"
                  : "rgba(248,113,113,0.12)",
              border:
                message.type === "success"
                  ? "1px solid rgba(34,197,94,0.4)"
                  : "1px solid rgba(248,113,113,0.5)",
              color:
                message.type === "success"
                  ? "#bbf7d0"
                  : "#fecaca",
            }}
          >
            {message.text}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {mode === "manual" ? (
            <>
              <Field
                label="Título do jogo *"
                value={title}
                onChange={setTitle}
                placeholder="Ex: Hades, Elden Ring, Stardew Valley…"
              />
              <Field
                label="Descrição"
                value={description}
                onChange={setDescription}
                placeholder="Resumo curto sobre o jogo."
                textarea
              />
              <Field
                label="URL da imagem (capa)"
                value={imageUrl}
                onChange={setImageUrl}
                placeholder="https://…"
              />
              <Field
                label="URL oficial para baixar / comprar *"
                value={downloadUrl}
                onChange={setDownloadUrl}
                placeholder="Pode ser Steam, Epic, PSN, Xbox, site oficial, etc."
              />
              <Field
                label="Tags (separadas por vírgula)"
                value={tagsText}
                onChange={setTagsText}
                placeholder="Ex: PC, Roguelike, Indie, Game Pass…"
                help="Você pode misturar plataforma + gênero. Ex.: 'PS5, Soulslike, Exclusivo'."
              />
            </>
          ) : (
            <>
              <Field
                label="Steam AppID *"
                value={steamAppId}
                onChange={setSteamAppId}
                placeholder="Ex: 620980 (Hades), 570 (Dota 2)…"
                help="O AppID aparece na URL da Steam: https://store.steampowered.com/app/APPID/…"
              />
              <p
                style={{
                  fontSize: "12px",
                  color: "rgba(148,163,184,0.9)",
                  marginTop: "-4px",
                  marginBottom: "4px",
                }}
              >
                A importação da Steam é só um atalho: ela traz título, descrição,
                imagem e gêneros do jogo, mas você continua podendo cadastrar
                qualquer jogo manualmente de qualquer plataforma.
              </p>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "8px",
              padding: "10px 14px",
              borderRadius: "999px",
              border: "none",
              cursor: loading ? "wait" : "pointer",
              fontSize: "14px",
              fontWeight: 600,
              background:
                "linear-gradient(135deg, #22c55e, #0ea5e9, #6366f1)",
              color: "#0b1120",
              boxShadow: "0 0 25px rgba(59,130,246,0.5)",
              opacity: loading ? 0.7 : 1,
              transition: "opacity 0.15s ease-out, transform 0.1s ease-out",
            }}
          >
            {loading
              ? "Salvando..."
              : mode === "manual"
              ? "Adicionar jogo manualmente"
              : "Importar jogo da Steam"}
          </button>
        </form>
      </div>
    </main>
  );
}

// Componente de campo reutilizável
function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea = false,
  help,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <label style={{ fontSize: "13px", fontWeight: 500 }}>
        {label}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          style={{
            resize: "vertical",
            padding: "8px 10px",
            borderRadius: "10px",
            border: "1px solid rgba(51,65,85,0.9)",
            backgroundColor: "rgba(15,23,42,0.95)",
            color: "#e5e7eb",
            fontSize: "13px",
          }}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            padding: "8px 10px",
            borderRadius: "999px",
            border: "1px solid rgba(51,65,85,0.9)",
            backgroundColor: "rgba(15,23,42,0.95)",
            color: "#e5e7eb",
            fontSize: "13px",
          }}
        />
      )}
      {help && (
        <span
          style={{
            fontSize: "11px",
            color: "rgba(148,163,184,0.9)",
          }}
        >
          {help}
        </span>
      )}
    </div>
  );
}
