// src/frontend/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadMe() {
      setLoadingUser(true);
      setError(null);
      try {
        console.debug("[Dashboard] fetching /auth/me...");
        const resp = await fetch("http://localhost:4000/auth/me", {
          credentials: "include",
        });

        // debug info
        console.debug("[Dashboard] /auth/me status:", resp.status);

        if (!resp.ok) {
          // tenta ler a resposta para debug
          let txt;
          try { txt = await resp.text(); } catch { txt = "(no body)"; }
          console.warn("[Dashboard] /auth/me não ok. body:", txt);
          // se não autenticado redireciona
          navigate("/login");
          return;
        }

        const data = await resp.json();
        if (!mounted) return;
        setUser(data.user);
        setName(data.user.name || "");
        setPhone(data.user.phone || "");
      } catch (e) {
        console.error("[Dashboard] erro ao buscar /auth/me:", e);
        // fallback: redireciona ao login para renovar credenciais
        navigate("/login");
      } finally {
        if (mounted) setLoadingUser(false);
      }
    }

    loadMe();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:4000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.warn("logout failed", e);
    } finally {
      navigate("/login");
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSaving(true);

    try {
      const resp = await fetch("http://localhost:4000/auth/me", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name || undefined, phone: phone || undefined }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        setError(data.error || "Erro ao salvar dados");
      } else {
        setUser(data.user);
        setMessage("Perfil atualizado com sucesso.");
      }
    } catch (e) {
      console.error("[Dashboard] handleSaveProfile error", e);
      setError("Erro de rede.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3500);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!currentPassword || !newPassword) {
      setError("Informe senha atual e nova senha.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Nova senha precisa ter ao menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("Confirmação de nova senha não confere.");
      return;
    }

    setSaving(true);
    try {
      const resp = await fetch("http://localhost:4000/auth/me", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        setError(data.error || "Erro ao alterar senha");
      } else {
        setMessage("Senha alterada com sucesso. Faça login novamente.");
        setTimeout(async () => {
          try { await fetch("http://localhost:4000/auth/logout", { method: "POST", credentials: "include" }); } catch {}
          navigate("/login");
        }, 1400);
      }
    } catch (e) {
      console.error("[Dashboard] change password error", e);
      setError("Erro de rede.");
    } finally {
      setSaving(false);
    }
  };

  if (loadingUser) return <div className="auth-container"><div className="auth-form">Carregando...</div></div>;

  // fallback: se por algum motivo user é null mostre um aviso (evita branco)
  if (!user) {
    return (
      <div className="auth-container">
        <div className="auth-form">
          <h2>Minha Conta</h2>
          <p>Usuário não encontrado. Redirecionando para login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container dashboard-wrap">
      <div className="auth-form dashboard-card" style={{ maxWidth: 900 }}>
        <h2>Minha Conta</h2>

        {error && <div className="auth-error" style={{ marginBottom: 12 }}>{error}</div>}
        {message && <div className="auth-success" style={{ marginBottom: 12 }}>{message}</div>}

        <section className="account-section">
          <strong>Assinatura:</strong>
          <div className="sub-status">{user?.subscriptionStatus || "inativa"}</div>
        </section>

        <form onSubmit={handleSaveProfile} className="profile-form">
          <label>Nome</label>
          <input className="auth-input" value={name} onChange={(e) => setName(e.target.value)} />

          <label>Email (não editável)</label>
          <input className="auth-input" value={user?.email || ""} readOnly />

          <label>Telefone</label>
          <input className="auth-input" value={phone} onChange={(e) => setPhone(e.target.value)} />

          <div className="actions-row">
            <button className="auth-button" type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar alterações"}</button>
            <button type="button" className="auth-button alt" onClick={() => { setName(user?.name || ""); setPhone(user?.phone || ""); }}>Reverter</button>
          </div>
        </form>

        <hr />

        <form onSubmit={handleChangePassword} className="password-form">
          <h3>Alterar senha</h3>
          <label>Senha atual</label>
          <input className="auth-input" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />

          <label>Nova senha</label>
          <input className="auth-input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

          <label>Confirme nova senha</label>
          <input className="auth-input" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />

          <div className="actions-row" style={{ marginTop: 12 }}>
            <button className="auth-button" type="submit" disabled={saving}>{saving ? "Atualizando..." : "Alterar senha"}</button>
          </div>
        </form>

        <hr />

        <div className="actions-row bottom">
          <button className="auth-button danger" onClick={handleLogout}>Sair</button>
          <button className="auth-button" onClick={() => navigate("/")}>Voltar ao site</button>
        </div>
      </div>
    </div>
  );
}
