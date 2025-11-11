import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function Login() {
  const [identificador, setIdentificador] = useState(""); // email ou telefone
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isEmail = (str) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(str);
  const isPhone = (str) => /^\+?[0-9\s\-()]{6,20}$/.test(str);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!identificador || !senha) {
      setError("Preencha email/telefone e senha.");
      return;
    }

    const payload = { password: senha, identifier: identificador };

    setLoading(true);
    try {
      const resp = await fetch("https://projeto-ia-a28p.onrender.com/auth/login", {
        method: "POST",
        credentials: "include", // para o cookie httpOnly
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        setError(data.error || "Falha ao autenticar. Tente novamente.");
        setLoading(false);
        return;
      }

      // Sucesso → cookie já está setado
      // 🔄 Notifica o AuthProvider para atualizar o contexto
      window.dispatchEvent(new Event("auth-changed"));

      // Redireciona para a home
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError("Erro de rede. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // ✨ Usando a nova classe para o contêiner de página cheia
    <div className="auth-page-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h1 className="auth-title">Bem-vindo 👋</h1>
        <p className="auth-subtitle">Entre para continuar</p>

        {error && <div className="auth-error">{error}</div>}

        <input
          className="auth-input"
          type="text"
          placeholder="Email ou telefone"
          value={identificador}
          onChange={(e) => setIdentificador(e.target.value)}
          required
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button className="auth-button" type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p className="auth-link">
          Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </form>
    </div>
  );
}