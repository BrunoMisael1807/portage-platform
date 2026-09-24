'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import {
  Stethoscope,
  ArrowLeft,
  User,
  Mail,
  ShieldCheck,
  CreditCard,
  Award,
  Phone,
  MapPin,
  Save,
  CheckCircle2,
  AlertCircle,
  Building2,
  FileBadge,
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    cpf: '',
    council_type: '',
    registration_number: '',
    cep: '',
    state: '',
    city: '',
    phone: '',
  });

  // Lógica REAL: Carregamento dos dados do perfil do profissional
  useEffect(() => {
    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      setUserEmail(session.user.email || '');

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        setFormData({
          full_name: profile.full_name || '',
          cpf: profile.cpf || '',
          council_type: profile.council_type || '',
          registration_number: profile.registration_number || '',
          cep: profile.cep || '',
          state: profile.state || '',
          city: profile.city || '',
          phone: profile.phone || '',
        });
      }
      setLoading(false);
    };
    
    loadProfile();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Lógica REAL: Salvamento do perfil no Supabase
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Atualiza a tabela profiles com os dados do formulário e injeta o e-mail logado
    const { error } = await supabase
      .from('profiles')
      .upsert({ 
        id: session.user.id, 
        ...formData, 
        email: session.user.email 
      });

    if (error) {
      setMessage('Erro ao guardar perfil: ' + error.message);
    } else {
      setMessage('Perfil atualizado com sucesso!');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="portage-loading-wrapper">
        <style>{`
          .portage-loading-wrapper {
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background-color: #F8FAF8;
            color: #2D3731;
          }
          .portage-loading-box {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 58px;
            height: 58px;
            border-radius: 18px;
            background: #E2F4E9;
            border: 1px solid #BCE2CB;
            color: #26533A;
            box-shadow: 0 4px 16px rgba(38, 83, 58, 0.1);
            animation: portagePulse 1.8s ease-in-out infinite;
          }
          .portage-loading-title {
            margin-top: 18px;
            font-size: 0.96rem;
            font-weight: 700;
            color: #26533A;
          }
          .portage-loading-subtitle {
            margin-top: 4px;
            font-size: 0.78rem;
            color: #627268;
          }
          @keyframes portagePulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.06); opacity: 0.85; }
          }
        `}</style>
        <div className="portage-loading-box">
          <Stethoscope size={26} />
        </div>
        <div className="portage-loading-title">A carregar perfil...</div>
        <div className="portage-loading-subtitle">Portage Platform • Segurança e Credenciais Clínicas</div>
      </div>
    );
  }

  return (
    <div className="portage-profile-root">
      <style>{`
        :root {
          --p-font: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          --p-green-950: #132A1C; --p-green-900: #1D3E2B; --p-green-800: #26533A;
          --p-green-700: #316849; --p-green-600: #3E825D; --p-green-500: #4FA878;
          --p-green-200: #BCE2CB; --p-green-100: #E2F4E9; --p-green-50:  #F2FAF5;
          --p-amber-700: #8C6212; --p-amber-600: #B68119; --p-amber-500: #D99B26;
          --p-amber-100: #FDF3DC; --p-amber-50:  #FFFBF2;
          --p-neutral-900: #1C2420; --p-neutral-800: #2D3731; --p-neutral-700: #46534B;
          --p-neutral-600: #627268; --p-neutral-500: #83938A; --p-neutral-300: #D2DDD6;
          --p-neutral-200: #E5EDE8; --p-neutral-100: #F3F7F4; --p-neutral-50:  #F8FAF8;
          --p-white: #FFFFFF;
          --p-shadow-sm: 0 1px 3px rgba(29, 62, 43, 0.05);
          --p-shadow-md: 0 6px 20px -3px rgba(29, 62, 43, 0.08);
          --p-shadow-lg: 0 16px 40px -8px rgba(29, 62, 43, 0.12);
          --p-radius-sm: 10px; --p-radius-md: 16px; --p-radius-lg: 24px; --p-radius-full: 9999px;
          --p-transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .portage-profile-root { font-family: var(--p-font); color: var(--p-neutral-900); background-color: var(--p-neutral-50); min-height: 100vh; position: relative; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; line-height: 1.5; }
        .portage-profile-root * { box-sizing: border-box; margin: 0; padding: 0; }
        .portage-ambient-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; background: radial-gradient(circle at 10% 8%, rgba(253, 243, 220, 0.5) 0%, transparent 28%), radial-gradient(circle at 90% 12%, rgba(226, 244, 233, 0.65) 0%, transparent 32%), radial-gradient(circle at 50% 90%, rgba(242, 250, 245, 0.8) 0%, transparent 40%); }
        .portage-top-navbar { position: sticky; top: 0; z-index: 40; background: rgba(255, 255, 255, 0.92); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid var(--p-neutral-200); }
        .portage-top-navbar-inner { max-width: 900px; margin: 0 auto; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; }
        .portage-top-brand { display: flex; align-items: center; gap: 12px; text-decoration: none; color: inherit; }
        .portage-top-brand-icon { display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: var(--p-radius-sm); background: var(--p-green-100); border: 1px solid var(--p-green-200); color: var(--p-green-800); }
        .portage-top-brand-title { font-size: 1.1rem; font-weight: 800; letter-spacing: -0.02em; color: var(--p-neutral-900); line-height: 1.2; }
        .portage-top-brand-title span { font-weight: 500; color: var(--p-neutral-600); }
        .portage-top-pill { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; font-size: 0.78rem; font-weight: 700; color: var(--p-green-900); background: var(--p-neutral-100); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-full); }
        .portage-dot-status { width: 8px; height: 8px; border-radius: 50%; background: var(--p-green-500); box-shadow: 0 0 0 3px rgba(79, 168, 120, 0.25); }
        .portage-main-container { max-width: 860px; margin: 0 auto; padding: 40px 24px 120px; position: relative; z-index: 1; }
        .portage-page-header { padding-bottom: 24px; border-bottom: 1px solid var(--p-neutral-200); margin-bottom: 32px; }
        .portage-btn-back { display: inline-flex; align-items: center; gap: 6px; background: transparent; border: none; color: var(--p-green-700); font-size: 0.86rem; font-weight: 700; cursor: pointer; margin-bottom: 12px; padding: 4px 0; transition: var(--p-transition); }
        .portage-btn-back:hover { color: var(--p-green-900); transform: translateX(-2px); }
        .portage-page-title { font-size: clamp(1.8rem, 3.2vw, 2.35rem); font-weight: 800; letter-spacing: -0.025em; color: var(--p-green-950); line-height: 1.15; }
        .portage-page-subtitle { margin-top: 6px; font-size: 0.95rem; color: var(--p-neutral-600); }
        .portage-feedback-banner { display: flex; align-items: flex-start; gap: 12px; padding: 14px 18px; border-radius: var(--p-radius-sm); font-size: 0.88rem; font-weight: 600; margin-bottom: 24px; animation: portageSlideDown 0.25s ease-out; }
        @keyframes portageSlideDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        .portage-feedback-error { background: #FEF2F2; border: 1px solid #FECACA; color: #DC2626; }
        .portage-feedback-success { background: #F0FDF4; border: 1px solid #BBF7D0; color: #15803D; }
        .portage-profile-card { background: var(--p-white); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-lg); padding: 36px 32px; box-shadow: var(--p-shadow-md); display: flex; flex-direction: column; gap: 32px; }
        .portage-section-block { display: flex; flex-direction: column; gap: 18px; }
        .portage-section-title-row { display: flex; align-items: center; gap: 10px; padding-bottom: 12px; border-bottom: 1px solid var(--p-neutral-200); font-size: 1.15rem; font-weight: 800; color: var(--p-green-900); }
        .portage-section-badge-icon { width: 32px; height: 32px; border-radius: 8px; background: var(--p-green-100); color: var(--p-green-800); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .portage-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .portage-field-group { display: flex; flex-direction: column; gap: 6px; }
        .portage-field-label { font-size: 0.78rem; font-weight: 700; color: var(--p-neutral-700); }
        .portage-input-box { position: relative; display: flex; align-items: center; }
        .portage-input-leading-icon { position: absolute; left: 14px; color: var(--p-neutral-500); pointer-events: none; }
        .portage-field-input, .portage-field-select { width: 100%; padding: 12px 14px; font-size: 0.88rem; font-family: inherit; color: var(--p-neutral-900); background: var(--p-neutral-50); border: 1px solid var(--p-neutral-300); border-radius: var(--p-radius-sm); outline: none; transition: var(--p-transition); }
        .portage-field-input.with-icon, .portage-field-select.with-icon { padding-left: 42px; }
        .portage-field-input:focus, .portage-field-select:focus { border-color: var(--p-green-600); background: var(--p-white); box-shadow: 0 0 0 4px rgba(79, 168, 120, 0.18); }
        .portage-field-input.disabled { background: var(--p-neutral-100); border-color: var(--p-neutral-200); color: var(--p-neutral-500); cursor: not-allowed; }
        .portage-field-input.uppercase { text-transform: uppercase; }
        .portage-btn-save-profile { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 14px 24px; font-size: 0.98rem; font-weight: 800; color: var(--p-white); background: var(--p-green-700); border: none; border-radius: var(--p-radius-sm); cursor: pointer; box-shadow: 0 4px 16px rgba(49, 104, 73, 0.28); transition: var(--p-transition); margin-top: 12px; }
        .portage-btn-save-profile:hover:not(:disabled) { background: var(--p-green-800); transform: translateY(-1px); box-shadow: 0 6px 22px rgba(49, 104, 73, 0.38); }
        .portage-btn-save-profile:active:not(:disabled) { transform: translateY(0); }
        .portage-btn-save-profile:disabled { opacity: 0.65; cursor: not-allowed; }
        .portage-profile-footer-tip { margin-top: 24px; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 0.78rem; color: var(--p-neutral-500); text-align: center; }
        @media (max-width: 768px) { .portage-grid-2 { grid-template-columns: 1fr; } }
        @media (max-width: 640px) {
          .portage-main-container { padding: 24px 16px 80px; }
          .portage-top-navbar-inner { padding: 12px 16px; }
          .portage-profile-card { padding: 24px 18px; gap: 26px; }
          .portage-page-title { font-size: 1.75rem; }
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
            <span>Credenciais Protegidas</span>
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
          <h1 className="portage-page-title">Perfil Profissional</h1>
          <p className="portage-page-subtitle">
            Mantenha os seus dados de registo clínico atualizados.
          </p>
        </div>

        {message && (
          <div
            className={`portage-feedback-banner ${
              message.includes('Erro')
                ? 'portage-feedback-error'
                : 'portage-feedback-success'
            }`}
            role="alert"
          >
            {message.includes('Erro') ? (
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
            ) : (
              <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
            )}
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="portage-profile-card">
          
          <div className="portage-section-block">
            <h2 className="portage-section-title-row">
              <div className="portage-section-badge-icon">
                <User size={18} />
              </div>
              <span>Identificação</span>
            </h2>

            <div className="portage-field-group">
              <label className="portage-field-label">Nome Completo</label>
              <div className="portage-input-box">
                <User size={16} className="portage-input-leading-icon" />
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  placeholder="Nome profissional completo"
                  className="portage-field-input with-icon"
                />
              </div>
            </div>

            <div className="portage-grid-2">
              <div className="portage-field-group">
                <label className="portage-field-label">CPF</label>
                <div className="portage-input-box">
                  <CreditCard size={16} className="portage-input-leading-icon" />
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    className="portage-field-input with-icon"
                  />
                </div>
              </div>

              <div className="portage-field-group">
                <label className="portage-field-label">Email (Login)</label>
                <div className="portage-input-box">
                  <Mail size={16} className="portage-input-leading-icon" />
                  <input
                    type="email"
                    value={userEmail}
                    disabled
                    title="O e-mail da conta é gerenciado pela autenticação"
                    className="portage-field-input with-icon disabled"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="portage-section-block">
            <h2 className="portage-section-title-row">
              <div className="portage-section-badge-icon">
                <Award size={18} />
              </div>
              <span>Registo Profissional</span>
            </h2>

            <div className="portage-grid-2">
              <div className="portage-field-group">
                <label className="portage-field-label">Conselho de Classe</label>
                <div className="portage-input-box">
                  <Building2 size={16} className="portage-input-leading-icon" />
                  <select
                    name="council_type"
                    value={formData.council_type}
                    onChange={handleChange}
                    required
                    className="portage-field-select with-icon"
                  >
                    <option value="">Selecione...</option>
                    <option value="CRFa">CRFa (Fonoaudiologia)</option>
                    <option value="CREFITO_TO">CREFITO (Terapia Ocupacional)</option>
                    <option value="CREFITO_FISIO">CREFITO (Fisioterapia)</option>
                    <option value="CRP">CRP (Psicologia)</option>
                    <option value="CREF">CREF (Educação Física)</option>
                    <option value="ABPp">ABPp (Psicopedagogia)</option>
                    <option value="ABP">ABP (Psicomotricidade)</option>
                    <option value="OUTRO">Outro / Sem Conselho</option>
                  </select>
                </div>
              </div>

              <div className="portage-field-group">
                <label className="portage-field-label">Número do Conselho</label>
                <div className="portage-input-box">
                  <FileBadge size={16} className="portage-input-leading-icon" />
                  <input
                    type="text"
                    name="registration_number"
                    value={formData.registration_number}
                    onChange={handleChange}
                    required
                    placeholder="Ex: 14820/SP"
                    className="portage-field-input with-icon"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="portage-section-block">
            <h2 className="portage-section-title-row">
              <div className="portage-section-badge-icon">
                <MapPin size={18} />
              </div>
              <span>Contacto e Endereço</span>
            </h2>

            <div className="portage-grid-2">
              <div className="portage-field-group">
                <label className="portage-field-label">Telefone / WhatsApp</label>
                <div className="portage-input-box">
                  <Phone size={16} className="portage-input-leading-icon" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(11) 98765-4321"
                    className="portage-field-input with-icon"
                  />
                </div>
              </div>

              <div className="portage-field-group">
                <label className="portage-field-label">CEP</label>
                <div className="portage-input-box">
                  <MapPin size={16} className="portage-input-leading-icon" />
                  <input
                    type="text"
                    name="cep"
                    value={formData.cep}
                    onChange={handleChange}
                    placeholder="00000-000"
                    className="portage-field-input with-icon"
                  />
                </div>
              </div>
            </div>

            <div className="portage-grid-2">
              <div className="portage-field-group">
                <label className="portage-field-label">Estado (UF)</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  maxLength={2}
                  placeholder="Ex: PB"
                  className="portage-field-input uppercase"
                />
              </div>

              <div className="portage-field-group">
                <label className="portage-field-label">Cidade</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Nome do município"
                  className="portage-field-input"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="portage-btn-save-profile"
          >
            <Save size={18} />
            <span>{saving ? 'A Guardar...' : 'Salvar Perfil Profissional'}</span>
          </button>
        </form>

        <div className="portage-profile-footer-tip">
          <ShieldCheck size={14} color="#3E825D" />
          <span>Os dados de registo são exibidos nos relatórios clínicos emitidos pela plataforma.</span>
        </div>

      </main>
    </div>
  );
}