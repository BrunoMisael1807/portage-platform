'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import {
  Users,
  Stethoscope,
  ArrowLeft,
  UserPlus,
  X,
  Calendar,
  Ruler,
  Weight,
  Phone,
  Mail,
  User,
  AlertCircle,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Heart,
  Baby,
  FileText,
} from 'lucide-react';

export default function PatientsManagerPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    birth_date: '',
    height: '',
    weight: '',
    father_name: '',
    father_email: '',
    father_phone: '',
    mother_name: '',
    mother_email: '',
    mother_phone: '',
  });

  const calculateAge = (dob: string) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Lógica REAL: Busca pacientes criados por mim OU partilhados comigo
  const fetchPatients = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push('/login');
      return;
    }

    const { data: myPatients } = await supabase
      .from('patients')
      .select('*')
      .eq('professional_id', session.user.id);

    const { data: shared } = await supabase
      .from('patient_shares')
      .select('patient_id')
      .eq('shared_with', session.user.id);

    let allPatients = myPatients || [];
    
    if (shared && shared.length > 0) {
      const sharedIds = shared.map((s: any) => s.patient_id);
      const { data: sharedPatients } = await supabase
        .from('patients')
        .select('*')
        .in('id', sharedIds);
        
      if (sharedPatients) {
        allPatients = [...allPatients, ...sharedPatients];
      }
    }

    // Ordenar do mais recente para o mais antigo
    allPatients.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setPatients(allPatients);
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Lógica REAL: Salvar paciente no Supabase
  const handleSavePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.father_name && !formData.mother_name) {
      setErrorMsg('É obrigatório preencher os dados de pelo menos um dos responsáveis (Pai ou Mãe).');
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('patients')
      .insert([{ professional_id: session.user.id, ...formData }])
      .select()
      .single();

    if (error) {
      setErrorMsg('Erro ao guardar: ' + error.message);
    } else if (data) {
      // Redireciona imediatamente para o histórico clínico (prontuário) do paciente criado
      router.push(`/dashboard/patient/${data.id}`);
    }
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
          <Users size={26} />
        </div>
        <div className="portage-loading-title">A carregar lista de pacientes...</div>
        <div className="portage-loading-subtitle">Portage Platform • Prontuários Clínicos Seguros</div>
      </div>
    );
  }

  return (
    <div className="portage-patients-root">
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
        .portage-patients-root { font-family: var(--p-font); color: var(--p-neutral-900); background-color: var(--p-neutral-50); min-height: 100vh; position: relative; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; line-height: 1.5; }
        .portage-patients-root * { box-sizing: border-box; margin: 0; padding: 0; }
        .portage-ambient-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; background: radial-gradient(circle at 10% 8%, rgba(253, 243, 220, 0.5) 0%, transparent 28%), radial-gradient(circle at 90% 12%, rgba(226, 244, 233, 0.65) 0%, transparent 32%), radial-gradient(circle at 50% 90%, rgba(242, 250, 245, 0.8) 0%, transparent 40%); }
        .portage-top-navbar { position: sticky; top: 0; z-index: 40; background: rgba(255, 255, 255, 0.92); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid var(--p-neutral-200); }
        .portage-top-navbar-inner { max-width: 1180px; margin: 0 auto; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; }
        .portage-top-brand { display: flex; align-items: center; gap: 12px; text-decoration: none; color: inherit; }
        .portage-top-brand-icon { display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: var(--p-radius-sm); background: var(--p-green-100); border: 1px solid var(--p-green-200); color: var(--p-green-800); }
        .portage-top-brand-title { font-size: 1.1rem; font-weight: 800; letter-spacing: -0.02em; color: var(--p-neutral-900); line-height: 1.2; }
        .portage-top-brand-title span { font-weight: 500; color: var(--p-neutral-600); }
        .portage-top-pill { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; font-size: 0.78rem; font-weight: 700; color: var(--p-green-900); background: var(--p-neutral-100); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-full); }
        .portage-dot-status { width: 8px; height: 8px; border-radius: 50%; background: var(--p-green-500); box-shadow: 0 0 0 3px rgba(79, 168, 120, 0.25); }
        .portage-main-container { max-width: 1180px; margin: 0 auto; padding: 40px 24px 120px; position: relative; z-index: 1; }
        .portage-page-header { display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 24px; border-bottom: 1px solid var(--p-neutral-200); margin-bottom: 32px; }
        .portage-btn-back { display: inline-flex; align-items: center; gap: 6px; background: transparent; border: none; color: var(--p-green-700); font-size: 0.86rem; font-weight: 700; cursor: pointer; margin-bottom: 10px; padding: 4px 0; transition: var(--p-transition); }
        .portage-btn-back:hover { color: var(--p-green-900); transform: translateX(-2px); }
        .portage-page-title { font-size: clamp(1.8rem, 3.2vw, 2.35rem); font-weight: 800; letter-spacing: -0.025em; color: var(--p-green-950); line-height: 1.15; }
        .portage-page-subtitle { margin-top: 6px; font-size: 0.95rem; color: var(--p-neutral-600); display: flex; align-items: center; gap: 8px; }
        .portage-count-tag { font-size: 0.74rem; font-weight: 700; padding: 2px 10px; background: var(--p-green-100); border: 1px solid var(--p-green-200); color: var(--p-green-800); border-radius: var(--p-radius-full); }
        .portage-btn-primary-action { display: inline-flex; align-items: center; gap: 8px; padding: 11px 22px; font-size: 0.88rem; font-weight: 700; color: var(--p-white); background: var(--p-green-700); border: none; border-radius: var(--p-radius-sm); cursor: pointer; box-shadow: 0 4px 14px rgba(49, 104, 73, 0.25); transition: var(--p-transition); white-space: nowrap; }
        .portage-btn-primary-action:hover { background: var(--p-green-800); transform: translateY(-1px); box-shadow: 0 6px 18px rgba(49, 104, 73, 0.35); }
        .portage-btn-primary-action.cancel-mode { background: var(--p-white); color: #DC2626; border: 1px solid #FECACA; box-shadow: var(--p-shadow-sm); }
        .portage-btn-primary-action.cancel-mode:hover { background: #FEF2F2; border-color: #FCA5A5; }
        .portage-alert-banner { display: flex; align-items: flex-start; gap: 12px; padding: 14px 18px; background: #FEF2F2; border: 1px solid #FECACA; border-radius: var(--p-radius-sm); color: #DC2626; font-size: 0.88rem; font-weight: 600; margin-bottom: 24px; animation: portageSlideDown 0.25s ease-out; }
        @keyframes portageSlideDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        .portage-form-card { background: var(--p-white); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-lg); padding: 34px 30px; box-shadow: var(--p-shadow-md); margin-bottom: 36px; }
        .portage-form-section { margin-bottom: 30px; }
        .portage-form-section-title { font-size: 1.15rem; font-weight: 800; color: var(--p-green-900); padding-bottom: 12px; border-bottom: 1px solid var(--p-neutral-200); margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        .portage-form-section-icon { width: 32px; height: 32px; border-radius: 8px; background: var(--p-green-100); color: var(--p-green-800); display: flex; align-items: center; justify-content: center; }
        .portage-fields-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .portage-field-group { display: flex; flex-direction: column; gap: 6px; }
        .portage-field-label { font-size: 0.78rem; font-weight: 700; color: var(--p-neutral-700); }
        .portage-input-container { position: relative; display: flex; align-items: center; }
        .portage-input-icon { position: absolute; left: 14px; color: var(--p-neutral-500); pointer-events: none; }
        .portage-custom-input { width: 100%; padding: 12px 14px; font-size: 0.88rem; font-family: inherit; color: var(--p-neutral-900); background: var(--p-neutral-50); border: 1px solid var(--p-neutral-300); border-radius: var(--p-radius-sm); outline: none; transition: var(--p-transition); }
        .portage-custom-input.has-icon { padding-left: 42px; }
        .portage-custom-input:focus { border-color: var(--p-green-600); background: var(--p-white); box-shadow: 0 0 0 4px rgba(79, 168, 120, 0.18); }
        .portage-dob-group { display: flex; gap: 12px; }
        .portage-age-display-box { width: 110px; flex-shrink: 0; }
        .portage-age-calculated { width: 100%; padding: 12px 8px; font-size: 0.86rem; font-weight: 700; text-align: center; color: var(--p-green-900); background: var(--p-green-100); border: 1px solid var(--p-green-200); border-radius: var(--p-radius-sm); cursor: not-allowed; }
        .portage-parents-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .portage-parent-box { background: var(--p-neutral-50); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-md); padding: 22px; display: flex; flex-direction: column; gap: 14px; transition: var(--p-transition); }
        .portage-parent-box:hover { border-color: var(--p-green-300); background: #FAFCFA; }
        .portage-parent-box-header { display: flex; align-items: center; gap: 10px; font-size: 0.95rem; font-weight: 800; color: var(--p-green-900); padding-bottom: 8px; border-bottom: 1px solid var(--p-neutral-200); }
        .portage-parent-icon { width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; }
        .portage-parent-mother .portage-parent-icon { background: #FDF3DC; color: #B68119; }
        .portage-parent-father .portage-parent-icon { background: #E2F4E9; color: #26533A; }
        .portage-btn-submit-patient { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 14px 24px; font-size: 0.98rem; font-weight: 800; color: var(--p-white); background: var(--p-green-700); border: none; border-radius: var(--p-radius-sm); cursor: pointer; box-shadow: 0 4px 16px rgba(49, 104, 73, 0.28); transition: var(--p-transition); margin-top: 10px; }
        .portage-btn-submit-patient:hover { background: var(--p-green-800); transform: translateY(-1px); box-shadow: 0 6px 22px rgba(49, 104, 73, 0.38); }
        .portage-patients-list-card { background: var(--p-white); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-lg); box-shadow: var(--p-shadow-sm); overflow: hidden; }
        .portage-empty-state { padding: 64px 24px; text-align: center; display: flex; flex-direction: column; align-items: center; }
        .portage-empty-icon-wrap { width: 64px; height: 64px; border-radius: var(--p-radius-md); background: var(--p-green-100); color: var(--p-green-800); display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
        .portage-empty-title { font-size: 1.15rem; font-weight: 800; color: var(--p-neutral-800); }
        .portage-empty-desc { font-size: 0.88rem; color: var(--p-neutral-600); margin-top: 6px; max-width: 440px; }
        .portage-patients-list { list-style: none; }
        .portage-patient-row { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--p-neutral-200); cursor: pointer; transition: var(--p-transition); }
        .portage-patient-row:last-child { border-bottom: none; }
        .portage-patient-row:hover { background: var(--p-green-50); }
        .portage-patient-left-cluster { display: flex; align-items: center; gap: 16px; }
        .portage-patient-avatar { width: 46px; height: 46px; border-radius: var(--p-radius-md); background: var(--p-green-100); border: 1px solid var(--p-green-200); color: var(--p-green-800); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1rem; flex-shrink: 0; transition: var(--p-transition); }
        .portage-patient-row:hover .portage-patient-avatar { transform: scale(1.06); background: var(--p-green-700); color: var(--p-white); }
        .portage-patient-name { font-size: 1.08rem; font-weight: 800; color: var(--p-neutral-900); letter-spacing: -0.015em; transition: var(--p-transition); }
        .portage-patient-row:hover .portage-patient-name { color: var(--p-green-900); }
        .portage-patient-meta-row { display: flex; align-items: center; gap: 8px; margin-top: 4px; font-size: 0.82rem; color: var(--p-neutral-600); flex-wrap: wrap; }
        .portage-patient-meta-pill { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; background: var(--p-neutral-100); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-full); font-size: 0.72rem; font-weight: 700; color: var(--p-neutral-700); }
        .portage-patient-row-action { display: flex; align-items: center; gap: 6px; font-size: 0.84rem; font-weight: 700; color: var(--p-green-700); opacity: 0.85; transition: var(--p-transition); }
        .portage-patient-row:hover .portage-patient-row-action { opacity: 1; color: var(--p-green-900); transform: translateX(3px); }
        @media (max-width: 860px) { .portage-fields-grid-2, .portage-parents-grid { grid-template-columns: 1fr; } }
        @media (max-width: 640px) {
          .portage-main-container { padding: 24px 16px 80px; }
          .portage-top-navbar-inner { padding: 12px 16px; }
          .portage-page-header { flex-direction: column; align-items: flex-start; gap: 16px; }
          .portage-btn-primary-action { width: 100%; justify-content: center; }
          .portage-form-card { padding: 24px 18px; }
          .portage-patient-row { padding: 16px; }
          .portage-patient-row-action span { display: none; }
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
            <span>Módulo Clínico Ativo</span>
          </div>
        </div>
      </header>

      <main className="portage-main-container">
        
        <div className="portage-page-header">
          <div>
            <button
              onClick={() => router.push('/dashboard')}
              className="portage-btn-back"
              aria-label="Voltar para a página inicial do Dashboard"
            >
              <ArrowLeft size={16} />
              <span>Voltar ao Início</span>
            </button>
            <h1 className="portage-page-title">Gestão de Pacientes</h1>
            <div className="portage-page-subtitle">
              <span>Prontuários e histórico de desenvolvimento infantil</span>
              <span className="portage-count-tag">
                {patients.length} {patients.length === 1 ? 'paciente' : 'pacientes'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className={`portage-btn-primary-action ${showForm ? 'cancel-mode' : ''}`}
          >
            {showForm ? (
              <>
                <X size={17} />
                <span>Cancelar Registo</span>
              </>
            ) : (
              <>
                <UserPlus size={17} />
                <span>+ Novo Paciente</span>
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="portage-alert-banner" role="alert">
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSavePatient} className="portage-form-card">
            
            <div className="portage-form-section">
              <h2 className="portage-form-section-title">
                <div className="portage-form-section-icon">
                  <Baby size={18} />
                </div>
                <span>Dados da Criança</span>
              </h2>

              <div className="portage-fields-grid-2">
                
                <div className="portage-field-group">
                  <label className="portage-field-label">Nome Completo</label>
                  <div className="portage-input-container">
                    <User size={16} className="portage-input-icon" />
                    <input
                      type="text"
                      name="full_name"
                      required
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="Ex: Gabriel Henrique Santos"
                      className="portage-custom-input has-icon"
                    />
                  </div>
                </div>

                <div className="portage-field-group">
                  <label className="portage-field-label">Data de Nascimento</label>
                  <div className="portage-dob-group">
                    <div className="portage-input-container" style={{ flex: 1 }}>
                      <Calendar size={16} className="portage-input-icon" />
                      <input
                        type="date"
                        name="birth_date"
                        required
                        value={formData.birth_date}
                        onChange={handleInputChange}
                        className="portage-custom-input has-icon"
                      />
                    </div>
                    <div className="portage-age-display-box">
                      <input
                        type="text"
                        disabled
                        value={formData.birth_date ? `${calculateAge(formData.birth_date)} anos` : 'Idade'}
                        className="portage-age-calculated"
                        title="Idade calculada automaticamente"
                      />
                    </div>
                  </div>
                </div>

                <div className="portage-field-group">
                  <label className="portage-field-label">Altura (cm)</label>
                  <div className="portage-input-container">
                    <Ruler size={16} className="portage-input-icon" />
                    <input
                      type="number"
                      step="0.01"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      placeholder="Ex: 110"
                      className="portage-custom-input has-icon"
                    />
                  </div>
                </div>

                <div className="portage-field-group">
                  <label className="portage-field-label">Peso (kg)</label>
                  <div className="portage-input-container">
                    <Weight size={16} className="portage-input-icon" />
                    <input
                      type="number"
                      step="0.1"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="Ex: 18.5"
                      className="portage-custom-input has-icon"
                    />
                  </div>
                </div>

              </div>
            </div>

            <div className="portage-form-section">
              <h2 className="portage-form-section-title">
                <div className="portage-form-section-icon">
                  <Heart size={18} />
                </div>
                <span>Responsáveis (Preencher pelo menos um)</span>
              </h2>

              <div className="portage-parents-grid">
                
                <div className="portage-parent-box portage-parent-mother">
                  <div className="portage-parent-box-header">
                    <div className="portage-parent-icon">👩</div>
                    <span>Dados da Mãe</span>
                  </div>
                  
                  <div className="portage-field-group">
                    <label className="portage-field-label">Nome Completo</label>
                    <input
                      type="text"
                      name="mother_name"
                      value={formData.mother_name}
                      onChange={handleInputChange}
                      placeholder="Nome da mãe"
                      className="portage-custom-input"
                    />
                  </div>

                  <div className="portage-field-group">
                    <label className="portage-field-label">E-mail</label>
                    <input
                      type="email"
                      name="mother_email"
                      value={formData.mother_email}
                      onChange={handleInputChange}
                      placeholder="email.mae@exemplo.com"
                      className="portage-custom-input"
                    />
                  </div>

                  <div className="portage-field-group">
                    <label className="portage-field-label">Telefone / WhatsApp</label>
                    <input
                      type="text"
                      name="mother_phone"
                      value={formData.mother_phone}
                      onChange={handleInputChange}
                      placeholder="(11) 98765-4321"
                      className="portage-custom-input"
                    />
                  </div>
                </div>

                <div className="portage-parent-box portage-parent-father">
                  <div className="portage-parent-box-header">
                    <div className="portage-parent-icon">👨</div>
                    <span>Dados do Pai</span>
                  </div>

                  <div className="portage-field-group">
                    <label className="portage-field-label">Nome Completo</label>
                    <input
                      type="text"
                      name="father_name"
                      value={formData.father_name}
                      onChange={handleInputChange}
                      placeholder="Nome do pai"
                      className="portage-custom-input"
                    />
                  </div>

                  <div className="portage-field-group">
                    <label className="portage-field-label">E-mail</label>
                    <input
                      type="email"
                      name="father_email"
                      value={formData.father_email}
                      onChange={handleInputChange}
                      placeholder="email.pai@exemplo.com"
                      className="portage-custom-input"
                    />
                  </div>

                  <div className="portage-field-group">
                    <label className="portage-field-label">Telefone / WhatsApp</label>
                    <input
                      type="text"
                      name="father_phone"
                      value={formData.father_phone}
                      onChange={handleInputChange}
                      placeholder="(11) 98765-4321"
                      className="portage-custom-input"
                    />
                  </div>
                </div>

              </div>
            </div>

            <button type="submit" className="portage-btn-submit-patient">
              <FileText size={18} />
              <span>Salvar Paciente e Iniciar Prontuário</span>
              <ArrowRight size={18} />
            </button>
          </form>
        )}

        {!showForm && (
          <div className="portage-patients-list-card">
            {patients.length === 0 ? (
              <div className="portage-empty-state">
                <div className="portage-empty-icon-wrap">
                  <Users size={32} />
                </div>
                <h3 className="portage-empty-title">Nenhum paciente registado</h3>
                <p className="portage-empty-desc">
                  Clique em "+ Novo Paciente" para iniciar o registo de prontuários clínicos e avaliações do desenvolvimento.
                </p>
              </div>
            ) : (
              <ul className="portage-patients-list">
                {patients.map((pat) => {
                  const patientAge = calculateAge(pat.birth_date);
                  const firstLetter = pat.full_name ? pat.full_name.charAt(0).toUpperCase() : 'P';
                  return (
                    <li
                      key={pat.id}
                      onClick={() => router.push(`/dashboard/patient/${pat.id}`)}
                      className="portage-patient-row"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && router.push(`/dashboard/patient/${pat.id}`)}
                    >
                      <div className="portage-patient-left-cluster">
                        <div className="portage-patient-avatar">
                          {firstLetter}
                        </div>
                        <div>
                          <h3 className="portage-patient-name">{pat.full_name}</h3>
                          <div className="portage-patient-meta-row">
                            <span className="portage-patient-meta-pill">
                              <Calendar size={11} /> {patientAge ? `${patientAge} anos` : 'Idade n/d'}
                            </span>
                            <span className="portage-patient-meta-pill">
                              <Heart size={11} /> Resp: {pat.mother_name || pat.father_name || 'Não informado'}
                            </span>
                            {pat.height && (
                              <span className="portage-patient-meta-pill">
                                {pat.height} cm
                              </span>
                            )}
                            {pat.weight && (
                              <span className="portage-patient-meta-pill">
                                {pat.weight} kg
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="portage-patient-row-action">
                        <span>Aceder Prontuário</span>
                        <ChevronRight size={18} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

      </main>
    </div>
  );
}