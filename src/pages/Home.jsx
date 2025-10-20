import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";

export default function Home() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function check() {
      try {
        const resp = await fetch("http://localhost:4000/auth/me", { credentials: "include" });
        if (!mounted) return;
        setAuthed(resp.ok);
      } catch (e) {
        console.warn("home: auth check failed", e);
        setAuthed(false);
      } finally {
        if (mounted) setChecking(false);
      }
    }
    check();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="home-page">
      <main>
        <section className="hero container">
          <div className="hero-left">
            <h2 className="hero-title">Transforme seu WhatsApp em um assistente</h2>
            <p className="hero-sub">
              Receba transcrições automáticas de áudios em português e inglês,
              gere imagens a partir de texto e agende compromissos — tudo pelo
              seu WhatsApp, com integração simples e segura.
            </p>

            <div className="hero-actions">
              <Link to={authed ? "/dashboard" : "/cadastro"} className="cta-primary">Comece agora</Link>
              <Link to="/login" className="cta-outline">Já sou cliente</Link>
            </div>

            <ul className="hero-bullets">
              <li>Transcrição de áudio com tradução</li>
              <li>Geração de imagens por prompt</li>
              <li>Agendamentos com notificações personalizadas</li>
            </ul>
          </div>

          <div className="hero-right">
            <div className="phone-mock">
              <div className="phone-header">WhatsApp • Seu bot</div>
              <div className="phone-body">
                <div className="msg incoming">Enviar áudio para transcrever</div>
                <div className="msg outgoing">Transcrição em PT & EN pronta ✅</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>© {new Date().getFullYear()} IA Interativa via WhatsApp — Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
}
