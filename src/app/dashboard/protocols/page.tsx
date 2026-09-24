'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Stethoscope,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Layers,
  Sparkles,
  Clock,
  Compass,
} from 'lucide-react';

export default function ProtocolsPage() {
  const router = useRouter();
  const [selectedProtocol, setSelectedProtocol] = useState<'portage' | 'denver'>('portage');

  return (
    <div className="portage-protocols-root">
      <style>{`
        :root {
          --p-font: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          --p-green-950: #132A1C; --p-green-900: #1D3E2B; --p-green-800: #26533A;
          --p-green-700: #316849; --p-green-600: #3E825D; --p-green-500: #4FA878;
          --p-green-200: #BCE2CB; --p-green-100: #E2F4E9; --p-green-50:  #F2FAF5;
          --p-amber-700: #8C6212; --p-amber-600: #B68119; --p-amber-500: #D99B26;
          --p-amber-200: #F6DF9C; --p-amber-100: #FDF3DC; --p-amber-50:  #FFFBF2;
          --p-neutral-900: #1C2420; --p-neutral-800: #2D3731; --p-neutral-700: #46534B;
          --p-neutral-600: #627268; --p-neutral-500: #83938A; --p-neutral-400: #A8B7AE;
          --p-neutral-300: #D2DDD6; --p-neutral-200: #E5EDE8; --p-neutral-100: #F3F7F4;
          --p-neutral-50:  #F8FAF8; --p-white: #FFFFFF;
          --p-shadow-sm: 0 1px 3px rgba(29, 62, 43, 0.05);
          --p-shadow-md: 0 6px 20px -3px rgba(29, 62, 43, 0.08);
          --p-shadow-lg: 0 16px 40px -8px rgba(29, 62, 43, 0.12);
          --p-shadow-hover: 0 20px 48px -10px rgba(38, 83, 58, 0.16);
          --p-radius-sm: 10px; --p-radius-md: 16px; --p-radius-lg: 24px;
          --p-radius-xl: 32px; --p-radius-full: 9999px;
          --p-transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .portage-protocols-root { font-family: var(--p-font); color: var(--p-neutral-900); background-color: var(--p-neutral-50); min-height: 100vh; position: relative; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; line-height: 1.5; }
        .portage-protocols-root * { box-sizing: border-box; margin: 0; padding: 0; }
        .portage-ambient-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; background: radial-gradient(circle at 12% 10%, rgba(253, 243, 220, 0.55) 0%, transparent 32%), radial-gradient(circle at 88% 14%, rgba(226, 244, 233, 0.7) 0%, transparent 34%), radial-gradient(circle at 50% 90%, rgba(242, 250, 245, 0.85) 0%, transparent 45%); }
        .portage-top-navbar { position: sticky; top: 0; z-index: 40; background: rgba(255, 255, 255, 0.92); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid var(--p-neutral-200); }
        .portage-top-navbar-inner { max-width: 1120px; margin: 0 auto; padding: 14px 28px; display: flex; align-items: center; justify-content: space-between; }
        .portage-top-brand { display: flex; align-items: center; gap: 12px; text-decoration: none; color: inherit; }
        .portage-top-brand-icon { display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: var(--p-radius-sm); background: var(--p-green-100); border: 1px solid var(--p-green-200); color: var(--p-green-800); }
        .portage-top-brand-title { font-size: 1.12rem; font-weight: 800; letter-spacing: -0.02em; color: var(--p-neutral-900); line-height: 1.2; }
        .portage-top-brand-title span { font-weight: 500; color: var(--p-neutral-600); }
        .portage-top-pill { display: inline-flex; align-items: center; gap: 7px; padding: 6px 14px; font-size: 0.78rem; font-weight: 700; color: var(--p-green-900); background: var(--p-neutral-100); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-full); }
        .portage-dot-status { width: 8px; height: 8px; border-radius: 50%; background: var(--p-green-500); box-shadow: 0 0 0 3px rgba(79, 168, 120, 0.25); }
        .portage-main-container { max-width: 1080px; margin: 0 auto; padding: 40px 24px 120px; position: relative; z-index: 1; }
        .portage-page-header { padding-bottom: 24px; border-bottom: 1px solid var(--p-neutral-200); margin-bottom: 36px; }
        .portage-btn-back { display: inline-flex; align-items: center; gap: 6px; background: transparent; border: none; color: var(--p-green-700); font-size: 0.88rem; font-weight: 700; cursor: pointer; margin-bottom: 14px; padding: 4px 0; transition: var(--p-transition); }
        .portage-btn-back:hover { color: var(--p-green-900); transform: translateX(-3px); }
        .portage-header-title-row { display: flex; align-items: center; gap: 14px; }
        .portage-header-icon-badge { display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: var(--p-radius-md); background: var(--p-green-100); border: 1px solid var(--p-green-200); color: var(--p-green-800); flex-shrink: 0; }
        .portage-page-title { font-size: 2.1rem; font-weight: 800; letter-spacing: -0.03em; color: var(--p-neutral-900); line-height: 1.15; }
        .portage-page-subtitle { margin-top: 8px; font-size: 0.98rem; color: var(--p-neutral-600); max-width: 680px; }
        .portage-protocols-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 28px; }
        .portage-protocol-card { background: var(--p-white); border-radius: var(--p-radius-lg); padding: 32px 30px; position: relative; display: flex; flex-direction: column; justify-content: space-between; border: 1px solid var(--p-neutral-200); box-shadow: var(--p-shadow-md); transition: var(--p-transition); overflow: hidden; }
        .portage-protocol-card.active::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, var(--p-green-600), var(--p-green-500), var(--p-amber-500)); }
        .portage-protocol-card.active { border-color: var(--p-green-200); background: linear-gradient(180deg, #FFFFFF 0%, #FCFDFC 100%); }
        .portage-protocol-card.active:hover { transform: translateY(-4px); box-shadow: var(--p-shadow-hover); border-color: var(--p-green-500); }
        .portage-protocol-card.disabled { background: #FAFBFA; border-color: var(--p-neutral-200); opacity: 0.88; }
        .portage-protocol-card.disabled:hover { box-shadow: var(--p-shadow-md); transform: none; }
        .portage-card-top-row { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 22px; }
        .portage-protocol-icon-wrapper { width: 52px; height: 52px; border-radius: var(--p-radius-md); display: flex; align-items: center; justify-content: center; transition: var(--p-transition); }
        .portage-protocol-icon-wrapper.active { background: var(--p-green-100); color: var(--p-green-800); border: 1px solid var(--p-green-200); }
        .portage-protocol-card.active:hover .portage-protocol-icon-wrapper.active { background: var(--p-green-800); color: var(--p-white); transform: scale(1.05); }
        .portage-protocol-icon-wrapper.disabled { background: var(--p-neutral-100); color: var(--p-neutral-500); border: 1px solid var(--p-neutral-200); }
        .portage-badge-status { display: inline-flex; align-items: center; gap: 6px; font-size: 0.74rem; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; padding: 6px 12px; border-radius: var(--p-radius-full); }
        .portage-badge-status.available { background: var(--p-green-100); color: var(--p-green-800); border: 1px solid var(--p-green-200); }
        .portage-badge-status.upcoming { background: var(--p-neutral-100); color: var(--p-neutral-600); border: 1px solid var(--p-neutral-300); }
        .portage-protocol-content { margin-bottom: 28px; }
        .portage-protocol-tagline { display: inline-flex; align-items: center; gap: 5px; font-size: 0.76rem; font-weight: 700; color: var(--p-amber-700); background: var(--p-amber-50); border: 1px solid var(--p-amber-200); padding: 3px 9px; border-radius: var(--p-radius-full); margin-bottom: 12px; }
        .portage-protocol-title { font-size: 1.55rem; font-weight: 800; letter-spacing: -0.02em; line-height: 1.25; margin-bottom: 10px; }
        .portage-protocol-title.active { color: var(--p-green-950); }
        .portage-protocol-title.disabled { color: var(--p-neutral-800); }
        .portage-protocol-description { font-size: 0.92rem; color: var(--p-neutral-600); line-height: 1.6; margin-bottom: 20px; }
        .portage-protocol-pillars { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 8px; }
        .portage-pillar-chip { font-size: 0.74rem; font-weight: 600; padding: 4px 10px; border-radius: var(--p-radius-full); display: inline-flex; align-items: center; gap: 4px; }
        .portage-pillar-chip.active { background: var(--p-neutral-100); color: var(--p-neutral-700); border: 1px solid var(--p-neutral-200); }
        .portage-pillar-chip.disabled { background: var(--p-neutral-100); color: var(--p-neutral-500); border: 1px dashed var(--p-neutral-300); }
        .portage-btn-apply { width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 10px; background: linear-gradient(135deg, var(--p-green-800) 0%, var(--p-green-700) 100%); color: var(--p-white); border: none; padding: 15px 22px; font-size: 0.94rem; font-weight: 700; border-radius: var(--p-radius-md); cursor: pointer; box-shadow: 0 4px 14px rgba(38, 83, 58, 0.22); transition: var(--p-transition); text-decoration: none; }
        .portage-btn-apply:hover { background: linear-gradient(135deg, var(--p-green-900) 0%, var(--p-green-800) 100%); transform: translateY(-2px); box-shadow: 0 8px 22px rgba(38, 83, 58, 0.32); }
        .portage-btn-apply:active { transform: translateY(0); }
        .portage-btn-disabled { width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: var(--p-neutral-200); color: var(--p-neutral-500); border: 1px solid var(--p-neutral-300); padding: 15px 22px; font-size: 0.94rem; font-weight: 700; border-radius: var(--p-radius-md); cursor: not-allowed; }
        .portage-protocols-footer-box { margin-top: 40px; background: var(--p-white); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-lg); padding: 24px 28px; display: flex; align-items: flex-start; gap: 18px; box-shadow: var(--p-shadow-sm); }
        .portage-footer-icon-box { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: var(--p-radius-sm); background: var(--p-green-100); border: 1px solid var(--p-green-200); color: var(--p-green-800); flex-shrink: 0; }
        .portage-footer-text-col h3 { font-size: 0.98rem; font-weight: 700; color: var(--p-neutral-900); margin-bottom: 4px; }
        .portage-footer-text-col p { font-size: 0.86rem; color: var(--p-neutral-600); line-height: 1.55; }
        @media (max-width: 860px) {
          .portage-protocols-grid { grid-template-columns: 1fr; gap: 20px; }
          .portage-main-container { padding: 24px 16px 80px; }
          .portage-page-title { font-size: 1.7rem; }
          .portage-protocol-card { padding: 26px 20px; }
          .portage-protocols-footer-box { flex-direction: column; gap: 12px; padding: 20px; }
        }
        @media (max-width: 480px) {
          .portage-top-navbar-inner { padding: 12px 16px; }
          .portage-page-title { font-size: 1.5rem; }
          .portage-protocol-title { font-size: 1.35rem; }
          .portage-btn-apply, .portage-btn-disabled { padding: 13px 18px; font-size: 0.9rem; }
        }
      `}</style>

      <div className="portage-ambient-bg" aria-hidden="true" />

      <header className="portage-top-navbar">
        <div className="portage-top-navbar-inner">
          <div className="portage-top-brand">
            <div className="portage-top-brand-icon">
              <Stethoscope size={20} />
            </div>
            <div>
              <div className="portage-top-brand-title">
                Portage<span>Platform</span>
              </div>
            </div>
          </div>

          <div className="portage-top-pill">
            <span className="portage-dot-status" />
            <span>Instrumentos Validados</span>
          </div>
        </div>
      </header>

      <main className="portage-main-container">
        
        <div className="portage-page-header">
          <button
            onClick={() => router.push('/dashboard')}
            className="portage-btn-back"
            aria-label="Voltar para a página inicial do Dashboard"
          >
            <ArrowLeft size={16} />
            <span>Voltar ao Início</span>
          </button>

          <div className="portage-header-title-row">
            <div className="portage-header-icon-badge">
              <BookOpen size={22} />
            </div>
            <div>
              <h1 className="portage-page-title">Biblioteca de Protocolos</h1>
              <p className="portage-page-subtitle">
                Selecione o instrumento de avaliação clínica para iniciar ou continuar o acompanhamento do paciente.
              </p>
            </div>
          </div>
        </div>

        <div className="portage-protocols-grid">
          
          <div className="portage-protocol-card active">
            <div>
              <div className="portage-card-top-row">
                <div className="portage-protocol-icon-wrapper active">
                  <Layers size={24} />
                </div>
                <span className="portage-badge-status available">
                  <CheckCircle2 size={13} />
                  Disponível
                </span>
              </div>

              <div className="portage-protocol-content">
                <div className="portage-protocol-tagline">
                  <Sparkles size={12} />
                  0 a 6 Anos • 5 Áreas Fundamentais
                </div>

                <h2 className="portage-protocol-title active">Inventário Portage</h2>

                <p className="portage-protocol-description">
                  Operacionalizado para avaliação do desenvolvimento infantil de 0 a 6 anos em 5 áreas fundamentais.
                </p>

                <div className="portage-protocol-pillars">
                  <span className="portage-pillar-chip active">Socialização</span>
                  <span className="portage-pillar-chip active">Cognição</span>
                  <span className="portage-pillar-chip active">Linguagem</span>
                  <span className="portage-pillar-chip active">Auto-cuidado</span>
                  <span className="portage-pillar-chip active">Desenvolvimento Motor</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push('/dashboard/patients')}
              className="portage-btn-apply"
            >
              <span>Aplicar Avaliação (Selecionar Paciente)</span>
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="portage-protocol-card disabled">
            <div>
              <div className="portage-card-top-row">
                <div className="portage-protocol-icon-wrapper disabled">
                  <Lock size={22} />
                </div>
                <span className="portage-badge-status upcoming">
                  <Clock size={12} />
                  Em Breve
                </span>
              </div>

              <div className="portage-protocol-content">
                <div className="portage-protocol-tagline" style={{ color: '#627268', background: '#F3F7F4', borderColor: '#D2DDD6' }}>
                  <Compass size={12} />
                  Intervenção Precoce • ESDM
                </div>

                <h2 className="portage-protocol-title disabled">Modelo Denver (ESDM)</h2>

                <p className="portage-protocol-description">
                  Lista de verificação do Modelo Denver de Intervenção Precoce para crianças com autismo.
                </p>

                <div className="portage-protocol-pillars">
                  <span className="portage-pillar-chip disabled">Comunicação Receptiva</span>
                  <span className="portage-pillar-chip disabled">Comunicação Expressiva</span>
                  <span className="portage-pillar-chip disabled">Atenção Compartilhada</span>
                  <span className="portage-pillar-chip disabled">Jogo Social</span>
                </div>
              </div>
            </div>

            <button disabled className="portage-btn-disabled">
              <Lock size={16} />
              <span>Indisponível no momento</span>
            </button>
          </div>

        </div>

        <div className="portage-protocols-footer-box">
          <div className="portage-footer-icon-box">
            <ShieldCheck size={20} />
          </div>
          <div className="portage-footer-text-col">
            <h3>Padronização e Segurança Científica</h3>
            <p>
              As pontuações e relatórios emitidos são automaticamente correlacionados com faixas etárias de desenvolvimento
              normativo, garantindo precisão diagnóstica multidisciplinar e prontuários sempre organizados.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}