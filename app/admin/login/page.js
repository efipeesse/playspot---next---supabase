"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/admin";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError("Senha incorreta.");
        setLoading(false);
        return;
      }

      router.push(redirectTo);
    } catch (err) {
      setError("Erro ao conectar ao servidor.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", paddingTop: "60px" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: "360px",
          background: "#0a1a3a",
          padding: "30px",
          borderRadius: "15px",
          color: "white",
        }}
      >
        <h2 style={{ marginBottom: "15px", textAlign: "center" }}>PlaySpot • Admin</h2>
        <p style={{ opacity: 0.8, fontSize: "14px", marginBottom: "20px", textAlign: "center" }}>
          Área restrita. Digite a senha para continuar.
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha de administrador"
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: "10px",
            border: "none",
            outline: "none",
            marginBottom: "15px",
          }}
        />

        {error && (
          <div style={{ background: "#b30000", padding: "10px", borderRadius: "8px", marginBottom: "15px" }}>
            {error}
          </div>
        )}

        <button
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            background: "#00ff66",
            color: "#003300",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          {loading ? "Validando..." : "Entrar no painel"}
        </button>
      </form>
    </div>
  );
}
