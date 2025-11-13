import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import "../styles/header.css";

export default function Header() {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("https://projeto-ia-a28p.onrender.com/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
    }
    if (auth?.setUser) auth.setUser(null);
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/");
  };

  const isSubscribed = auth?.user?.subscriptionStatus === "active";
  
  const formatEndDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <header style={{
      background: "#0f1724", 
      color: "#fff",
      padding: "12px 0", 
      borderBottom: "1px solid rgba(255,255,255,0.04)"
    }}>
      <div className="container" style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between" 
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Link to="/" style={{ 
            color: "#fff", 
            textDecoration: "none", 
            fontWeight: 700, 
            fontSize: 18 
          }}>
            IA Whatsapp
          </Link>
        </div>
        
        <nav style={{ display: "flex", gap: 14, alignItems: "center" }}>
          {auth?.user ? (
            <>
              <Link to="/dashboard" style={{ 
                color: "#fff", 
                textDecoration: "none" 
              }}>
                Dashboard
              </Link>
              
              {isSubscribed ? (
                <span style={{
                  color: "#4ade80",
                  fontSize: 14,
                  padding: "8px 12px",
                  background: "rgba(74, 222, 128, 0.1)",
                  borderRadius: 8,
                  whiteSpace: "nowrap"
                }}>
                  {auth.user.subscriptionEndDate ? (
                    <>✓ Assinante até {formatEndDate(auth.user.subscriptionEndDate)}</>
                  ) : (
                    <>✓ Assinante ativo</>
                  )}
                </span>
              ) : (
                <Link to="/compra" style={{
                  background: "#0f1724",
                  color: "#fff",
                  padding: "8px 12px",
                  borderRadius: 8,
                  textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.1)"
                }}>
                  Assinar
                </Link>
              )}

              <button onClick={handleLogout} style={{
                background: "transparent", 
                color: "#fff", 
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "6px 10px", 
                borderRadius: 8, 
                cursor: "pointer"
              }}>
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ 
                color: "#fff", 
                textDecoration: "none" 
              }}>
                Login
              </Link>
              <Link to="/cadastro" style={{
                color: "#0f1724", 
                background: "#fff", 
                padding: "6px 10px", 
                borderRadius: 8, 
                textDecoration: "none"
              }}>
                Cadastro
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}