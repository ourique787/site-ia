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

  const features = [
    {
      icon: "🎙️",
      title: "Transcrição Inteligente",
      description: "Converta áudios em texto automaticamente em PT e EN com alta precisão"
    },
    {
      icon: "🎨",
      title: "Geração de Imagens",
      description: "Crie imagens incríveis a partir de descrições em texto usando IA"
    },
    {
      icon: "📅",
      title: "Agendamentos Smart",
      description: "Agende compromissos e receba lembretes personalizados via WhatsApp"
    },
    {
      icon: "🔍",
      title: "Análise de Imagens",
      description: "Envie fotos e receba análises detalhadas sobre o conteúdo visual"
    }
  ];

  // Estilos de botão e outros elementos foram extraídos para maior clareza
  const gradientButtonStyle = {
    background: "linear-gradient(135deg, #635bff 0%, #4f46e5 100%)",
    color: "#fff",
    padding: "16px 32px",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "16px",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    transition: "transform 0.2s, boxShadow 0.2s",
    boxShadow: "0 4px 20px rgba(99, 91, 255, 0.4)"
  };

  const outlineButtonStyle = {
    background: "rgba(255, 255, 255, 0.05)",
    color: "#fff",
    padding: "16px 32px",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    transition: "all 0.2s"
  };

  const phoneMockupContainerStyle = {
    width: "320px",
    background: "#1e293b",
    borderRadius: "32px",
    padding: "12px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    border: "8px solid #0f172a"
  };

  return (
    // CONTÊINER PRINCIPAL - APLICANDO A CORREÇÃO MAIS RÍGIDA
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f1724 0%, #1a2332 100%)",
      color: "#fff",
      // Solução de força total: largura exata da viewport e overflow escondido.
      width: "100vw",
      overflowX: "hidden", 
      margin: 0,
      padding: 0
    }}>

      {/* Hero Section */}
      <main style={{ paddingTop: "60px", paddingBottom: "60px" }}>
        <section style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px", // Padding horizontal usado para espaçar o conteúdo interno
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "40px",
          alignItems: "center"
        }}>
          {/* Left Content */}
          <div style={{ maxWidth: "100%", width: "100%" }}>
            <div style={{
              display: "inline-block",
              background: "rgba(99, 91, 255, 0.1)",
              border: "1px solid rgba(99, 91, 255, 0.3)",
              padding: "8px 16px",
              borderRadius: "100px",
              fontSize: "14px",
              color: "#a5b4fc",
              marginBottom: "24px",
              fontWeight: 500
            }}>
              🚀 Powered by OpenAI
            </div>

            <h1 style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: "24px",
              background: "linear-gradient(135deg, #fff 0%, #a5b4fc 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              wordWrap: "break-word"
            }}>
              Seu WhatsApp agora é uma IA poderosa
            </h1>

            <p style={{
              fontSize: "16px",
              lineHeight: 1.7,
              color: "#cbd5e1",
              marginBottom: "36px"
            }}>
              Transcreva áudios, gere imagens, agende compromissos e analise fotos — 
              tudo isso direto no WhatsApp com tecnologia de inteligência artificial de última geração.
            </p>

            <div style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "48px"
            }}>
              <Link to={authed ? "/dashboard" : "/cadastro"} style={gradientButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 30px rgba(99, 91, 255, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(99, 91, 255, 0.4)";
                }}>
                Começar agora →
              </Link>

              <Link to="/login" style={outlineButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                }}>
                Já sou cliente
              </Link>
            </div>

            {/* Stats */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
              gap: "20px",
              padding: "24px 0",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)"
            }}>
              <div>
                <div style={{ fontSize: "28px", fontWeight: 700, color: "#4ade80" }}>99.9%</div>
                <div style={{ fontSize: "14px", color: "#94a3b8" }}>Precisão IA</div>
              </div>
              <div>
                <div style={{ fontSize: "28px", fontWeight: 700, color: "#4ade80" }}>24/7</div>
                <div style={{ fontSize: "14px", color: "#94a3b8" }}>Disponível</div>
              </div>
              <div>
                <div style={{ fontSize: "28px", fontWeight: 700, color: "#4ade80" }}>{"<"}2s</div>
                <div style={{ fontSize: "14px", color: "#94a3b8" }}>Resposta</div>
              </div>
            </div>
          </div>

          {/* Right Content - Phone Mockup */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <div style={phoneMockupContainerStyle}>
              {/* Phone Header */}
              <div style={{
                background: "#25D366",
                borderRadius: "20px 20px 0 0",
                padding: "16px",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #635bff 0%, #4f46e5 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px"
                }}>
                  🤖
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "16px" }}>IA Assistant</div>
                  <div style={{ fontSize: "12px", opacity: 0.8 }}>online</div>
                </div>
              </div>

              {/* Chat Messages */}
              <div style={{
                background: "#0f172a",
                padding: "20px",
                minHeight: "400px",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}>
                <div style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  padding: "12px 16px",
                  borderRadius: "12px 12px 12px 4px",
                  maxWidth: "80%",
                  fontSize: "14px",
                  color: "#cbd5e1"
                }}>
                  🎙️ Enviei um áudio
                </div>

                <div style={{
                  background: "linear-gradient(135deg, #635bff 0%, #4f46e5 100%)",
                  padding: "12px 16px",
                  borderRadius: "12px 12px 4px 12px",
                  maxWidth: "80%",
                  alignSelf: "flex-end",
                  fontSize: "14px"
                }}>
                  ✅ Transcrição pronta em PT e EN!
                </div>

                <div style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  padding: "12px 16px",
                  borderRadius: "12px 12px 12px 4px",
                  maxWidth: "80%",
                  fontSize: "14px",
                  color: "#cbd5e1"
                }}>
                  Gere uma imagem de um robô futurista
                </div>

                <div style={{
                  background: "linear-gradient(135deg, #635bff 0%, #4f46e5 100%)",
                  padding: "12px 16px",
                  borderRadius: "12px 12px 4px 12px",
                  maxWidth: "80%",
                  alignSelf: "flex-end",
                  fontSize: "14px"
                }}>
                  🎨 Imagem gerada com sucesso!
                </div>

                <div style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  padding: "12px 16px",
                  borderRadius: "12px 12px 12px 4px",
                  maxWidth: "80%",
                  fontSize: "14px",
                  color: "#cbd5e1"
                }}>
                  Agende reunião amanhã 14h
                </div>

                <div style={{
                  background: "linear-gradient(135deg, #635bff 0%, #4f46e5 100%)",
                  padding: "12px 16px",
                  borderRadius: "12px 12px 4px 12px",
                  maxWidth: "80%",
                  alignSelf: "flex-end",
                  fontSize: "14px"
                }}>
                  📅 Agendado! Vou te lembrar.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section style={{
          maxWidth: "1200px",
          margin: "80px auto 0",
          padding: "0 20px"
        }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{
              fontSize: "clamp(32px, 4vw, 42px)",
              fontWeight: 700,
              marginBottom: "16px"
            }}>
              Recursos Poderosos
            </h2>
            <p style={{
              fontSize: "18px",
              color: "#94a3b8",
              maxWidth: "600px",
              margin: "0 auto"
            }}>
              Tudo que você precisa para turbinar seu WhatsApp com inteligência artificial
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px"
          }}>
            {features.map((feature, idx) => (
              <div key={idx} style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                borderRadius: "16px",
                padding: "32px",
                transition: "all 0.3s"
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.borderColor = "rgba(99, 91, 255, 0.3)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}>
                <div style={{
                  fontSize: "48px",
                  marginBottom: "16px"
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  marginBottom: "12px"
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: "15px",
                  color: "#94a3b8",
                  lineHeight: 1.6
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        padding: "40px 24px",
        marginTop: "120px"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
          color: "#64748b",
          fontSize: "14px"
        }}>
          <p>© {new Date().getFullYear()} IA Whatsapp — Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
}