// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

// Lista de países com códigos mais comuns
const COUNTRY_CODES = [
  { code: "+55", country: "BR", flag: "🇧🇷", name: "Brasil" },
  { code: "+1", country: "US", flag: "🇺🇸", name: "EUA/Canadá" },
  { code: "+54", country: "AR", flag: "🇦🇷", name: "Argentina" },
  { code: "+56", country: "CL", flag: "🇨🇱", name: "Chile" },
  { code: "+57", country: "CO", flag: "🇨🇴", name: "Colômbia" },
  { code: "+52", country: "MX", flag: "🇲🇽", name: "México" },
  { code: "+351", country: "PT", flag: "🇵🇹", name: "Portugal" },
  { code: "+34", country: "ES", flag: "🇪🇸", name: "Espanha" },
  { code: "+44", country: "GB", flag: "🇬🇧", name: "Reino Unido" },
  { code: "+33", country: "FR", flag: "🇫🇷", name: "França" },
  { code: "+49", country: "DE", flag: "🇩🇪", name: "Alemanha" },
  { code: "+39", country: "IT", flag: "🇮🇹", name: "Itália" },
];

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+55"); // Padrão Brasil
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validarEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  
  const validarPhone = (p) => /^[0-9\s\-()]{6,20}$/.test(p);

  async function waitForAuthMe(retries = 5, delayMs = 200) {
    for (let i = 0; i < retries; i++) {
      try {
        const resp = await fetch("https://projeto-ia-a28p.onrender.com/auth/me", {
          credentials: "include",
        });
        if (resp.ok) {
          const data = await resp.json().catch(() => null);
          if (data && data.user) return data.user;
        }
      } catch (e) {
        // ignore e tenta novamente
      }
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
      // Concatena o código do país com o telefone
      const fullPhone = countryCode + phone;
      
      const resp = await fetch("https://projeto-ia-a28p.onrender.com/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, phone: fullPhone, name }),
      });

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        setError(data.error || "Erro ao cadastrar");
        setLoading(false);
        return;
      }

      const user = await waitForAuthMe(6, 200);
      window.dispatchEvent(new Event("auth-changed"));
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Register error:", err);
      setError("Erro de rede. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
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

        {/* Campo de telefone com seletor de país */}
        <div className="phone-input-group">
          <select
            className="country-select"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
          >
            {COUNTRY_CODES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.code}
              </option>
            ))}
          </select>
          
          <input
            className="auth-input phone-input"
            type="tel"
            placeholder="51999999999"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

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