"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      window.location.href = "/admin"; // redireciona pra área protegida
    } else {
      setError("Senha incorreta");
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", textAlign: "center" }}>
      <h1>Login Admin</h1>

      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10, borderRadius: 8 }}
        />
        <button style={{ padding: 12, borderRadius: 8, background: "#0070f3", color: "#fff" }}>
          Entrar
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
    </div>
  );
}
