"use client";

import { useState } from "react";

export default function AdminPage() {
  const [manual, setManual] = useState({
    title: "",
    description: "",
    image_url: "",
    download_url: "",
    tags: "",
  });

  const [steamAppId, setSteamAppId] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function addManualGame(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const payload = {
      mode: "manual",
      ...manual,
      tags: manual.tags.split(",").map(t => t.trim()),
    };

    try {
      const res = await fetch("/api/admin/add-game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMsg("Jogo adicionado manualmente!");
      setManual({ title: "", description: "", image_url: "", download_url: "", tags: "" });
    } catch (e) {
      setMsg(e.message);
    }

    setLoading(false);
  }

  async function importFromSteam(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const payload = {
      mode: "steam",
      appId: steamAppId,
    };

    try {
      const res = await fetch("/api/admin/add-game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMsg("Jogo importado automaticamente da Steam!");
      setSteamAppId("");
    } catch (e) {
      setMsg(e.message);
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1 style={{ color: "#fff" }}>Painel Admin</h1>

      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ color: "#0f0" }}>Adicionar jogo manualmente</h2>
        <form onSubmit={addManualGame} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input placeholder="Título" value={manual.title} onChange={e => setManual({ ...manual, title: e.target.value })} />
          <textarea placeholder="Descrição" value={manual.description} onChange={e => setManual({ ...manual, description: e.target.value })} />
          <input placeholder="URL da imagem" value={manual.image_url} onChange={e => setManual({ ...manual, image_url: e.target.value })} />
          <input placeholder="URL de download (Steam/Epic/etc)" value={manual.download_url} onChange={e => setManual({ ...manual, download_url: e.target.value })} />
          <input placeholder="Tags separadas por vírgula" value={manual.tags} onChange={e => setManual({ ...manual, tags: e.target.value })} />

          <button disabled={loading} style={{ padding: "10px" }}>
            {loading ? "Enviando..." : "Adicionar Manualmente"}
          </button>
        </form>
      </div>

      <div>
        <h2 style={{ color: "#0f0" }}>Importar da Steam (automático)</h2>
        <form onSubmit={importFromSteam} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input placeholder="Steam App ID" value={steamAppId} onChange={e => setSteamAppId(e.target.value)} />
          <button disabled={loading} style={{ padding: "10px" }}>
            {loading ? "Importando..." : "Importar da Steam"}
          </button>
        </form>
      </div>

      {msg && (
        <p style={{ marginTop: "20px", color: "#fff" }}>
          {msg}
        </p>
      )}
    </div>
  );
}
