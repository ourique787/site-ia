// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validarEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const validarPhone = (p) => /^\+?[0-9\s\-()]{6,20}$/.test(p);

  // tenta obter /auth/me algumas vezes para garantir que o cookie httpOnly foi aplicado
  async function waitForAuthMe(retries = 5, delayMs = 200) {
    for (let i = 0; i < retries; i++) {
      try {
        const resp = await fetch("http://localhost:4000/auth/me", {
          credentials: "include",
        });
        if (resp.ok) {
          const data = await resp.json().catch(() => null);
          if (data && data.user) return data.user;
        }
      } catch (e) {
        // ignore e tenta novamente
      }
      // espera antes de tentar novamente (backoff linear)
      await new Promise((r) => setTimeout(r, delayMs));
      delayMs = Math.min(1000, delayMs * 1.8);
    }
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validarEmail(email)) return setError("Email inválido.");
    if (!validarPhone(phone)) return setError("Telefone inválido.");
    if (!password || password.length < 6)
      return setError("Senha deve ter ao menos 6 caracteres.");
    if (password !== confirm) return setError("Senhas não conferem.");

    setLoading(true);
    try {
      const resp = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        credentials: "include", // importante para receber cookie httpOnly
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, phone, name }),
      });

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        setError(data.error || "Erro ao cadastrar");
        setLoading(false);
        return;
      }

      // 1) tenta confirmar a sessão no backend (p/ garantir que cookie foi aplicado)
      const user = await waitForAuthMe(6, 200);

      // 2) dispare evento global para que AuthProvider atualize o estado
      window.dispatchEvent(new Event("auth-changed"));

      // 3) redireciona para a home ou dashboard
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Register error:", err);
      setError("Erro de rede. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // ✨ ATUALIZAÇÃO: Usando a classe que define o layout de página cheia e o fundo escuro.
    <div className="auth-page-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="auth-title">Cadastre-se</h1>
        {error && <div className="auth-error">{error}</div>}

        <input
          className="auth-input"
          type="text"
          placeholder="Nome (opcional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="auth-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="auth-input"
          type="tel"
          placeholder="Telefone (ex: +5511999999999)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Confirme a senha"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <button className="auth-button" type="submit" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>

        <p className="auth-link">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </div>
  );
}