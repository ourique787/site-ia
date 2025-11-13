import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/dashboard.css";

export default function Success() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    
    if (!sessionId) {
      console.warn("Session ID não encontrado na URL, redirecionando para dashboard...");
      setTimeout(() => {
        navigate("/dashboard", { 
          state: { 
            message: "Redirecionando para o dashboard..." 
          } 
        });
      }, 1500);
      return;
    }

    async function verifyPayment() {
      try {
        const resp = await fetch(
          `https://projeto-ia-a28p.onrender.com/subscription/verify-session?session_id=${sessionId}`,
          {
            credentials: "include",
          }
        );

        if (resp.ok) {
          const data = await resp.json();
          
          if (data.success) {
            setTimeout(() => {
              navigate("/dashboard", { 
                state: { 
                  message: "Pagamento realizado com sucesso! Sua assinatura está ativa." 
                } 
              });
            }, 2000);
            return;
          }
        }
        
        console.log("Verificação não disponível, redirecionando mesmo assim...");
        setTimeout(() => {
          navigate("/dashboard", { 
            state: { 
              message: "Pagamento processado! Verifique sua assinatura no dashboard." 
            } 
          });
        }, 2000);
      } catch (e) {
        console.error("Erro ao verificar pagamento:", e);
        setTimeout(() => {
          navigate("/dashboard", { 
            state: { 
              message: "Redirecionando para o dashboard..." 
            } 
          });
        }, 2000);
      }
    }

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div className="dashboard-page-container">
      <div className="dashboard-card" style={{ maxWidth: 500, textAlign: "center" }}>
        {loading && !error && (
          <>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>✅</div>
            <h2>Processando seu pagamento...</h2>
            <p style={{ color: "#94a3b8", marginTop: "16px" }}>
              Aguarde enquanto confirmamos sua assinatura.
            </p>
          </>
        )}

        {error && (
          <>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>⚠️</div>
            <h2>Erro ao processar pagamento</h2>
            <p style={{ color: "#ef4444", marginTop: "16px" }}>{error}</p>
            <p style={{ color: "#94a3b8", marginTop: "16px", fontSize: "14px" }}>
              Você será redirecionado para o dashboard em instantes...
            </p>
          </>
        )}
      </div>
    </div>
  );
}

