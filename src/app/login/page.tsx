'use client'

import React, { useState, useId } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Stethoscope,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Code2,
  BookOpen,
  Brain,
  HeartHandshake,
  MessageCircle,
  PersonStanding,
  Sparkles,
  Target,
  Users,
  ChevronDown,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const formId = useId();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [specialty, setSpecialty] = useState('Psicopedagogia');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score += 25;
    if (pwd.length >= 8) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score += 25;
    return score;
  };
  
  const strength = getPasswordStrength(password);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage({ text: 'Erro ao autenticar: ' + error.message, type: 'error' });
      setLoading(false);
    } else {
      setMessage({ text: 'Acesso autorizado! Redirecionando para o painel...', type: 'success' });
      router.push('/dashboard');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, specialty } },
    });
    if (error) {
      setMessage({ text: 'Erro no cadastro: ' + error.message, type: 'error' });
    } else {
      setMessage({ text: 'Cadastro realizado com sucesso! Pode entrar.', type: 'success' });
      setMode('login');
    }
    setLoading(false);
  };

  const areas = [
    {
      title: 'Socialização',
      icon: <Users className="portage-area-icon" />,
      eyebrow: 'Interação',
      text: 'Relaciona-se à interação com outras pessoas, convivência, participação e respostas sociais.',
      accent: 'emerald',
    },
    {
      title: 'Linguagem',
      icon: <MessageCircle className="portage-area-icon" />,
      eyebrow: 'Comunicação',
      text: 'Abrange aspectos de compreensão e expressão, apoiando a comunicação e a participação da criança.',
      accent: 'amber',
    },
    {
      title: 'Autocuidados',
      icon: <HeartHandshake className="portage-area-icon" />,
      eyebrow: 'Autonomia',
      text: 'Envolve habilidades de maior independência nas rotinas, como alimentação, higiene e vestir-se.',
      accent: 'sage',
    },
    {
      title: 'Cognição',
      icon: <Brain className="portage-area-icon" />,
      eyebrow: 'Aprendizagem',
      text: 'Relaciona-se à atenção, relações, conceitos, aprendizagem e resolução de situações.',
      accent: 'gold',
    },
    {
      title: 'Desenvolvimento motor',
      icon: <PersonStanding className="portage-area-icon" />,
      eyebrow: 'Movimento',
      text: 'Considera movimentos e coordenação, incluindo habilidades de pequenos e grandes músculos.',
      accent: 'teal',
    },
  ];

  return (
    <div className="portage-root">
      <style>{`
        :root {
          --portage-font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          --p-green-950: #132A1C; --p-green-900: #1D3E2B; --p-green-800: #26533A;
          --p-green-700: #316849; --p-green-600: #3E825D; --p-green-500: #4FA878;
          --p-green-200: #BCE2CB; --p-green-100: #E2F4E9; --p-green-50:  #F2FAF5;
          --p-amber-700: #8C6212; --p-amber-600: #B68119; --p-amber-500: #D99B26;
          --p-amber-100: #FDF3DC; --p-amber-50:  #FFFBF2;
          --p-neutral-900: #1C2420; --p-neutral-800: #2D3731; --p-neutral-700: #46534B;
          --p-neutral-600: #627268; --p-neutral-500: #83938A; --p-neutral-300: #D2DDD6;
          --p-neutral-200: #E5EDE8; --p-neutral-100: #F3F7F4; --p-neutral-50:  #F8FAF8;
          --p-white:       #FFFFFF;
          --p-shadow-sm: 0 1px 3px rgba(29, 62, 43, 0.05);
          --p-shadow-md: 0 4px 16px -2px rgba(29, 62, 43, 0.08);
          --p-shadow-lg: 0 12px 36px -6px rgba(29, 62, 43, 0.12);
          --p-shadow-glow: 0 20px 50px -10px rgba(38, 83, 58, 0.2);
          --p-radius-sm: 10px; --p-radius-md: 16px; --p-radius-lg: 24px;
          --p-radius-xl: 32px; --p-radius-full: 9999px;
          --p-transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .portage-root { font-family: var(--portage-font-family); color: var(--p-neutral-900); background-color: var(--p-neutral-50); min-height: 100vh; overflow-x: hidden; position: relative; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; line-height: 1.5; }
        .portage-root * { box-sizing: border-box; margin: 0; padding: 0; }
        .portage-ambient-canvas { position: fixed; inset: 0; pointer-events: none; z-index: 0; background: radial-gradient(circle at 10% 8%, rgba(253, 243, 220, 0.6) 0%, transparent 26%), radial-gradient(circle at 90% 12%, rgba(226, 244, 233, 0.7) 0%, transparent 32%), radial-gradient(circle at 50% 95%, rgba(242, 250, 245, 0.8) 0%, transparent 40%); }
        .portage-ambient-orb-1 { position: fixed; top: 60px; left: -80px; width: 320px; height: 320px; background: rgba(253, 243, 220, 0.4); filter: blur(90px); border-radius: 50%; pointer-events: none; z-index: 0; }
        .portage-ambient-orb-2 { position: fixed; bottom: -60px; right: -60px; width: 380px; height: 380px; background: rgba(188, 226, 203, 0.35); filter: blur(100px); border-radius: 50%; pointer-events: none; z-index: 0; }
        .portage-container { max-width: 1240px; margin-left: auto; margin-right: auto; padding-left: 24px; padding-right: 24px; position: relative; z-index: 1; }
        .portage-header { position: sticky; top: 0; z-index: 50; background: rgba(255, 255, 255, 0.92); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid var(--p-neutral-200); transition: var(--p-transition); }
        .portage-header-inner { display: flex; align-items: center; justify-content: space-between; padding-top: 14px; padding-bottom: 14px; max-width: 1240px; margin: 0 auto; padding-left: 24px; padding-right: 24px; }
        .portage-brand-lockup { display: flex; align-items: center; gap: 12px; text-decoration: none; color: inherit; }
        .portage-brand-icon-box { display: flex; align-items: center; justify-content: center; width: 42px; height: 42px; border-radius: var(--p-radius-md); background: var(--p-green-100); border: 1px solid var(--p-green-200); color: var(--p-green-800); box-shadow: var(--p-shadow-sm); }
        .portage-brand-title { font-size: 1.15rem; font-weight: 800; letter-spacing: -0.02em; color: var(--p-neutral-900); line-height: 1.15; }
        .portage-brand-title span { font-weight: 500; color: var(--p-neutral-600); }
        .portage-brand-subtitle { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.16em; color: var(--p-green-700); margin-top: 2px; }
        .portage-nav { display: flex; align-items: center; gap: 32px; }
        .portage-nav-link { font-size: 0.88rem; font-weight: 600; color: var(--p-neutral-600); text-decoration: none; transition: var(--p-transition); position: relative; padding: 6px 0; }
        .portage-nav-link:hover { color: var(--p-green-800); }
        .portage-header-actions { display: flex; align-items: center; gap: 12px; }
        .portage-badge-edition { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; font-size: 0.75rem; font-weight: 600; color: var(--p-neutral-700); background: var(--p-white); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-full); }
        .portage-btn-nav-cta { display: inline-flex; align-items: center; padding: 8px 18px; font-size: 0.82rem; font-weight: 700; color: var(--p-white); background: var(--p-green-700); border: none; border-radius: var(--p-radius-full); text-decoration: none; box-shadow: 0 2px 6px rgba(49, 104, 73, 0.25); transition: var(--p-transition); cursor: pointer; }
        .portage-btn-nav-cta:hover { background: var(--p-green-800); transform: translateY(-1px); }
        .portage-hero-section { padding-top: 48px; padding-bottom: 72px; border-bottom: 1px solid var(--p-neutral-200); }
        .portage-kicker-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; font-size: 0.78rem; font-weight: 700; color: var(--p-green-800); background: rgba(255, 255, 255, 0.85); border: 1px solid var(--p-green-200); border-radius: var(--p-radius-full); box-shadow: var(--p-shadow-sm); margin-bottom: 18px; }
        .portage-kicker-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--p-green-500); box-shadow: 0 0 0 3px rgba(79, 168, 120, 0.25); }
        .portage-hero-title { font-size: clamp(2rem, 4.5vw, 3.25rem); font-weight: 800; line-height: 1.08; letter-spacing: -0.03em; color: var(--p-green-950); max-width: 860px; }
        .portage-hero-title-accent { display: block; color: var(--p-amber-600); }
        .portage-hero-desc { margin-top: 18px; font-size: 1.05rem; line-height: 1.65; color: var(--p-neutral-700); max-width: 680px; }
        .portage-hero-grid { display: grid; grid-template-columns: 1fr 440px; gap: 36px; margin-top: 40px; align-items: start; }
        .portage-explain-panel { background: rgba(255, 255, 255, 0.78); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-xl); padding: 36px; box-shadow: var(--p-shadow-sm); backdrop-filter: blur(10px); }
        .portage-explain-header { display: flex; align-items: flex-start; gap: 16px; }
        .portage-explain-icon-box { display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: var(--p-radius-md); background: var(--p-green-100); color: var(--p-green-800); flex-shrink: 0; }
        .portage-explain-kicker { font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.18em; color: var(--p-amber-600); }
        .portage-explain-heading { font-size: 1.45rem; font-weight: 800; letter-spacing: -0.02em; color: var(--p-green-900); margin-top: 4px; }
        .portage-steps-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 28px; }
        .portage-step-card { padding: 22px; border-radius: var(--p-radius-lg); transition: var(--p-transition); }
        .portage-step-card-1 { background: var(--p-neutral-100); border: 1px solid var(--p-neutral-200); }
        .portage-step-card-2 { background: var(--p-amber-50); border: 1px solid var(--p-amber-100); }
        .portage-step-index { font-size: 0.75rem; font-weight: 800; letter-spacing: 0.12em; }
        .portage-step-card-1 .portage-step-index { color: var(--p-green-700); }
        .portage-step-card-2 .portage-step-index { color: var(--p-amber-600); }
        .portage-step-title { font-size: 1.05rem; font-weight: 700; margin-top: 8px; }
        .portage-step-card-1 .portage-step-title { color: var(--p-green-900); }
        .portage-step-card-2 .portage-step-title { color: var(--p-amber-700); }
        .portage-step-text { font-size: 0.88rem; line-height: 1.55; color: var(--p-neutral-700); margin-top: 8px; }
        .portage-tags-strip { margin-top: 24px; background: var(--p-white); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-lg); padding: 20px; }
        .portage-tags-cluster { display: flex; flex-wrap: wrap; gap: 8px; }
        .portage-pill-tag { font-size: 0.76rem; font-weight: 700; padding: 6px 14px; background: var(--p-green-50); border: 1px solid var(--p-green-200); border-radius: var(--p-radius-full); color: var(--p-green-800); }
        .portage-tags-note { margin-top: 14px; font-size: 0.84rem; line-height: 1.55; color: var(--p-neutral-600); }
        .portage-auth-wrapper { position: sticky; top: 86px; }
        .portage-auth-top-indicator { display: flex; align-items: center; gap: 10px; padding-left: 8px; margin-bottom: 12px; }
        .portage-auth-indicator-icon { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: var(--p-radius-sm); background: var(--p-green-100); color: var(--p-green-800); }
        .portage-auth-indicator-title { font-size: 0.84rem; font-weight: 700; color: var(--p-green-900); }
        .portage-auth-indicator-sub { font-size: 0.74rem; color: var(--p-neutral-600); }
        .portage-auth-card { background: var(--p-white); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-xl); padding: 34px 28px; box-shadow: var(--p-shadow-glow); position: relative; }
        .portage-auth-brand-center { text-align: center; margin-bottom: 26px; }
        .portage-auth-logo-symbol { display: inline-flex; align-items: center; justify-content: center; width: 54px; height: 54px; border-radius: var(--p-radius-lg); background: var(--p-green-50); border: 1px solid var(--p-green-200); color: var(--p-green-700); margin-bottom: 14px; box-shadow: var(--p-shadow-sm); }
        .portage-auth-card-title { font-size: 1.45rem; font-weight: 800; letter-spacing: -0.02em; color: var(--p-neutral-900); }
        .portage-auth-card-desc { font-size: 0.84rem; color: var(--p-neutral-600); margin-top: 4px; line-height: 1.45; }
        .portage-tab-segmented { display: flex; background: var(--p-neutral-100); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-md); padding: 4px; margin-bottom: 24px; gap: 4px; }
        .portage-tab-button { flex: 1; padding: 10px 12px; font-size: 0.85rem; font-weight: 700; border: none; background: transparent; color: var(--p-neutral-600); border-radius: 12px; cursor: pointer; transition: var(--p-transition); }
        .portage-tab-button:hover { color: var(--p-neutral-900); }
        .portage-tab-button.active { background: var(--p-white); color: var(--p-green-900); box-shadow: var(--p-shadow-sm); }
        .portage-form-element { display: flex; flex-direction: column; gap: 16px; }
        .portage-input-group { display: flex; flex-direction: column; gap: 6px; }
        .portage-input-label { font-size: 0.78rem; font-weight: 700; color: var(--p-neutral-700); display: flex; justify-content: space-between; align-items: center; }
        .portage-input-box { position: relative; display: flex; align-items: center; }
        .portage-input-leading-icon { position: absolute; left: 14px; color: var(--p-neutral-500); pointer-events: none; width: 17px; height: 17px; }
        .portage-text-field { width: 100%; padding: 12px 14px; font-size: 0.88rem; font-family: inherit; color: var(--p-neutral-900); background: var(--p-neutral-50); border: 1px solid var(--p-neutral-300); border-radius: var(--p-radius-sm); outline: none; transition: var(--p-transition); }
        .portage-text-field.with-icon { padding-left: 42px; }
        .portage-text-field.with-trailing-button { padding-right: 44px; }
        .portage-text-field:focus { border-color: var(--p-green-600); background: var(--p-white); box-shadow: 0 0 0 4px rgba(79, 168, 120, 0.18); }
        .portage-input-action-btn { position: absolute; right: 12px; background: transparent; border: none; color: var(--p-neutral-500); cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 4px; border-radius: 6px; transition: var(--p-transition); }
        .portage-input-action-btn:hover { color: var(--p-neutral-800); }
        .portage-strength-meter { margin-top: 4px; display: flex; flex-direction: column; gap: 4px; }
        .portage-strength-track { height: 5px; width: 100%; background: var(--p-neutral-200); border-radius: var(--p-radius-full); overflow: hidden; }
        .portage-strength-bar { height: 100%; transition: width 0.35s ease, background-color 0.35s ease; border-radius: var(--p-radius-full); }
        .portage-status-message { display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border-radius: var(--p-radius-sm); font-size: 0.82rem; font-weight: 600; line-height: 1.45; animation: portageFadeIn 0.25s ease-out; }
        @keyframes portageFadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        .portage-status-error { background: #FEF2F2; border: 1px solid #FECACA; color: #DC2626; }
        .portage-status-success { background: #F0FDF4; border: 1px solid #BBF7D0; color: #15803D; }
        .portage-submit-button { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 13px 20px; font-size: 0.92rem; font-weight: 700; color: var(--p-white); background: var(--p-green-700); border: none; border-radius: var(--p-radius-sm); box-shadow: 0 4px 14px rgba(49, 104, 73, 0.25); cursor: pointer; transition: var(--p-transition); margin-top: 6px; }
        .portage-submit-button:hover:not(:disabled) { background: var(--p-green-800); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(49, 104, 73, 0.35); }
        .portage-submit-button:active:not(:disabled) { transform: translateY(0); }
        .portage-submit-button:disabled { opacity: 0.65; cursor: not-allowed; }
        .portage-auth-card-footer { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 22px; padding-top: 18px; border-top: 1px solid var(--p-neutral-200); font-size: 0.74rem; font-weight: 600; color: var(--p-neutral-500); }
        .portage-about-section { padding-top: 80px; padding-bottom: 80px; background: var(--p-white); border-bottom: 1px solid var(--p-neutral-200); }
        .portage-about-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 48px; align-items: center; }
        .portage-section-kicker { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.2em; color: var(--p-amber-600); display: block; }
        .portage-section-heading { font-size: clamp(1.8rem, 3.2vw, 2.5rem); font-weight: 800; letter-spacing: -0.025em; color: var(--p-green-950); line-height: 1.15; margin-top: 10px; }
        .portage-section-lead { margin-top: 18px; font-size: 1.02rem; line-height: 1.65; color: var(--p-neutral-700); }
        .portage-methodology-card { background: var(--p-neutral-100); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-xl); padding: 32px; box-shadow: var(--p-shadow-sm); }
        .portage-methodology-header { display: flex; align-items: flex-start; gap: 16px; }
        .portage-methodology-icon { display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: var(--p-radius-md); background: var(--p-white); color: var(--p-green-800); box-shadow: var(--p-shadow-sm); flex-shrink: 0; }
        .portage-methodology-title { font-size: 1.15rem; font-weight: 800; color: var(--p-green-900); }
        .portage-methodology-text { font-size: 0.88rem; line-height: 1.6; color: var(--p-neutral-700); margin-top: 8px; }
        .portage-pillars-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 24px; }
        .portage-pillar-box { background: var(--p-white); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-md); padding: 18px 16px; box-shadow: var(--p-shadow-sm); }
        .portage-pillar-box.highlight { background: var(--p-amber-50); border-color: var(--p-amber-100); }
        .portage-pillar-title { font-size: 0.92rem; font-weight: 700; color: var(--p-green-900); margin-top: 8px; }
        .portage-pillar-box.highlight .portage-pillar-title { color: var(--p-amber-700); }
        .portage-pillar-desc { font-size: 0.78rem; line-height: 1.5; color: var(--p-neutral-600); margin-top: 4px; }
        .portage-areas-section { padding-top: 80px; padding-bottom: 80px; background: var(--p-neutral-50); border-bottom: 1px solid var(--p-neutral-200); }
        .portage-areas-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-top: 36px; }
        .portage-area-accordion { background: var(--p-white); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-lg); box-shadow: var(--p-shadow-sm); transition: var(--p-transition); overflow: hidden; }
        .portage-area-accordion:hover { transform: translateY(-3px); box-shadow: var(--p-shadow-md); }
        .portage-area-summary { list-style: none; padding: 22px 18px; cursor: pointer; user-select: none; }
        .portage-area-summary::-webkit-details-marker { display: none; }
        .portage-area-icon-container { width: 48px; height: 48px; border-radius: var(--p-radius-md); display: flex; align-items: center; justify-content: center; border: 1px solid transparent; }
        .portage-area-accordion[data-accent="emerald"] .portage-area-icon-container { background: #EFFAF3; border-color: #CFEBD8; color: #2D6A4F; }
        .portage-area-accordion[data-accent="amber"] .portage-area-icon-container { background: #FFFBEA; border-color: #F1E4AF; color: #806316; }
        .portage-area-accordion[data-accent="sage"] .portage-area-icon-container { background: #F4F9EC; border-color: #DCE9C8; color: #55723F; }
        .portage-area-accordion[data-accent="gold"] .portage-area-icon-container { background: #F7F4E9; border-color: #E8DFBE; color: #76672C; }
        .portage-area-accordion[data-accent="teal"] .portage-area-icon-container { background: #EEF8F0; border-color: #D3E8D7; color: #3F7350; }
        .portage-area-eyebrow { font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.16em; color: var(--p-neutral-500); margin-top: 18px; }
        .portage-area-name { font-size: 1.05rem; font-weight: 800; color: var(--p-green-900); margin-top: 6px; min-height: 52px; line-height: 1.3; }
        .portage-area-toggle-row { display: flex; align-items: center; justify-content: space-between; padding-top: 14px; margin-top: 14px; border-top: 1px solid var(--p-neutral-200); font-size: 0.76rem; font-weight: 700; color: var(--p-green-700); }
        .portage-area-chevron { transition: transform 0.25s ease; }
        .portage-area-accordion[open] .portage-area-chevron { transform: rotate(180deg); }
        .portage-area-details-body { padding: 16px 18px 20px; border-top: 1px solid var(--p-neutral-200); background: var(--p-neutral-50); font-size: 0.85rem; line-height: 1.6; color: var(--p-neutral-700); }
        .portage-importance-section { padding-top: 80px; padding-bottom: 80px; }
        .portage-importance-banner { background: var(--p-green-900); border-radius: var(--p-radius-xl); padding: 54px 44px; color: var(--p-white); box-shadow: var(--p-shadow-glow); position: relative; overflow: hidden; }
        .portage-importance-banner::after { content: ''; position: absolute; top: -120px; right: -120px; width: 380px; height: 380px; background: radial-gradient(circle, rgba(217, 155, 38, 0.15) 0%, transparent 70%); pointer-events: none; }
        .portage-importance-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 48px; align-items: center; position: relative; z-index: 1; }
        .portage-importance-kicker { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.2em; color: var(--p-amber-500); }
        .portage-importance-title { font-size: clamp(1.8rem, 3.2vw, 2.4rem); font-weight: 800; line-height: 1.18; letter-spacing: -0.02em; color: var(--p-white); margin-top: 10px; }
        .portage-importance-desc { font-size: 0.98rem; line-height: 1.65; color: var(--p-green-100); margin-top: 18px; }
        .portage-benefits-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .portage-benefit-card { background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.14); border-radius: var(--p-radius-md); padding: 22px; backdrop-filter: blur(8px); }
        .portage-benefit-card.highlight { background: rgba(253, 243, 220, 0.12); border-color: rgba(253, 243, 220, 0.26); }
        .portage-benefit-emoji { font-size: 1.6rem; line-height: 1; }
        .portage-benefit-title { font-size: 0.98rem; font-weight: 700; color: var(--p-white); margin-top: 12px; }
        .portage-benefit-card.highlight .portage-benefit-title { color: var(--p-amber-100); }
        .portage-benefit-desc { font-size: 0.82rem; line-height: 1.55; color: var(--p-green-100); margin-top: 6px; }
        .portage-benefit-card.highlight .portage-benefit-desc { color: var(--p-amber-50); }
        .portage-clinical-disclaimer { max-width: 860px; margin: 32px auto 0; background: var(--p-white); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-lg); padding: 20px 24px; text-align: center; box-shadow: var(--p-shadow-sm); }
        .portage-disclaimer-text { font-size: 0.82rem; line-height: 1.6; color: var(--p-neutral-600); }
        .portage-disclaimer-text strong { color: var(--p-neutral-800); }
        .portage-footer { background: var(--p-white); border-top: 1px solid var(--p-neutral-200); padding: 28px 0; }
        .portage-footer-inner { display: flex; align-items: center; justify-content: space-between; font-size: 0.82rem; color: var(--p-neutral-600); }
        .portage-footer-brand-tag { display: flex; align-items: center; gap: 8px; }
        .portage-footer-brand-title { font-weight: 800; color: var(--p-green-900); }
        .portage-footer-nav-links { display: flex; align-items: center; gap: 24px; }
        .portage-footer-nav-links a { color: inherit; text-decoration: none; transition: var(--p-transition); }
        .portage-footer-nav-links a:hover { color: var(--p-green-800); }
        @media (max-width: 1080px) {
          .portage-hero-grid { grid-template-columns: 1fr; }
          .portage-auth-wrapper { position: static; max-width: 520px; margin: 0 auto; }
          .portage-areas-grid { grid-template-columns: repeat(3, 1fr); }
          .portage-about-grid, .portage-importance-grid { grid-template-columns: 1fr; gap: 36px; }
        }
        @media (max-width: 768px) {
          .portage-header-inner { padding-top: 12px; padding-bottom: 12px; }
          .portage-nav, .portage-badge-edition { display: none; }
          .portage-steps-grid, .portage-pillars-row, .portage-benefits-grid { grid-template-columns: 1fr; }
          .portage-areas-grid { grid-template-columns: repeat(2, 1fr); }
          .portage-importance-banner { padding: 36px 24px; }
          .portage-footer-inner { flex-direction: column; gap: 16px; text-align: center; }
        }
        @media (max-width: 520px) {
          .portage-container { padding-left: 16px; padding-right: 16px; }
          .portage-explain-panel { padding: 24px 18px; }
          .portage-auth-card { padding: 26px 18px; }
          .portage-areas-grid { grid-template-columns: 1fr; }
          .portage-hero-title { font-size: 1.85rem; }
        }
      `}</style>

      <div className="portage-ambient-canvas" aria-hidden="true" />
      <div className="portage-ambient-orb-1" aria-hidden="true" />
      <div className="portage-ambient-orb-2" aria-hidden="true" />

      <header className="portage-header">
        <div className="portage-header-inner">
          <a href="#inicio" className="portage-brand-lockup">
            <div className="portage-brand-icon-box">
              <Stethoscope size={20} />
            </div>
            <div>
              <div className="portage-brand-title">
                Portage<span>Platform</span>
              </div>
              <div className="portage-brand-subtitle">
                Desenvolvimento infantil
              </div>
            </div>
          </a>

          <nav className="portage-nav">
            <a href="#inicio" className="portage-nav-link">Início</a>
            <a href="#portage" className="portage-nav-link">O Portage</a>
            <a href="#areas" className="portage-nav-link">Áreas</a>
            <a href="#importancia" className="portage-nav-link">Importância</a>
          </nav>

          <div className="portage-header-actions">
            <span className="portage-badge-edition">
              <Code2 size={14} color="#3E825D" />
              Edição 2026
            </span>
            <a href="#acesso" className="portage-btn-nav-cta">
              Acessar
            </a>
          </div>
        </div>
      </header>

      <main>
        <section id="inicio" className="portage-hero-section">
          <div className="portage-container">
            <div className="portage-kicker-badge">
              <span className="portage-kicker-dot" />
              Plataforma clínica • desenvolvimento infantil
            </div>
            <h1 className="portage-hero-title">
              Informação organizada para
              <span className="portage-hero-title-accent">acompanhar o desenvolvimento.</span>
            </h1>
            <p className="portage-hero-desc">
              Uma interface pensada para profissionais que precisam acessar o sistema com rapidez,
              mantendo o conteúdo sobre o Portage em uma experiência clara e separada.
            </p>

            <div className="portage-hero-grid">
              
              <div className="portage-explain-panel">
                <div className="portage-explain-header">
                  <div className="portage-explain-icon-box">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <span className="portage-explain-kicker">Antes de entrar</span>
                    <h2 className="portage-explain-heading">Uma visão geral do que você encontrará</h2>
                  </div>
                </div>

                <div className="portage-steps-grid">
                  <div className="portage-step-card portage-step-card-1">
                    <div className="portage-step-index">01</div>
                    <h3 className="portage-step-title">Acesso ao sistema</h3>
                    <p className="portage-step-text">Entre em sua conta clínica ou realize o cadastro para continuar.</p>
                  </div>
                  <div className="portage-step-card portage-step-card-2">
                    <div className="portage-step-index">02</div>
                    <h3 className="portage-step-title">Informação organizada</h3>
                    <p className="portage-step-text">Conheça abaixo a lógica das áreas que compõem a visão apresentada pelo Portage.</p>
                  </div>
                </div>

                <div className="portage-tags-strip">
                  <div className="portage-tags-cluster">
                    {['Socialização', 'Linguagem', 'Autocuidados', 'Cognição', 'Motor'].map((item) => (
                      <span key={item} className="portage-pill-tag">
                        {item}
                      </span>
                    ))}
                  </div>
                  <p className="portage-tags-note">
                    Os conteúdos educativos estão concentrados nas seções abaixo para que a tela de acesso continue limpa e objetiva.
                  </p>
                </div>
              </div>

              <div id="acesso" className="portage-auth-wrapper">
                <div className="portage-auth-top-indicator">
                  <div className="portage-auth-indicator-icon">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <div className="portage-auth-indicator-title">Acesso clínico</div>
                    <div className="portage-auth-indicator-sub">Entre ou crie sua conta</div>
                  </div>
                </div>

                <div className="portage-auth-card">
                  <div className="portage-auth-brand-center">
                    <div className="portage-auth-logo-symbol">
                      <Stethoscope size={28} />
                    </div>
                    <h2 className="portage-auth-card-title">Portage Platform</h2>
                    <p className="portage-auth-card-desc">Portal Clínico para Avaliação do Desenvolvimento Infantil</p>
                  </div>

                  <div className="portage-tab-segmented">
                    <button
                      type="button"
                      onClick={() => { setMode('login'); setMessage(null); }}
                      className={`portage-tab-button ${mode === 'login' ? 'active' : ''}`}
                    >
                      Entrar na Conta
                    </button>
                    <button
                      type="button"
                      onClick={() => { setMode('signup'); setMessage(null); }}
                      className={`portage-tab-button ${mode === 'signup' ? 'active' : ''}`}
                    >
                      Criar Cadastro
                    </button>
                  </div>

                  <form onSubmit={mode === 'login' ? handleLogin : handleSignUp} className="portage-form-element">
                    {mode === 'signup' && (
                      <div className="portage-input-group">
                        <label htmlFor={`${formId}-fullName`} className="portage-input-label">
                          Nome Completo
                        </label>
                        <div className="portage-input-box">
                          <input
                            id={`${formId}-fullName`}
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Dra. Helena Martins"
                            className="portage-text-field"
                          />
                        </div>
                      </div>
                    )}

                    <div className="portage-input-group">
                      <label htmlFor={`${formId}-email`} className="portage-input-label">
                        E-mail Clínico
                      </label>
                      <div className="portage-input-box">
                        <Mail className="portage-input-leading-icon" />
                        <input
                          id={`${formId}-email`}
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="seu.nome@clinica.com.br"
                          className="portage-text-field with-icon"
                        />
                      </div>
                    </div>

                    <div className="portage-input-group">
                      <label htmlFor={`${formId}-password`} className="portage-input-label">
                        Senha Segura
                      </label>
                      <div className="portage-input-box">
                        <Lock className="portage-input-leading-icon" />
                        <input
                          id={`${formId}-password`}
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="portage-text-field with-icon with-trailing-button"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="portage-input-action-btn"
                          aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>

                      {password && (
                        <div className="portage-strength-meter">
                          <div className="portage-strength-track">
                            <div
                              className="portage-strength-bar"
                              style={{
                                width: `${Math.max(strength, 15)}%`,
                                backgroundColor: strength > 50 ? '#34D399' : '#FBBF24',
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {message && (
                      <div className={`portage-status-message ${message.type === 'error' ? 'portage-status-error' : 'portage-status-success'}`}>
                        {message.type === 'error' ? (
                          <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                        ) : (
                          <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                        )}
                        <span>{message.text}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="portage-submit-button"
                    >
                      {loading ? 'A Processar...' : mode === 'login' ? 'Entrar no Sistema' : 'Registar Conta'}
                      {!loading && <ArrowRight size={16} />}
                    </button>
                  </form>

                  <div className="portage-auth-card-footer">
                    <ShieldCheck size={14} color="#3E825D" />
                    <span>Acesso seguro em conformidade com a LGPD</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section id="portage" className="portage-about-section">
          <div className="portage-container">
            <div className="portage-about-grid">
              <div>
                <span className="portage-section-kicker">Sobre o Portage</span>
                <h2 className="portage-section-heading">
                  Um conteúdo educativo separado do acesso.
                </h2>
                <p className="portage-section-lead">
                  O conteúdo informativo desta página apresenta uma visão geral das áreas tradicionalmente associadas ao Portage,
                  mantendo a explicação concentrada em uma seção própria para facilitar a leitura.
                </p>
              </div>

              <div className="portage-methodology-card">
                <div className="portage-methodology-header">
                  <div className="portage-methodology-icon">
                    <Target size={22} />
                  </div>
                  <div>
                    <h3 className="portage-methodology-title">Observar, planejar e acompanhar</h3>
                    <p className="portage-methodology-text">
                      A organização por áreas ajuda a apresentar diferentes dimensões do desenvolvimento de maneira estruturada,
                      apoiando a observação e o planejamento de acordo com o instrumento e a orientação profissional adotados pelo serviço.
                    </p>
                  </div>
                </div>

                <div className="portage-pillars-row">
                  <div className="portage-pillar-box">
                    <BookOpen size={20} color="#3E825D" />
                    <div className="portage-pillar-title">Observar</div>
                    <div className="portage-pillar-desc">Organizar informações sobre habilidades.</div>
                  </div>
                  <div className="portage-pillar-box highlight">
                    <Target size={20} color="#B68119" />
                    <div className="portage-pillar-title">Planejar</div>
                    <div className="portage-pillar-desc">Definir objetivos e possibilidades de trabalho.</div>
                  </div>
                  <div className="portage-pillar-box">
                    <Sparkles size={20} color="#3E825D" />
                    <div className="portage-pillar-title">Acompanhar</div>
                    <div className="portage-pillar-desc">Perceber mudanças ao longo do acompanhamento.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="areas" className="portage-areas-section">
          <div className="portage-container">
            <div>
              <span className="portage-section-kicker">As cinco áreas</span>
              <h2 className="portage-section-heading">
                Cada área olha para uma dimensão diferente.
              </h2>
              <p className="portage-section-lead" style={{ maxWidth: '720px' }}>
                Os cards abaixo foram separados para que a informação possa ser lida com calma, sem competir com o formulário de acesso.
              </p>
            </div>

            <div className="portage-areas-grid">
              {areas.map((area, index) => (
                <details
                  key={area.title}
                  className="portage-area-accordion"
                  data-accent={area.accent}
                >
                  <summary className="portage-area-summary">
                    <div className="portage-area-icon-container">
                      {area.icon}
                    </div>
                    <div className="portage-area-eyebrow">
                      0{index + 1} • {area.eyebrow}
                    </div>
                    <h3 className="portage-area-name">{area.title}</h3>
                    <div className="portage-area-toggle-row">
                      <span>Ver explicação</span>
                      <ChevronDown size={16} className="portage-area-chevron" />
                    </div>
                  </summary>
                  <div className="portage-area-details-body">
                    {area.text}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="importancia" className="portage-importance-section">
          <div className="portage-container">
            <div className="portage-importance-banner">
              <div className="portage-importance-grid">
                <div>
                  <span className="portage-importance-kicker">Por que isso importa?</span>
                  <h2 className="portage-importance-title">
                    Uma visão ampla ajuda a organizar o olhar profissional.
                  </h2>
                  <p className="portage-importance-desc">
                    Considerar diferentes áreas ajuda a reunir informações sobre habilidades da criança e a organizar observações,
                    objetivos e estratégias de acompanhamento de forma mais individualizada.
                  </p>
                </div>

                <div className="portage-benefits-grid">
                  <div className="portage-benefit-card">
                    <div className="portage-benefit-emoji">🌱</div>
                    <h3 className="portage-benefit-title">Visão integral</h3>
                    <p className="portage-benefit-desc">Permite considerar diferentes dimensões do desenvolvimento em conjunto.</p>
                  </div>
                  <div className="portage-benefit-card">
                    <div className="portage-benefit-emoji">🧩</div>
                    <h3 className="portage-benefit-title">Individualização</h3>
                    <p className="portage-benefit-desc">Ajuda a visualizar habilidades presentes e pontos que precisam de maior atenção.</p>
                  </div>
                  <div className="portage-benefit-card">
                    <div className="portage-benefit-emoji">🤝</div>
                    <h3 className="portage-benefit-title">Família e profissionais</h3>
                    <p className="portage-benefit-desc">Pode favorecer uma linguagem comum para conversar sobre desenvolvimento.</p>
                  </div>
                  <div className="portage-benefit-card highlight">
                    <div className="portage-benefit-emoji">✨</div>
                    <h3 className="portage-benefit-title">Planejamento</h3>
                    <p className="portage-benefit-desc">As observações podem servir de base para organizar objetivos e atividades individualizadas.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="portage-clinical-disclaimer">
              <p className="portage-disclaimer-text">
                <strong>Nota:</strong> o conteúdo informativo desta página apresenta uma visão geral das áreas
                tradicionalmente associadas ao Portage. A aplicação, interpretação e planejamento devem seguir o instrumento,
                manual e orientação profissional adotados pelo serviço.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="portage-footer">
        <div className="portage-container">
          <div className="portage-footer-inner">
            <div className="portage-footer-brand-tag">
              <span className="portage-footer-brand-title">Portage Platform</span>
              <span>•</span>
              <span>Tecnologia Clínica para Primeira Infância</span>
            </div>
            <div className="portage-footer-nav-links">
              <a href="#portage">O Portage</a>
              <a href="#areas">5 Áreas</a>
              <a href="#inicio">Voltar ao topo ↑</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}