"use client";

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.error === "INVALID_PASSWORD") {
          setError("Senha incorreta.");
        } else if (data?.error === "SERVER_MISCONFIGURED") {
          setError("ADMIN_PASSWORD não está configurada no servidor.");
        } else {
          setError("Erro ao fazer login. Tente novamente.");
        }
        return;
      }

      router.push(redirectTo);
    } catch (err) {
      console.error(err);
      setError("Erro de rede. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at top, #0f172a, #020617)",
        padding: "16px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "440px",
          background:
            "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(30,64,175,0.8))",
          borderRadius: "24px",
          padding: "32px 28px",
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.70), 0 0 40px rgba(56,189,248,0.35)",
          color: "white",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "8px" }}>
          PlaySpot · Admin
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "rgba(226,232,240,0.8)",
            marginBottom: "24px",
          }}
        >
          Área restrita. Informe a senha de administrador para continuar.
        </p>

        <label
          htmlFor="password"
          style={{ fontSize: "14px", fontWeight: "500", marginBottom: "8px", display: "block" }}
        >
          Senha de administrador
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite a senha"
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "999px",
            border: "1px solid rgba(148,163,184,0.5)",
            background: "rgba(15,23,42,0.8)",
            color: "white",
            outline: "none",
            marginBottom: "14px",
          }}
        />

        {error && (
          <div
            style={{
              background: "rgba(248,113,113,0.15)",
              border: "1px solid rgba(248,113,113,0.5)",
              color: "#fecaca",
              borderRadius: "12px",
              padding: "8px 12px",
              fontSize: "13px",
              marginBottom: "14px",
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "999px",
            border: "none",
            fontWeight: "600",
            fontSize: "15px",
            background:
              "linear-gradient(90deg, #22c55e, #16a34a)",
            color: "#020617",
            cursor: loading ? "wait" : "pointer",
            opacity: loading ? 0.8 : 1,
            marginTop: "4px",
          }}
        >
          {loading ? "Entrando..." : "Entrar no painel"}
        </button>
      </form>
    </div>
  );
}
