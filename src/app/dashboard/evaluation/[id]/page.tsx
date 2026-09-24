'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';
// Importação dos dados REAIS do Portage que criámos no início do projeto
import { portageAreas } from '../../../../data/portage'; 
import {
  Stethoscope,
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Activity,
  Layers,
  Sparkles,
  User,
  Heart,
  Brain,
  MessageCircle,
  Footprints,
  SlidersHorizontal,
} from 'lucide-react';

export default function EvaluationPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState('');

  // ESTADO DAS RESPOSTAS REAIS
  const [responses, setResponses] = useState<Record<string, 'S' | 'AV' | 'N'>>({});
  const [selectedFaixa, setSelectedFaixa] = useState<number>(0); // Começamos no 0 (0-1 ano)

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id, router]);

  const loadData = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push('/login');
      return;
    }
    setUser(session.user);

    // Carrega o paciente real do Supabase
    const { data: patientData } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();
      
    if (patientData) {
      setPatient(patientData);
      // Opcional: auto-selecionar a faixa etária baseada na idade da criança
      const birthDate = new Date(patientData.birth_date);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      // Limita a idade máxima ao Portage (0 a 5 anos)
      setSelectedFaixa(Math.min(Math.max(age, 0), 5)); 
    }
    
    setLoading(false);
  };

  const handleResponse = (itemId: string, value: 'S' | 'AV' | 'N') => {
    setResponses((prev) => ({ ...prev, [itemId]: value }));
  };

  // ============================================================================
  // MOTOR CLÍNICO (S=1, AV=0.5, N=0) COM OS DADOS REAIS
  // ============================================================================
  const itemsInCurrentFaixa = portageAreas
    .flatMap((area: any) => area.items)
    .filter((item: any) => item.faixa_etaria === selectedFaixa);
    
  const totalItems = itemsInCurrentFaixa.length;

  let score = 0;
  let itensRespondidos = 0;

  itemsInCurrentFaixa.forEach((item: any) => {
    const resposta = responses[item.id];
    if (resposta) {
      itensRespondidos++;
      if (resposta === 'S') score += 1;
      else if (resposta === 'AV') score += 0.5;
    }
  });

  const percAcertos = totalItems > 0 ? Math.round((score / totalItems) * 100) : 0;
  const percErros = totalItems > 0 ? Math.round(((totalItems - score) / totalItems) * 100) : 0;

  let alertStatus = 'neutro';
  let alertMessage = 'Preencha os itens para calcular a linha de base e teto.';

  if (totalItems > 0) {
    if (percAcertos >= 75) {
      alertStatus = 'avanco';
      alertMessage = `Critério atingido (${percAcertos}% alcançado). Pode avançar para a faixa dos ${selectedFaixa + 1} anos.`;
    } else if (percErros >= 50 && itensRespondidos > 0) {
      alertStatus = 'recuo';
      alertMessage = `Atenção: ${percErros}% de não-aquisições. Recue para a faixa dos ${selectedFaixa === 0 ? 0 : selectedFaixa - 1} anos.`;
    } else if (itensRespondidos > 0) {
      alertStatus = 'neutro';
      alertMessage = `Em avaliação... (${percAcertos}% alcançado).`;
    }
  }

  // Lógica REAL: Guardar Avaliação no Supabase
  const handleSave = async () => {
    setLoading(true);
    
    // Filtra apenas as respostas que foram dadas
    const validResponses = Object.fromEntries(
      Object.entries(responses).filter(([_, v]) => v !== undefined)
    );

    if (Object.keys(validResponses).length === 0) {
      setMessage('Erro: Responda a pelo menos um item antes de guardar.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('evaluations').insert({
      patient_id: id,
      professional_id: user.id,
      evaluation_date: new Date().toISOString(),
      responses: validResponses,
      notes: `Avaliação na faixa dos ${selectedFaixa} a ${selectedFaixa + 1} anos. Score: ${score}/${totalItems} (${percAcertos}%).`,
    });

    if (!error) {
      setMessage('Avaliação salva com sucesso!');
      setTimeout(() => router.push(`/dashboard/patient/${id}`), 1500);
    } else {
      setMessage('Erro ao salvar: ' + error.message);
    }
    setLoading(false);
  };

  const renderAreaIcon = (areaName: string) => {
    switch (areaName) {
      case 'Socialização': return <Heart size={18} />;
      case 'Cognição': return <Brain size={18} />;
      case 'Linguagem': return <MessageCircle size={18} />;
      case 'Auto-cuidados': return <Sparkles size={18} />;
      case 'Desenvolvimento Motor': return <Footprints size={18} />;
      default: return <Layers size={18} />;
    }
  };

  if (loading) {
    return (
      <div className="portage-loading-wrapper">
        <style>{`
          .portage-loading-wrapper { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background-color: #F8FAF8; color: #2D3731; }
          .portage-loading-box { display: flex; align-items: center; justify-content: center; width: 58px; height: 58px; border-radius: 18px; background: #E2F4E9; border: 1px solid #BCE2CB; color: #26533A; box-shadow: 0 4px 16px rgba(38, 83, 58, 0.1); animation: portagePulse 1.8s ease-in-out infinite; }
          .portage-loading-title { margin-top: 18px; font-size: 0.98rem; font-weight: 700; color: #26533A; }
          .portage-loading-subtitle { margin-top: 4px; font-size: 0.78rem; color: #627268; }
          @keyframes portagePulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.06); opacity: 0.85; } }
        `}</style>
        <div className="portage-loading-box">
          <Activity size={26} />
        </div>
        <div className="portage-loading-title">A carregar o motor clínico...</div>
        <div className="portage-loading-subtitle">Portage Platform • Instrumento Padronizado</div>
      </div>
    );
  }

  return (
    <div className="portage-eval-root">
      <style>{`
        :root {
          --p-font: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          --p-green-950: #132A1C; --p-green-900: #1D3E2B; --p-green-800: #26533A;
          --p-green-700: #316849; --p-green-600: #3E825D; --p-green-500: #4FA878;
          --p-green-200: #BCE2CB; --p-green-100: #E2F4E9; --p-green-50:  #F2FAF5;
          --p-amber-700: #8C6212; --p-amber-600: #B68119; --p-amber-500: #D99B26;
          --p-amber-200: #F6DF9C; --p-amber-100: #FDF3DC; --p-amber-50:  #FFFBF2;
          --p-resp-s-bg: #26533A; --p-resp-s-hover: #1D3E2B; --p-resp-s-light: #E2F4E9;
          --p-resp-av-bg: #D99B26; --p-resp-av-hover: #B68119; --p-resp-av-light: #FDF3DC;
          --p-resp-n-bg: #C0392B; --p-resp-n-hover: #9E2B20; --p-resp-n-light: #FDF2F2;
          --p-neutral-900: #1C2420; --p-neutral-800: #2D3731; --p-neutral-700: #46534B;
          --p-neutral-600: #627268; --p-neutral-500: #83938A; --p-neutral-400: #A8B7AE;
          --p-neutral-300: #D2DDD6; --p-neutral-200: #E5EDE8; --p-neutral-100: #F3F7F4;
          --p-neutral-50:  #F8FAF8; --p-white: #FFFFFF;
          --p-shadow-sm: 0 1px 3px rgba(29, 62, 43, 0.05);
          --p-shadow-md: 0 6px 20px -3px rgba(29, 62, 43, 0.08);
          --p-shadow-lg: 0 16px 40px -8px rgba(29, 62, 43, 0.12);
          --p-shadow-float: 0 -4px 20px rgba(29, 62, 43, 0.08);
          --p-radius-sm: 10px; --p-radius-md: 16px; --p-radius-lg: 24px; --p-radius-full: 9999px;
          --p-transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .portage-eval-root { font-family: var(--p-font); color: var(--p-neutral-900); background-color: var(--p-neutral-50); min-height: 100vh; position: relative; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; line-height: 1.5; }
        .portage-eval-root * { box-sizing: border-box; margin: 0; padding: 0; }
        .portage-ambient-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; background: radial-gradient(circle at 12% 10%, rgba(253, 243, 220, 0.5) 0%, transparent 30%), radial-gradient(circle at 88% 12%, rgba(226, 244, 233, 0.65) 0%, transparent 32%), radial-gradient(circle at 50% 90%, rgba(242, 250, 245, 0.8) 0%, transparent 40%); }
        .portage-top-navbar { position: sticky; top: 0; z-index: 40; background: rgba(255, 255, 255, 0.94); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid var(--p-neutral-200); }
        .portage-top-navbar-inner { max-width: 1080px; margin: 0 auto; padding: 14px 28px; display: flex; align-items: center; justify-content: space-between; }
        .portage-top-brand { display: flex; align-items: center; gap: 12px; text-decoration: none; color: inherit; }
        .portage-top-brand-icon { display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: var(--p-radius-sm); background: var(--p-green-100); border: 1px solid var(--p-green-200); color: var(--p-green-800); }
        .portage-top-brand-title { font-size: 1.12rem; font-weight: 800; letter-spacing: -0.02em; color: var(--p-neutral-900); line-height: 1.2; }
        .portage-top-brand-title span { font-weight: 500; color: var(--p-neutral-600); }
        .portage-top-pill { display: inline-flex; align-items: center; gap: 7px; padding: 6px 14px; font-size: 0.78rem; font-weight: 700; color: var(--p-green-900); background: var(--p-neutral-100); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-full); }
        .portage-dot-status { width: 8px; height: 8px; border-radius: 50%; background: var(--p-green-500); box-shadow: 0 0 0 3px rgba(79, 168, 120, 0.25); }
        .portage-main-container { max-width: 1040px; margin: 0 auto; padding: 36px 24px 140px; position: relative; z-index: 1; }
        .portage-eval-header-card { background: var(--p-white); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-lg); padding: 26px 30px; margin-bottom: 24px; box-shadow: var(--p-shadow-md); display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; }
        .portage-btn-back { display: inline-flex; align-items: center; gap: 6px; background: transparent; border: none; color: var(--p-green-700); font-size: 0.86rem; font-weight: 700; cursor: pointer; margin-bottom: 8px; padding: 0; transition: var(--p-transition); }
        .portage-btn-back:hover { color: var(--p-green-900); transform: translateX(-3px); }
        .portage-eval-title-col h1 { font-size: 2rem; font-weight: 800; letter-spacing: -0.025em; color: var(--p-neutral-900); line-height: 1.2; }
        .portage-eval-patient-badge { display: inline-flex; align-items: center; gap: 8px; margin-top: 8px; font-size: 0.9rem; color: var(--p-neutral-600); background: var(--p-neutral-100); padding: 5px 12px; border-radius: var(--p-radius-full); border: 1px solid var(--p-neutral-200); }
        .portage-eval-patient-badge strong { color: var(--p-neutral-900); font-weight: 700; }
        .portage-faixa-selector-box { background: var(--p-neutral-50); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-md); padding: 12px 16px; min-width: 220px; box-shadow: var(--p-shadow-sm); }
        .portage-faixa-label { display: flex; align-items: center; gap: 6px; font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-neutral-500); margin-bottom: 6px; }
        .portage-faixa-select { width: 100%; font-family: var(--p-font); background: var(--p-white); border: 1.5px solid var(--p-neutral-300); border-radius: var(--p-radius-sm); padding: 8px 12px; font-size: 0.94rem; font-weight: 700; color: var(--p-neutral-900); outline: none; cursor: pointer; transition: var(--p-transition); }
        .portage-faixa-select:focus { border-color: var(--p-green-600); box-shadow: 0 0 0 3px rgba(62, 130, 93, 0.12); }
        .portage-feedback-banner { background: var(--p-green-50); border: 1px solid var(--p-green-200); color: var(--p-green-800); padding: 14px 20px; border-radius: var(--p-radius-md); font-weight: 700; font-size: 0.92rem; margin-bottom: 24px; display: flex; align-items: center; gap: 10px; box-shadow: var(--p-shadow-sm); }
        .portage-thermometer-box { position: sticky; top: 72px; z-index: 25; margin-bottom: 32px; padding: 20px 24px; border-radius: var(--p-radius-lg); border: 1.5px solid var(--p-neutral-200); background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); box-shadow: var(--p-shadow-lg); transition: var(--p-transition); }
        .portage-thermometer-box.avanco { background: linear-gradient(180deg, #F2FAF5 0%, #FFFFFF 100%); border-color: var(--p-green-200); }
        .portage-thermometer-box.recuo { background: linear-gradient(180deg, #FDF4F4 0%, #FFFFFF 100%); border-color: #F8B4B4; }
        .portage-thermometer-top-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px; }
        .portage-thermometer-title { font-size: 1.05rem; font-weight: 800; color: var(--p-neutral-900); display: flex; align-items: center; gap: 8px; }
        .portage-thermometer-score-badge { font-size: 0.82rem; font-weight: 800; color: var(--p-green-900); background: var(--p-green-100); border: 1px solid var(--p-green-200); padding: 5px 12px; border-radius: var(--p-radius-full); }
        .portage-thermometer-progress-track { width: 100%; background: var(--p-neutral-200); border-radius: var(--p-radius-full); height: 10px; overflow: hidden; margin-bottom: 12px; display: flex; }
        .portage-thermometer-progress-bar { background: linear-gradient(90deg, var(--p-green-600) 0%, var(--p-green-500) 100%); height: 100%; border-radius: var(--p-radius-full); transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .portage-thermometer-alert { font-size: 0.88rem; font-weight: 700; display: flex; align-items: center; gap: 8px; }
        .portage-thermometer-alert.avanco { color: var(--p-green-800); }
        .portage-thermometer-alert.recuo { color: #B91C1C; }
        .portage-thermometer-alert.neutro { color: var(--p-neutral-700); }
        .portage-areas-stack { display: flex; flex-direction: column; gap: 26px; }
        .portage-area-card { background: var(--p-white); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-lg); overflow: hidden; box-shadow: var(--p-shadow-sm); }
        .portage-area-header { background: #FAFCFA; border-bottom: 1px solid var(--p-neutral-200); padding: 18px 24px; display: flex; align-items: center; justify-content: space-between; }
        .portage-area-title-group { display: flex; align-items: center; gap: 12px; }
        .portage-area-icon-box { width: 36px; height: 36px; border-radius: var(--p-radius-sm); background: var(--p-green-100); border: 1px solid var(--p-green-200); color: var(--p-green-800); display: flex; align-items: center; justify-content: center; }
        .portage-area-title { font-size: 1.15rem; font-weight: 800; color: var(--p-neutral-900); }
        .portage-area-badge { font-size: 0.74rem; font-weight: 700; background: var(--p-neutral-100); color: var(--p-neutral-600); border: 1px solid var(--p-neutral-200); padding: 4px 10px; border-radius: var(--p-radius-full); }
        .portage-questions-list { padding: 22px; display: flex; flex-direction: column; gap: 18px; }
        .portage-question-item { background: var(--p-neutral-50); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-md); padding: 20px 22px; transition: var(--p-transition); }
        .portage-question-item:hover { background: var(--p-white); border-color: var(--p-neutral-300); box-shadow: var(--p-shadow-sm); }
        .portage-question-text { font-size: 1.02rem; font-weight: 600; color: var(--p-neutral-900); line-height: 1.5; margin-bottom: 8px; }
        .portage-question-num-tag { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 8px; background: var(--p-green-100); color: var(--p-green-800); font-weight: 800; font-size: 0.8rem; margin-right: 10px; vertical-align: middle; }
        .portage-question-criteria { font-size: 0.84rem; color: var(--p-neutral-600); background: var(--p-white); border-left: 3px solid var(--p-green-600); padding: 8px 12px; border-radius: 4px; margin-bottom: 16px; line-height: 1.5; }
        .portage-response-buttons-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .portage-btn-resp { flex: 1; min-width: 120px; padding: 11px 16px; border-radius: var(--p-radius-sm); font-family: var(--p-font); font-size: 0.88rem; font-weight: 700; cursor: pointer; border: 1.5px solid var(--p-neutral-300); background: var(--p-white); color: var(--p-neutral-700); display: inline-flex; align-items: center; justify-content: center; gap: 8px; transition: var(--p-transition); }
        .portage-btn-resp:hover { background: var(--p-neutral-100); border-color: var(--p-neutral-400); }
        .portage-btn-resp.active-s { background: var(--p-resp-s-bg); border-color: var(--p-resp-s-hover); color: var(--p-white); box-shadow: 0 4px 12px rgba(38, 83, 58, 0.25); }
        .portage-btn-resp.active-av { background: var(--p-resp-av-bg); border-color: var(--p-resp-av-hover); color: var(--p-neutral-900); box-shadow: 0 4px 12px rgba(217, 155, 38, 0.25); }
        .portage-btn-resp.active-n { background: var(--p-resp-n-bg); border-color: var(--p-resp-n-hover); color: var(--p-white); box-shadow: 0 4px 12px rgba(192, 57, 43, 0.25); }
        .portage-empty-area-msg { text-align: center; padding: 24px; color: var(--p-neutral-500); font-style: italic; font-size: 0.9rem; }
        .portage-bottom-save-bar { position: fixed; bottom: 0; left: 0; right: 0; z-index: 50; background: rgba(255, 255, 255, 0.94); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-top: 1px solid var(--p-neutral-200); padding: 16px 24px; box-shadow: var(--p-shadow-float); display: flex; justify-content: center; }
        .portage-btn-save-evaluation { width: 100%; max-width: 1040px; background: linear-gradient(135deg, var(--p-green-800) 0%, var(--p-green-700) 100%); color: var(--p-white); border: none; padding: 15px 28px; border-radius: var(--p-radius-md); font-size: 1.05rem; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 4px 16px rgba(38, 83, 58, 0.25); transition: var(--p-transition); }
        .portage-btn-save-evaluation:hover:not(:disabled) { background: linear-gradient(135deg, var(--p-green-900) 0%, var(--p-green-800) 100%); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(38, 83, 58, 0.35); }
        .portage-btn-save-evaluation:disabled { opacity: 0.55; cursor: not-allowed; }
        @media (max-width: 768px) {
          .portage-main-container { padding: 20px 16px 140px; }
          .portage-eval-header-card { padding: 20px; }
          .portage-eval-title-col h1 { font-size: 1.6rem; }
          .portage-faixa-selector-box { width: 100%; }
          .portage-thermometer-box { top: 60px; padding: 16px; }
          .portage-thermometer-title { font-size: 0.95rem; }
          .portage-response-buttons-row { flex-direction: column; }
          .portage-btn-resp { width: 100%; }
          .portage-btn-save-evaluation { padding: 14px 20px; font-size: 0.98rem; }
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
            <span>Motor Clínico Ativo</span>
          </div>
        </div>
      </header>

      <main className="portage-main-container">
        
        <div className="portage-eval-header-card">
          <div className="portage-eval-title-col">
            <button
              onClick={() => router.push(`/dashboard/patient/${id}`)}
              className="portage-btn-back"
              aria-label="Voltar para a página de histórico do paciente"
            >
              <ArrowLeft size={16} />
              <span>Voltar ao Histórico</span>
            </button>
            <h1>Inventário Portage</h1>
            {patient && (
              <div className="portage-eval-patient-badge">
                <User size={15} color="#3E825D" />
                <span>
                  Paciente: <strong>{patient.full_name}</strong>
                </span>
              </div>
            )}
          </div>

          <div className="portage-faixa-selector-box">
            <label className="portage-faixa-label">
              <SlidersHorizontal size={13} />
              <span>Idade Alvo (Anos)</span>
            </label>
            <select
              value={selectedFaixa}
              onChange={(e) => setSelectedFaixa(Number(e.target.value))}
              className="portage-faixa-select"
            >
              <option value={0}>0 a 1 ano</option>
              <option value={1}>1 a 2 anos</option>
              <option value={2}>2 a 3 anos</option>
              <option value={3}>3 a 4 anos</option>
              <option value={4}>4 a 5 anos</option>
              <option value={5}>5 a 6 anos</option>
            </select>
          </div>
        </div>

        {message && (
          <div className="portage-feedback-banner">
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{message}</span>
          </div>
        )}

        {/* TERMÔMETRO VISUAL CLÍNICO (STICKY) */}
        <div
          className={`portage-thermometer-box ${
            alertStatus === 'avanco'
              ? 'avanco'
              : alertStatus === 'recuo'
              ? 'recuo'
              : 'neutro'
          }`}
        >
          <div className="portage-thermometer-top-row">
            <h3 className="portage-thermometer-title">
              <Activity size={18} color="#26533A" />
              <span>Métricas da Faixa Etária ({selectedFaixa} a {selectedFaixa + 1} anos)</span>
            </h3>
            <span className="portage-thermometer-score-badge">
              {score} pontos / {totalItems} possíveis ({percAcertos}%)
            </span>
          </div>

          <div className="portage-thermometer-progress-track">
            <div
              className="portage-thermometer-progress-bar"
              style={{ width: `${percAcertos}%` }}
            />
          </div>

          <p
            className={`portage-thermometer-alert ${
              alertStatus === 'avanco'
                ? 'avanco'
                : alertStatus === 'recuo'
                ? 'recuo'
                : 'neutro'
            }`}
          >
            {alertStatus === 'avanco' && <CheckCircle2 size={16} />}
            {alertStatus === 'recuo' && <AlertTriangle size={16} />}
            {alertStatus === 'neutro' && <Clock size={16} />}
            <span>{alertMessage}</span>
          </p>
        </div>

        {/* ÁREAS E PERGUNTAS */}
        <div className="portage-areas-stack">
          {portageAreas.map((area: any) => {
            const itemsArea = area.items.filter(
              (item: any) => item.faixa_etaria === selectedFaixa
            );

            return (
              <div key={area.area} className="portage-area-card">
                <div className="portage-area-header">
                  <div className="portage-area-title-group">
                    <div className="portage-area-icon-box">
                      {renderAreaIcon(area.area)}
                    </div>
                    <h2 className="portage-area-title">Área: {area.area}</h2>
                  </div>
                  <span className="portage-area-badge">
                    {itemsArea.length} {itemsArea.length === 1 ? 'item' : 'itens'}
                  </span>
                </div>

                <div className="portage-questions-list">
                  {itemsArea.map((item: any) => (
                    <div key={item.id} className="portage-question-item">
                      <p className="portage-question-text">
                        <span className="portage-question-num-tag">
                          {item.numero}
                        </span>
                        {item.pergunta}
                      </p>

                      {item.criterio && (
                        <div className="portage-question-criteria">
                          <strong>Critério de Observação:</strong> {item.criterio}
                        </div>
                      )}

                      <div className="portage-response-buttons-row">
                        <button
                          type="button"
                          onClick={() => handleResponse(item.id, 'S')}
                          className={`portage-btn-resp ${
                            responses[item.id] === 'S' ? 'active-s' : ''
                          }`}
                        >
                          <CheckCircle2 size={16} />
                          <span>S (Sim • 1.0)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleResponse(item.id, 'AV')}
                          className={`portage-btn-resp ${
                            responses[item.id] === 'AV' ? 'active-av' : ''
                          }`}
                        >
                          <Clock size={16} />
                          <span>AV (Às Vezes • 0.5)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleResponse(item.id, 'N')}
                          className={`portage-btn-resp ${
                            responses[item.id] === 'N' ? 'active-n' : ''
                          }`}
                        >
                          <AlertTriangle size={16} />
                          <span>N (Não • 0.0)</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {itemsArea.length === 0 && (
                    <p className="portage-empty-area-msg">
                      Nenhum item registado para esta faixa etária nesta área.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </main>

      <footer className="portage-bottom-save-bar">
        <button
          onClick={handleSave}
          disabled={loading || !patient}
          className="portage-btn-save-evaluation"
        >
          <Save size={20} />
          <span>Guardar Avaliação e Voltar</span>
        </button>
      </footer>
    </div>
  );
}