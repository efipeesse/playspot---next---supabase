"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/simple-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Senha incorreta.");
        setLoading(false);
        return;
      }

      // Login OK → vai pra /admin
      router.push("/admin");
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top, #1f2937 0, #020617 45%, #000 100%)",
        color: "#f9fafb",
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          borderRadius: "24px",
          padding: "2rem",
          background:
            "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(8,47,73,0.98))",
          boxShadow: "0 25px 70px rgba(15,23,42,0.85)",
          border: "1px solid rgba(148,163,184,0.25)",
        }}
      >
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.25rem" }}>
          PlaySpot · Admin
        </h1>
        <p style={{ fontSize: "0.9rem", color: "#cbd5f5", marginBottom: "1.5rem" }}>
          Área restrita. Informe a senha de administrador para continuar.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
          <label style={{ fontSize: "0.8rem", color: "#e5e7eb" }}>
            Senha de administrador
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a senha"
              required
              style={{
                marginTop: "0.4rem",
                width: "100%",
                padding: "0.7rem 0.85rem",
                borderRadius: "999px",
                border: "1px solid rgba(148,163,184,0.4)",
                backgroundColor: "rgba(15,23,42,0.9)",
                color: "#f9fafb",
                outline: "none",
              }}
            />
          </label>

          {error && (
            <div
              style={{
                fontSize: "0.8rem",
                color: "#fecaca",
                backgroundColor: "rgba(127,29,29,0.45)",
                borderRadius: "12px",
                padding: "0.6rem 0.8rem",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "0.4rem",
              width: "100%",
              borderRadius: "999px",
              padding: "0.75rem",
              border: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
              cursor: loading ? "default" : "pointer",
              background:
                "linear-gradient(135deg, #22c55e, #16a34a 40%, #22c55e 65%, #4ade80)",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Entrando..." : "Entrar no painel"}
          </button>
        </form>
      </div>
    </main>
  );
}
