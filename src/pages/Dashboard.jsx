import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/dashboard.css"; 

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

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // form state
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+55");
  const [phone, setPhone] = useState("");

  // password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Função para extrair código do país e número do telefone completo
  const parsePhoneNumber = (fullPhone) => {
    if (!fullPhone) return { code: "+55", number: "" };
    
    // Procura qual código do país corresponde
    const matchedCountry = COUNTRY_CODES.find(c => fullPhone.startsWith(c.code));
    
    if (matchedCountry) {
      return {
        code: matchedCountry.code,
        number: fullPhone.substring(matchedCountry.code.length)
      };
    }
    
    // Se não encontrou, assume que é o número todo
    return { code: "+55", number: fullPhone };
  };

  // Função para determinar a classe CSS do status
  const getSubscriptionStatusClass = (status) => {
    const normalizedStatus = status ? status.toLowerCase() : 'inativa';
    
    if (normalizedStatus === 'active' || normalizedStatus === 'ativa') {
      return 'sub-status-active';
    } else {
      return 'sub-status-inactive';
    }
  };

  useEffect(() => {
    let mounted = true;

    async function loadMe() {
      setLoadingUser(true);
      setError(null);
      try {
        const resp = await fetch("http://localhost:4000/auth/me", {
          credentials: "include",
        });

        if (!resp.ok) {
          navigate("/login");
          return;
        }

        const data = await resp.json();
        if (!mounted) return;
        setUser(data.user);
        setName(data.user.name || "");
        
        // Separa o código do país e o número
        const parsed = parsePhoneNumber(data.user.phone || "");
        setCountryCode(parsed.code);
        setPhone(parsed.number);
      } catch (e) {
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
      window.dispatchEvent(new Event("auth-changed")); 
      navigate("/login");
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSaving(true);

    try {
      // Concatena código do país + número
      const fullPhone = phone ? countryCode + phone : undefined;
      
      const resp = await fetch("http://localhost:4000/auth/me", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name || undefined, phone: fullPhone }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        setError(data.error || "Erro ao salvar dados");
      } else {
        setUser(data.user);
        setMessage("Perfil atualizado com sucesso.");
      }
    } catch (e) {
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
      setError("Erro de rede.");
    } finally {
      setSaving(false);
    }
  };

  const handleRevert = () => {
    setName(user?.name || "");
    const parsed = parsePhoneNumber(user?.phone || "");
    setCountryCode(parsed.code);
    setPhone(parsed.number);
  };

  const loadingFallback = (
    <div className="dashboard-page-container">
      <div className="dashboard-card" style={{ maxWidth: 400 }}>Carregando informações da conta...</div>
    </div>
  );

  if (loadingUser) return loadingFallback;

  if (!user) {
    return (
      <div className="dashboard-page-container">
        <div className="dashboard-card" style={{ maxWidth: 400 }}>
          <h2>Minha Conta</h2>
          <p>Usuário não encontrado. Redirecionando para login...</p>
        </div>
      </div>
    );
  }

  const subStatus = user?.subscriptionStatus || "inativa";

  return (
    <div className="dashboard-page-container">
      <div className="dashboard-card">
        <h2>Minha Conta</h2>

        {error && <div className="dashboard-error">{error}</div>}
        {message && <div className="dashboard-success">{message}</div>}

        <section className="account-section">
          <strong>Email:</strong>
          <div>{user?.email || "N/A"}</div>
          <strong>Assinatura:</strong>
          <div className={getSubscriptionStatusClass(subStatus)}>
            {subStatus}
          </div>
        </section>

        <form onSubmit={handleSaveProfile} className="profile-form">
          <h3>Informações do Perfil</h3>
          
          <label htmlFor="name-input" className="dashboard-label">Nome</label>
          <input 
            className="dashboard-input" 
            id="name-input"
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />

          <label htmlFor="email-input" className="dashboard-label">Email (não editável)</label>
          <input 
            className="dashboard-input" 
            id="email-input"
            value={user?.email || ""} 
            readOnly 
          />

          <label htmlFor="phone-input" className="dashboard-label">Telefone</label>
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
              className="dashboard-input phone-input" 
              id="phone-input"
              type="tel"
              placeholder="11 99999-9999"
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
            />
          </div>

          <div className="actions-row">
            <button className="dashboard-button" type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar alterações"}
            </button>
            <button 
              type="button" 
              className="dashboard-button alt" 
              onClick={handleRevert}
            >
              Reverter
            </button>
          </div>
        </form>

        <hr />

        <form onSubmit={handleChangePassword} className="password-form">
          <h3>Alterar Senha</h3>
          
          <label htmlFor="current-pass" className="dashboard-label">Senha atual</label>
          <input 
            className="dashboard-input" 
            id="current-pass"
            type="password" 
            value={currentPassword} 
            onChange={(e) => setCurrentPassword(e.target.value)} 
          />

          <label htmlFor="new-pass" className="dashboard-label">Nova senha</label>
          <input 
            className="dashboard-input" 
            id="new-pass"
            type="password" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
          />

          <label htmlFor="confirm-pass" className="dashboard-label">Confirme nova senha</label>
          <input 
            className="dashboard-input" 
            id="confirm-pass"
            type="password" 
            value={confirmNewPassword} 
            onChange={(e) => setConfirmNewPassword(e.target.value)} 
          />

          <div className="actions-row">
            <button className="dashboard-button" type="submit" disabled={saving}>
              {saving ? "Atualizando..." : "Alterar senha"}
            </button>
          </div>
        </form>

        <hr />

        <div className="actions-row bottom">
          <button className="dashboard-button danger" onClick={handleLogout}>Sair</button>
          <Link to="/" className="dashboard-button alt">Voltar ao site</Link> 
        </div>
      </div>
    </div>
  );
}