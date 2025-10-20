import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import "../styles/header.css";

export default function Header() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:4000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      window.dispatchEvent(new Event("auth-changed"));
      navigate("/", { replace: true });
    } catch (e) {
      console.error("Erro ao fazer logout:", e);
    }
  };

  return (
    <header className="main-header">
      <div className="header-container">
        <Link to="/" className="brand">
          IA WhatsApp
        </Link>

        <nav className="nav-links">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/cadastro" className="nav-link">
                Cadastro
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
