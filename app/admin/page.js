'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [secret, setSecret] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const [manualGame, setManualGame] = useState({
    title: '',
    description: '',
    imageUrl: '',
    tags: '',
    downloadUrl: '',
  });

  const [steamAppId, setSteamAppId] = useState('');

  async function handleManualSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      const res = await fetch('/api/admin/add-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret,
          title: manualGame.title,
          description: manualGame.description,
          image_url: manualGame.imageUrl,
          tags: manualGame.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          download_url: manualGame.downloadUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao adicionar jogo.');

      setStatus('✅ Jogo adicionado com sucesso!');
      setManualGame({
        title: '',
        description: '',
        imageUrl: '',
        tags: '',
        downloadUrl: '',
      });
    } catch (err) {
      setStatus('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSteamImport(e) {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      const res = await fetch(`/api/admin/import/steam/${steamAppId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao importar da Steam.');

      setStatus(
        `✅ Jogo importado com sucesso: ${
          data.game?.title || '(sem título retornado)'
        }`
      );
      setSteamAppId('');
    } catch (err) {
      setStatus('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top, #0f172a, #020617)',
        color: '#e5e7eb',
        padding: '32px 16px',
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: '0 auto',
          borderRadius: 16,
          padding: 24,
          background:
            'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(15,23,42,0.7))',
          boxShadow: '0 20px 45px rgba(15,23,42,0.8)',
          border: '1px solid rgba(148,163,184,0.3)',
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
          Painel PlaySpot — Admin
        </h1>
        <p style={{ fontSize: 14, color: '#9ca3af', marginBottom: 24 }}>
          Use este painel para adicionar jogos manualmente ou importar pela
          Steam (AppID). Apenas quem conhece a senha de admin consegue salvar.
        </p>

        {/* Senha de admin */}
        <section
          style={{
            marginBottom: 24,
            padding: 16,
            borderRadius: 12,
            backgroundColor: 'rgba(15,23,42,0.8)',
            border: '1px solid rgba(148,163,184,0.4)',
          }}
        >
          <label
            style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Senha de admin
          </label>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Digite a senha configurada em ADMIN_SECRET"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid rgba(148,163,184,0.6)',
              backgroundColor: '#020617',
              color: '#e5e7eb',
              fontSize: 14,
            }}
          />
          <p
            style={{
              marginTop: 8,
              fontSize: 12,
              color: '#9ca3af',
            }}
          >
            Dica: escolha uma senha forte e não compartilhe este link de admin
            com ninguém.
          </p>
        </section>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            gap: 24,
          }}
        >
          {/* Formulário manual */}
          <section
            style={{
              padding: 16,
              borderRadius: 12,
              backgroundColor: 'rgba(15,23,42,0.9)',
              border: '1px solid rgba(59,130,246,0.4)',
            }}
          >
            <h2
              style={{
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              Adicionar jogo manualmente
            </h2>
            <form onSubmit={handleManualSubmit} style={{ display: 'grid', gap: 12 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500 }}>Título *</label>
                <input
                  type="text"
                  value={manualGame.title}
                  onChange={(e) =>
                    setManualGame({ ...manualGame, title: e.target.value })
                  }
                  required
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid rgba(148,163,184,0.6)',
                    backgroundColor: '#020617',
                    color: '#e5e7eb',
                    fontSize: 14,
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 500 }}>
                  Link de download / loja *
                </label>
                <input
                  type="url"
                  value={manualGame.downloadUrl}
                  onChange={(e) =>
                    setManualGame({
                      ...manualGame,
                      downloadUrl: e.target.value,
                    })
                  }
                  required
                  placeholder="https://store.steampowered.com/app/XXXXXX/..."
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid rgba(148,163,184,0.6)',
                    backgroundColor: '#020617',
                    color: '#e5e7eb',
                    fontSize: 14,
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 500 }}>
                  URL da imagem (capa)
                </label>
                <input
                  type="url"
                  value={manualGame.imageUrl}
                  onChange={(e) =>
                    setManualGame({ ...manualGame, imageUrl: e.target.value })
                  }
                  placeholder="https://..."
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid rgba(148,163,184,0.6)',
                    backgroundColor: '#020617',
                    color: '#e5e7eb',
                    fontSize: 14,
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 500 }}>Tags</label>
                <input
                  type="text"
                  value={manualGame.tags}
                  onChange={(e) =>
                    setManualGame({ ...manualGame, tags: e.target.value })
                  }
                  placeholder="Ex: Indie, Soulslike, RPG"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid rgba(148,163,184,0.6)',
                    backgroundColor: '#020617',
                    color: '#e5e7eb',
                    fontSize: 14,
                  }}
                />
                <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
                  Separe por vírgula. Exemplo: <b>Indie, Soulslike, FPS</b>
                </p>
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 500 }}>
                  Descrição
                </label>
                <textarea
                  value={manualGame.description}
                  onChange={(e) =>
                    setManualGame({
                      ...manualGame,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid rgba(148,163,184,0.6)',
                    backgroundColor: '#020617',
                    color: '#e5e7eb',
                    fontSize: 14,
                    resize: 'vertical',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !secret}
                style={{
                  marginTop: 4,
                  padding: '10px 14px',
                  borderRadius: 999,
                  border: 'none',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: loading || !secret ? 'not-allowed' : 'pointer',
                  opacity: loading || !secret ? 0.6 : 1,
                  background:
                    'linear-gradient(to right, #22c55e, #16a34a, #15803d)',
                  color: '#0b1120',
                }}
              >
                {loading ? 'Salvando...' : 'Salvar jogo manualmente'}
              </button>
            </form>
          </section>

          {/* Importar da Steam */}
          <section
            style={{
              padding: 16,
              borderRadius: 12,
              backgroundColor: 'rgba(15,23,42,0.9)',
              border: '1px solid rgba(56,189,248,0.4)',
            }}
          >
            <h2
              style={{
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              Importar jogo pela Steam (AppID)
            </h2>
            <form onSubmit={handleSteamImport} style={{ display: 'grid', gap: 12 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500 }}>
                  Steam AppID
                </label>
                <input
                  type="text"
                  value={steamAppId}
                  onChange={(e) => setSteamAppId(e.target.value)}
                  placeholder="Ex: 620 (Portal 2), 730 (CS2), etc."
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid rgba(148,163,184,0.6)',
                    backgroundColor: '#020617',
                    color: '#e5e7eb',
                    fontSize: 14,
                  }}
                />
                <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
                  O AppID é o número que aparece na URL da Steam:
                  <br />
                  <code>https://store.steampowered.com/app/</code>
                  <b>620</b>
                  <code>/Portal_2/</code>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !secret || !steamAppId}
                style={{
                  marginTop: 4,
                  padding: '10px 14px',
                  borderRadius: 999,
                  border: 'none',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor:
                    loading || !secret || !steamAppId ? 'not-allowed' : 'pointer',
                  opacity: loading || !secret || !steamAppId ? 0.6 : 1,
                  background:
                    'linear-gradient(to right, #38bdf8, #0ea5e9, #0284c7)',
                  color: '#0b1120',
                }}
              >
                {loading ? 'Importando...' : 'Importar da Steam'}
              </button>
            </form>
          </section>
        </div>

        {status && (
          <div
            style={{
              marginTop: 20,
              padding: 12,
              borderRadius: 10,
              backgroundColor: 'rgba(15,23,42,0.9)',
              border: '1px solid rgba(148,163,184,0.4)',
              fontSize: 14,
            }}
          >
            {status}
          </div>
        )}
      </div>
    </main>
  );
}
