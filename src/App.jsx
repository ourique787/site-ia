import React, { useEffect, useState, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Cadastro from "./pages/Cadastro";
import RecuperarSenha from "./pages/RecuperarSenha/RecuperarSenha.jsx";
import ResetarSenha from "./pages/ResetarSenha/ResetarSenha.jsx";
import Login from "./pages/Login";
import Compra from "./pages/Compra";
import Dashboard from "./pages/Dashboard";
import Success from "./pages/Success";
import Header from "./pages/Header.jsx";

import "./styles/header.css";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const checkAuth = async () => {
      try {
        const res = await fetch("https://projeto-ia-a28p.onrender.com/auth/me", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          if (mounted) setUser(data.user);
        } else {
          if (mounted) setUser(null);
        }
      } catch (err) {
        console.error("Erro ao verificar sessão:", err);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    checkAuth();

    const onAuthChanged = () => {
      checkAuth();
    };
    window.addEventListener("auth-changed", onAuthChanged);
    return () => {
      mounted = false;
      window.removeEventListener("auth-changed", onAuthChanged);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "3rem" }}>Verificando autenticação...</div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/resetar-senha/:token" element={<ResetarSenha />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/compra"
            element={
              <ProtectedRoute>
                <Compra />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/success"
            element={
              <ProtectedRoute>
                <Success />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
