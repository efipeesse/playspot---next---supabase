"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { useState } from "react";

export default function AdminPage() {
  const [mode, setMode] = useState("manual");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [tagsText, setTagsText] = useState("");

  const [steamAppId, setSteamAppId] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      let res;

      if (mode === "manual") {
        res = await fetch("/api/admin/add-game", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            imageUrl,
            downloadUrl,
            tags: tagsText.split(",").map((s) => s.trim()),
          }),
        });
      } else if (mode === "steam") {
        res = await fetch(`/api/admin/import/steam/${steamAppId}`, {
          method: "POST",
        });
      }

      const data = await res.json();

      if (data.success) {
        setMessage({ type: "success", text: "Jogo salvo com sucesso!" });
      } else {
        setMessage({ type: "error", text: data.error || "Erro ao salvar." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Erro no servidor." });
      console.error(err);
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ color: "white", marginBottom: "25px" }}>PlaySpot • Admin</h1>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <button
          onClick={() => setMode("manual")}
          style={{
            padding: "12px 20px",
            background: mode === "manual" ? "#00ff66" : "#003300",
            color: "white",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Adicionar Manualmente
        </button>

        <button
          onClick={() => setMode("steam")}
          style={{
            padding: "12px 20px",
            background: mode === "steam" ? "#00ff66" : "#003300",
            color: "white",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Importar da Steam (AppID)
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {mode === "manual" ? (
          <>
            <input
              placeholder="Título do jogo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={input}
            />

            <textarea
              placeholder="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ ...input, height: "120px" }}
            />

            <input
              placeholder="URL da imagem"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              style={input}
            />

            <input
              placeholder="URL oficial do jogo"
              value={downloadUrl}
              onChange={(e) => setDownloadUrl(e.target.value)}
              style={input}
            />

            <input
              placeholder="Tags (separadas por vírgula)"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              style={input}
            />
          </>
        ) : (
          <>
            <input
              placeholder="Steam AppID"
              value={steamAppId}
              onChange={(e) => setSteamAppId(e.target.value)}
              style={input}
            />
          </>
        )}

        {message && (
          <div
            style={{
              background: message.type === "success" ? "#004d00" : "#660000",
              color: "white",
              padding: "10px",
              borderRadius: "10px",
              marginTop: "15px",
            }}
          >
            {message.text}
          </div>
        )}

        <button
          disabled={loading}
          style={{
            marginTop: "25px",
            padding: "15px",
            width: "100%",
            background: "#00ff66",
            color: "#003300",
            borderRadius: "10px",
            border: "none",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          {loading ? "Salvando..." : "Salvar Jogo"}
        </button>
      </form>
    </div>
  );
}

const input = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "10px",
  border: "none",
  outline: "none",
  marginBottom: "15px",
};
