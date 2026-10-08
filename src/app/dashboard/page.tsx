'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import {
  Users,
  Stethoscope,
  BookOpen,
  LogOut,
  ChevronRight,
  ShieldCheck,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  FileText,
  HelpCircle,
  MessageCircle,
  AlertTriangle,
  X,
  Send
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('Profissional');
  const [loading, setLoading] = useState(true);

  // Estados para o Menu de Ajuda e Modal de Feedback
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState('Sugestão');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, cpf, council_type')
        .eq('id', session.user.id)
        .single();

      if (!profile?.cpf || !profile?.council_type) {
        router.push('/dashboard/profile');
        return;
      }

      if (profile?.full_name) {
        setUserName(profile.full_name.split(' ')[0]);
      }
      setLoading(false);
    };
    
    loadUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Função para gravar o feedback no Supabase
  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;
    
    setIsSubmitting(true);
    setFeedbackStatus(null);
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return;

    const { error } = await supabase.from('feedbacks').insert({
      user_id: session.user.id,
      tipo_mensagem: feedbackType,
      mensagem: feedbackMessage,
    });

    if (error) {
      setFeedbackStatus('error');
    } else {
      setFeedbackStatus('success');
      setTimeout(() => {
        setIsFeedbackModalOpen(false);
        setFeedbackMessage('');
        setFeedbackStatus(null);
      }, 2000);
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="portage-loading-wrapper">
        <style>{`
          .portage-loading-wrapper {
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            min-height: 100vh; background-color: #F8FAF8; color: #2D3731;
          }
          .portage-loading-spinner-box {
            display: flex; align-items: center; justify-content: center; width: 56px; height: 56px;
            border-radius: 18px; background: #E2F4E9; border: 1px solid #BCE2CB; color: #26533A;
            box-shadow: 0 4px 16px rgba(38, 83, 58, 0.1); animation: portagePulse 1.8s ease-in-out infinite;
          }
          .portage-loading-text { margin-top: 18px; font-size: 0.95rem; font-weight: 700; color: #26533A; }
          .portage-loading-subtext { margin-top: 4px; font-size: 0.78rem; color: #627268; }
          @keyframes portagePulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.06); opacity: 0.85; } }
        `}</style>
        <div className="portage-loading-spinner-box">
          <Stethoscope size={26} />
        </div>
        <div className="portage-loading-text">A verificar credenciais clínicas...</div>
        <div className="portage-loading-subtext">Portage Platform • Segurança e Privacidade</div>
      </div>
    );
  }

  return (
    <div className="portage-dashboard-root">
      <style>{`
        :root {
          --p-font: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          --p-green-950: #132A1C; --p-green-900: #1D3E2B; --p-green-800: #26533A;
          --p-green-700: #316849; --p-green-600: #3E825D; --p-green-500: #4FA878;
          --p-green-200: #BCE2CB; --p-green-100: #E2F4E9; --p-green-50:  #F2FAF5;
          --p-amber-700: #8C6212; --p-amber-600: #B68119; --p-amber-500: #D99B26;
          --p-amber-100: #FDF3DC; --p-amber-50:  #FFFBF2;
          --p-neutral-900: #1C2420; --p-neutral-800: #2D3731; --p-neutral-700: #46534B;
          --p-neutral-600: #627268; --p-neutral-500: #83938A; --p-neutral-200: #E5EDE8;
          --p-neutral-100: #F3F7F4; --p-neutral-50:  #F8FAF8; --p-white: #FFFFFF;
          --p-shadow-sm: 0 1px 3px rgba(29, 62, 43, 0.05);
          --p-shadow-md: 0 6px 20px -3px rgba(29, 62, 43, 0.08);
          --p-shadow-lg: 0 14px 40px -6px rgba(29, 62, 43, 0.12);
          --p-radius-sm: 10px; --p-radius-md: 16px; --p-radius-lg: 24px; --p-radius-full: 9999px;
          --p-transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .portage-dashboard-root { font-family: var(--p-font); color: var(--p-neutral-900); background-color: var(--p-neutral-50); min-height: 100vh; position: relative; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; line-height: 1.5; }
        .portage-dashboard-root * { box-sizing: border-box; margin: 0; padding: 0; }
        .portage-dashboard-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; background: radial-gradient(circle at 12% 10%, rgba(253, 243, 220, 0.55) 0%, transparent 26%), radial-gradient(circle at 88% 14%, rgba(226, 244, 233, 0.65) 0%, transparent 32%), radial-gradient(circle at 50% 90%, rgba(242, 250, 245, 0.8) 0%, transparent 40%); }
        .portage-dash-header { position: sticky; top: 0; z-index: 40; background: rgba(255, 255, 255, 0.92); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid var(--p-neutral-200); }
        .portage-dash-header-inner { max-width: 1180px; margin: 0 auto; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .portage-dash-brand { display: flex; align-items: center; gap: 12px; text-decoration: none; color: inherit; }
        .portage-dash-brand-icon { display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: var(--p-radius-sm); background: var(--p-green-100); border: 1px solid var(--p-green-200); color: var(--p-green-800); }
        .portage-dash-brand-title { font-size: 1.1rem; font-weight: 800; letter-spacing: -0.02em; color: var(--p-neutral-900); line-height: 1.2; }
        .portage-dash-brand-title span { font-weight: 500; color: var(--p-neutral-600); }
        
        .portage-header-right-cluster { display: flex; align-items: center; gap: 16px; }
        .portage-help-menu-container { position: relative; }
        .portage-btn-help { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; font-size: 0.8rem; font-weight: 700; color: var(--p-neutral-700); background: var(--p-white); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-full); cursor: pointer; transition: var(--p-transition); }
        .portage-btn-help:hover, .portage-btn-help.active { background: var(--p-neutral-100); border-color: var(--p-neutral-300); color: var(--p-green-900); }
        .portage-help-dropdown { position: absolute; top: calc(100% + 8px); right: 0; width: 220px; background: var(--p-white); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-md); box-shadow: var(--p-shadow-md); overflow: hidden; transform-origin: top right; animation: portageDropIn 0.2s ease-out; }
        @keyframes portageDropIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .portage-help-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 12px 16px; border: none; background: transparent; font-family: var(--p-font); font-size: 0.86rem; font-weight: 600; color: var(--p-neutral-700); cursor: pointer; text-align: left; text-decoration: none; transition: var(--p-transition); }
        .portage-help-item:hover { background: var(--p-neutral-50); color: var(--p-green-800); }
        .portage-help-item:not(:last-child) { border-bottom: 1px solid var(--p-neutral-100); }
        
        .portage-dash-user-badge { display: flex; align-items: center; gap: 10px; padding: 6px 14px; background: var(--p-neutral-100); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-full); font-size: 0.78rem; font-weight: 700; color: var(--p-green-900); }
        .portage-user-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--p-green-500); box-shadow: 0 0 0 3px rgba(79, 168, 120, 0.25); }
        
        .portage-main-content { max-width: 1180px; margin: 0 auto; padding: 44px 24px 120px; position: relative; z-index: 1; }
        .portage-welcome-header { display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 24px; border-bottom: 1px solid var(--p-neutral-200); margin-bottom: 36px; }
        .portage-welcome-greeting { font-size: clamp(1.85rem, 3.2vw, 2.4rem); font-weight: 800; letter-spacing: -0.025em; color: var(--p-green-950); line-height: 1.15; }
        .portage-welcome-subtitle { margin-top: 8px; font-size: 1rem; color: var(--p-neutral-600); display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .portage-badge-clinic-active { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; font-size: 0.72rem; font-weight: 700; color: var(--p-green-800); background: var(--p-green-100); border: 1px solid var(--p-green-200); border-radius: var(--p-radius-full); }
        .portage-btn-logout { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; font-size: 0.86rem; font-weight: 700; color: #DC2626; background: #FEF2F2; border: 1px solid #FECACA; border-radius: var(--p-radius-sm); cursor: pointer; transition: var(--p-transition); box-shadow: var(--p-shadow-sm); white-space: nowrap; }
        .portage-btn-logout:hover { background: #FEE2E2; border-color: #FCA5A5; transform: translateY(-1px); }
        
        .portage-cards-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .portage-nav-card { background: var(--p-white); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-lg); padding: 32px 28px; cursor: pointer; position: relative; transition: var(--p-transition); box-shadow: var(--p-shadow-sm); display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; }
        .portage-nav-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: transparent; transition: var(--p-transition); }
        .portage-nav-card:hover { transform: translateY(-4px); box-shadow: var(--p-shadow-md); border-color: var(--p-green-600); }
        .portage-nav-card:hover::before { background: var(--p-green-600); }
        .portage-card-patients:hover { border-color: var(--p-green-600); }
        .portage-card-patients:hover::before { background: var(--p-green-600); }
        .portage-card-profile:hover { border-color: var(--p-amber-600); }
        .portage-card-profile:hover::before { background: var(--p-amber-600); }
        .portage-card-protocols:hover { border-color: #2D6A4F; }
        .portage-card-protocols:hover::before { background: #2D6A4F; }
        .portage-card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
        .portage-card-icon-container { width: 52px; height: 52px; border-radius: var(--p-radius-md); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; transition: var(--p-transition); box-shadow: var(--p-shadow-sm); }
        .portage-card-patients .portage-card-icon-container { background: #E2F4E9; border: 1px solid #BCE2CB; color: #26533A; }
        .portage-card-profile .portage-card-icon-container { background: #FDF3DC; border: 1px solid #F6DFB0; color: #8C6212; }
        .portage-card-protocols .portage-card-icon-container { background: #EEF8F0; border: 1px solid #D3E8D7; color: #2D6A4F; }
        .portage-nav-card:hover .portage-card-icon-container { transform: scale(1.08); }
        .portage-card-arrow-indicator { width: 32px; height: 32px; border-radius: 50%; background: var(--p-neutral-100); display: flex; align-items: center; justify-content: center; color: var(--p-neutral-500); transition: var(--p-transition); }
        .portage-nav-card:hover .portage-card-arrow-indicator { background: var(--p-green-100); color: var(--p-green-800); transform: translate(2px, -2px); }
        .portage-card-title { font-size: 1.25rem; font-weight: 800; letter-spacing: -0.015em; color: var(--p-neutral-900); margin-bottom: 8px; }
        .portage-card-desc { font-size: 0.88rem; line-height: 1.58; color: var(--p-neutral-600); margin-bottom: 24px; }
        .portage-card-footer-action { display: flex; align-items: center; justify-content: space-between; padding-top: 18px; border-top: 1px solid var(--p-neutral-200); font-size: 0.78rem; font-weight: 700; color: var(--p-green-700); transition: var(--p-transition); }
        .portage-nav-card:hover .portage-card-footer-action { color: var(--p-green-900); }
        
        .portage-info-banner { margin-top: 40px; background: var(--p-white); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-lg); padding: 24px 28px; display: flex; align-items: center; justify-content: space-between; gap: 20px; box-shadow: var(--p-shadow-sm); }
        .portage-info-banner-left { display: flex; align-items: center; gap: 16px; }
        .portage-info-banner-icon { display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: var(--p-radius-sm); background: var(--p-green-50); border: 1px solid var(--p-green-200); color: var(--p-green-700); flex-shrink: 0; }
        .portage-info-banner-title { font-size: 0.95rem; font-weight: 800; color: var(--p-green-950); }
        .portage-info-banner-desc { font-size: 0.82rem; color: var(--p-neutral-600); margin-top: 2px; }
        .portage-info-banner-meta { display: flex; align-items: center; gap: 14px; font-size: 0.76rem; font-weight: 700; color: var(--p-green-800); white-space: nowrap; }
        .portage-info-pill { display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px; background: var(--p-green-50); border: 1px solid var(--p-green-200); border-radius: var(--p-radius-full); }
        
        /* Modal Styles */
        .portage-modal-overlay { position: fixed; inset: 0; background: rgba(28, 36, 32, 0.4); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .portage-modal-content { background: var(--p-white); border-radius: var(--p-radius-lg); width: 100%; max-width: 480px; box-shadow: var(--p-shadow-lg); overflow: hidden; animation: portageDropIn 0.25s ease-out; }
        .portage-modal-header { padding: 20px 24px; border-bottom: 1px solid var(--p-neutral-200); display: flex; justify-content: space-between; align-items: center; }
        .portage-modal-title { font-size: 1.15rem; font-weight: 800; color: var(--p-neutral-900); display: flex; align-items: center; gap: 8px; }
        .portage-btn-close { background: transparent; border: none; color: var(--p-neutral-500); cursor: pointer; padding: 4px; border-radius: 6px; transition: var(--p-transition); }
        .portage-btn-close:hover { background: var(--p-neutral-100); color: var(--p-neutral-800); }
        .portage-modal-body { padding: 24px; }
        .portage-form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px; }
        .portage-form-label { font-size: 0.8rem; font-weight: 700; color: var(--p-neutral-700); }
        .portage-form-select, .portage-form-textarea { width: 100%; padding: 10px 14px; font-family: var(--p-font); font-size: 0.88rem; border: 1px solid var(--p-neutral-300); border-radius: var(--p-radius-sm); outline: none; transition: var(--p-transition); background: var(--p-neutral-50); }
        .portage-form-select:focus, .portage-form-textarea:focus { border-color: var(--p-green-600); background: var(--p-white); box-shadow: 0 0 0 3px rgba(79, 168, 120, 0.15); }
        .portage-form-textarea { resize: vertical; min-height: 100px; }
        .portage-btn-submit { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 12px; background: var(--p-green-800); color: var(--p-white); border: none; border-radius: var(--p-radius-sm); font-size: 0.92rem; font-weight: 700; cursor: pointer; transition: var(--p-transition); }
        .portage-btn-submit:hover:not(:disabled) { background: var(--p-green-900); }
        .portage-btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
        .portage-status-feedback { padding: 12px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
        .portage-status-feedback.success { background: #F0FDF4; color: #15803D; border: 1px solid #BBF7D0; }
        .portage-status-feedback.error { background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; }

        @media (max-width: 960px) { .portage-cards-grid { grid-template-columns: repeat(2, 1fr); } .portage-info-banner { flex-direction: column; align-items: flex-start; } }
        @media (max-width: 640px) {
          .portage-main-content { padding: 24px 16px 80px; }
          .portage-dash-header-inner { padding: 12px 16px; }
          .portage-header-right-cluster { gap: 10px; }
          .portage-dash-user-badge span:last-child { display: none; }
          .portage-welcome-header { flex-direction: column; align-items: flex-start; gap: 18px; margin-bottom: 28px; }
          .portage-welcome-greeting { font-size: 1.7rem; }
          .portage-btn-logout { width: 100%; justify-content: center; }
          .portage-cards-grid { grid-template-columns: 1fr; gap: 18px; }
          .portage-nav-card { padding: 24px 20px; }
          .portage-info-banner-left { align-items: flex-start; }
          .portage-info-banner-meta { flex-direction: column; align-items: flex-start; gap: 8px; width: 100%; }
        }
      `}</style>

      <div className="portage-dashboard-bg" aria-hidden="true" />

      <header className="portage-dash-header">
        <div className="portage-dash-header-inner">
          <div className="portage-dash-brand">
            <div className="portage-dash-brand-icon">
              <Stethoscope size={20} />
            </div>
            <div>
              <div className="portage-dash-brand-title">
                Portage<span>Platform</span>
              </div>
            </div>
          </div>

          <div className="portage-header-right-cluster">
            
            {/* Menu de Ajuda */}
            <div className="portage-help-menu-container">
              <button 
                className={`portage-btn-help ${isHelpOpen ? 'active' : ''}`}
                onClick={() => setIsHelpOpen(!isHelpOpen)}
              >
                <HelpCircle size={15} />
                <span>Ajuda</span>
              </button>
              
              {isHelpOpen && (
                <div className="portage-help-dropdown">
                  <a 
                    href="https://wa.me/5583999443260?text=Olá, preciso de suporte na Plataforma Portage" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="portage-help-item"
                    onClick={() => setIsHelpOpen(false)}
                  >
                    <MessageCircle size={16} />
                    Falar no WhatsApp
                  </a>
                  <button 
                    className="portage-help-item"
                    onClick={() => {
                      setIsFeedbackModalOpen(true);
                      setIsHelpOpen(false);
                    }}
                  >
                    <AlertTriangle size={16} />
                    Reportar Problema
                  </button>
                </div>
              )}
            </div>

            <div className="portage-dash-user-badge">
              <span className="portage-user-dot" />
              <span>Sessão Clínica</span>
            </div>
          </div>
        </div>
      </header>

      <main className="portage-main-content">
        <div className="portage-welcome-header">
          <div>
            <h1 className="portage-welcome-greeting">Olá, {userName}!</h1>
            <div className="portage-welcome-subtitle">
              <span>Bem-vindo(a) à sua plataforma de avaliação clínica.</span>
              <span className="portage-badge-clinic-active">
                <CheckCircle2 size={12} /> Prontuários em conformidade LGPD
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="portage-btn-logout"
            aria-label="Encerrar sessão de trabalho com segurança"
          >
            <LogOut size={16} />
            <span>Sair da Conta</span>
          </button>
        </div>

        <div className="portage-cards-grid">
          <div
            onClick={() => router.push('/dashboard/patients')}
            className="portage-nav-card portage-card-patients"
          >
            <div>
              <div className="portage-card-top">
                <div className="portage-card-icon-container">
                  <Users size={24} />
                </div>
                <div className="portage-card-arrow-indicator">
                  <ArrowUpRight size={18} />
                </div>
              </div>
              <h2 className="portage-card-title">Meus Pacientes</h2>
              <p className="portage-card-desc">
                Gerencie cadastros, visualize o histórico clínico e partilhe acessos com a equipa.
              </p>
            </div>
            <div className="portage-card-footer-action">
              <span>Acessar Prontuários</span>
              <ChevronRight size={16} />
            </div>
          </div>

          <div
            onClick={() => router.push('/dashboard/profile')}
            className="portage-nav-card portage-card-profile"
          >
            <div>
              <div className="portage-card-top">
                <div className="portage-card-icon-container">
                  <Stethoscope size={24} />
                </div>
                <div className="portage-card-arrow-indicator">
                  <ArrowUpRight size={18} />
                </div>
              </div>
              <h2 className="portage-card-title">Meu Perfil</h2>
              <p className="portage-card-desc">
                Atualize os seus dados de contacto e registo nos conselhos de classe (CRFa, CRP, etc).
              </p>
            </div>
            <div className="portage-card-footer-action">
              <span>Gerenciar Dados</span>
              <ChevronRight size={16} />
            </div>
          </div>

          <div
            onClick={() => router.push('/dashboard/protocols')}
            className="portage-nav-card portage-card-protocols"
          >
            <div>
              <div className="portage-card-top">
                <div className="portage-card-icon-container">
                  <BookOpen size={24} />
                </div>
                <div className="portage-card-arrow-indicator">
                  <ArrowUpRight size={18} />
                </div>
              </div>
              <h2 className="portage-card-title">Protocolos</h2>
              <p className="portage-card-desc">
                Inventário Portage ativo. Novos protocolos (Denver, VB-MAPP) em breve.
              </p>
            </div>
            <div className="portage-card-footer-action">
              <span>Ver Avaliações</span>
              <ChevronRight size={16} />
            </div>
          </div>
        </div>

        <div className="portage-info-banner">
          <div className="portage-info-banner-left">
            <div className="portage-info-banner-icon">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="portage-info-banner-title">Ambiente Clínico Padronizado</h3>
              <p className="portage-info-banner-desc">
                Suporte às 5 áreas de desenvolvimento do Guia Portage (Socialização, Linguagem, Autocuidados, Cognição e Motor).
              </p>
            </div>
          </div>
          <div className="portage-info-banner-meta">
            <span className="portage-info-pill">
              <Clock size={13} /> Edição 2026
            </span>
            <span className="portage-info-pill">
              <FileText size={13} /> Guia Portage v3
            </span>
          </div>
        </div>

      </main>

      {/* Modal de Feedback */}
      {isFeedbackModalOpen && (
        <div className="portage-modal-overlay" onClick={() => setIsFeedbackModalOpen(false)}>
          <div className="portage-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="portage-modal-header">
              <h3 className="portage-modal-title">
                <AlertTriangle size={18} color="#D99B26" /> Enviar Feedback
              </h3>
              <button className="portage-btn-close" onClick={() => setIsFeedbackModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            
            <div className="portage-modal-body">
              {feedbackStatus === 'success' && (
                <div className="portage-status-feedback success">
                  <CheckCircle2 size={16} /> Feedback enviado com sucesso! Obrigado.
                </div>
              )}
              {feedbackStatus === 'error' && (
                <div className="portage-status-feedback error">
                  <AlertTriangle size={16} /> Erro ao enviar. Tente novamente mais tarde.
                </div>
              )}

              <form onSubmit={handleSubmitFeedback}>
                <div className="portage-form-group">
                  <label className="portage-form-label">Tipo de Mensagem</label>
                  <select 
                    value={feedbackType} 
                    onChange={(e) => setFeedbackType(e.target.value)}
                    className="portage-form-select"
                  >
                    <option value="Sugestão">Sugestão de Melhoria</option>
                    <option value="Dúvida">Dúvida no Uso</option>
                    <option value="Erro">Reportar um Erro (Bug)</option>
                  </select>
                </div>
                
                <div className="portage-form-group">
                  <label className="portage-form-label">Detalhes</label>
                  <textarea 
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    placeholder="Descreva o que aconteceu ou a sua sugestão..."
                    required
                    className="portage-form-textarea"
                  />
                </div>

                <button type="submit" disabled={isSubmitting || feedbackStatus === 'success'} className="portage-btn-submit">
                  {isSubmitting ? 'A Enviar...' : 'Enviar Mensagem'} <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}