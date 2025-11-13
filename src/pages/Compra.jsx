import React, { useState } from "react";

export default function Compra() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const priceId = import.meta.env.VITE_PRICE_ID

  const handleBuy = async () => {
    setError(null);
    setLoading(true);

    if (!priceId) {
        setError("Erro: VITE_PRICE_ID não está configurado no ambiente.");
        setLoading(false);
        console.error("VITE_PRICE_ID is null or undefined. Check your environment settings.");
        return;
    }
    
    try {
      const resp = await fetch("https://projeto-ia-a28p.onrender.com/auth/create-checkout-session", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        setError(data.error || "Falha ao iniciar pagamento. Verifique o console.");
        setLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Resposta inesperada do servidor.");
        setLoading(false);
      }
    } catch (e) {
      console.error("Erro iniciar checkout:", e);
      setError("Erro de rede. Tente novamente.");
      setLoading(false);
    }
  };

  const cardStyle = {
    maxWidth: '500px',
    margin: '4rem auto 2rem auto',
    padding: '30px',
    borderRadius: '16px',
    background: '#1e293b',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
    color: '#e2e8f0',
    fontFamily: '"Poppins", sans-serif',
  };

  const planBoxStyle = {
    border: '2px solid #6366F1',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    background: 'rgba(99, 102, 241, 0.1)',
  };
  
  const buttonStyle = {
    background: 'linear-gradient(135deg, #635bff 0%, #4f46e5 100%)',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: loading ? 'wait' : 'pointer',
    transition: 'opacity 0.2s, transform 0.1s',
    width: '100%',
    marginTop: '20px',
    opacity: loading ? 0.7 : 1,
    transform: loading ? 'scale(0.99)' : 'scale(1)',
  };

  const errorStyle = {
    color: '#f87171',
    background: 'rgba(248, 113, 113, 0.1)',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #f87171',
  };
  
  const titleStyle = {
      fontSize: '1.8rem',
      fontWeight: '800',
      marginBottom: '10px',
      color: '#fff'
  }

  const priceTextStyle = {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#4ade80',
      marginBottom: '8px'
  }
  
  const subtitleStyle = {
      color: '#cbd5e1',
      fontSize: '0.9rem'
  }

  return (
    <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        background: '#0f1724'
    }}>
        <div style={cardStyle}>
            <h2 style={titleStyle}>Finalizar Assinatura</h2>
            <p style={{marginBottom: '25px', color: '#94a3b8'}}>Confirme os detalhes do seu plano para prosseguir.</p>

            <div style={planBoxStyle}>
                <h3 style={{fontSize: '1.2rem', color: '#fff', marginBottom: '15px'}}>Plano Mensal Premium</h3>
                
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div style={{fontSize: '1rem', color: '#cbd5e1'}}>Cobrança Recorrente:</div>
                    <div style={priceTextStyle}>R$ 29,90</div>
                </div>
                <p style={subtitleStyle}>Valor total por mês, cobrado via Stripe.</p>
            </div>

            {error && <div style={errorStyle}>{error}</div>}
            
            <p style={{marginTop: '10px', color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center'}}>
                Ao clicar em "Assinar", você será redirecionado para a página de pagamento seguro do Stripe.
            </p>

            <button 
                onClick={handleBuy} 
                disabled={loading}
                style={buttonStyle}
            >
                {loading ? "Aguarde, redirecionando..." : "Assinar com Stripe"}
            </button>
        </div>
    </div>
  );
}
