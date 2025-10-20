import React, { useEffect, useState, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Páginas
import Home from "./pages/Home";
import Cadastro from "./pages/Cadastro";
import RecuperarSenha from "./pages/RecuperarSenha/RecuperarSenha.jsx";
import ResetarSenha from "./pages/ResetarSenha/ResetarSenha.jsx";
import Header from "./pages/Header.jsx";
import Login from "./pages/Login";
import Compra from "./pages/Compra";
import Pagamento from "./Pagamento/Pagamento.jsx";
import Dashboard from "./pages/Dashboard.jsx";

import "./styles/header.css";
import "./styles/auth.css";
import "./styles/dashboard.css";

// === CONTEXTO DE AUTENTICAÇÃO === //
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para (re)carregar o usuário a partir do backend
  const refreshUser = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/auth/me", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user || null);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Erro ao checar sessão:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Checa sessão ao montar
    refreshUser();

    // Escuta evento global 'auth-changed' para atualizar contexto após login/register/logout
    const onAuthChanged = () => {
      refreshUser();
    };
    window.addEventListener("auth-changed", onAuthChanged);
    return () => window.removeEventListener("auth-changed", onAuthChanged);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// === ROTA PROTEGIDA === //
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "4rem" }}>
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// === APP PRINCIPAL === //
function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/resetar-senha/:token" element={<ResetarSenha />} />
          <Route path="/login" element={<Login />} />
          <Route path="/compra" element={<Compra />} />
          <Route path="/pagamento" element={<Pagamento />} />

          {/* Rota protegida */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Rota fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
