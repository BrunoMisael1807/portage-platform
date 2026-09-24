'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Stethoscope,
  ArrowLeft,
  Calendar,
  Plus,
  TrendingUp,
  History,
  Users,
  UserPlus,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  Award,
} from 'lucide-react';

export default function PatientHistoryPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<any>(null);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  const [shareEmail, setShareEmail] = useState('');
  const [shareMessage, setShareMessage] = useState({ text: '', type: '' });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  // Lógica REAL: Carregamento do paciente, avaliações e equipa partilhada
  const loadData = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push('/login');
      return;
    }
    setUser(session.user);

    // 1. Busca os dados do paciente
    const { data: pat } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();
    
    setPatient(pat);

    // 2. Busca o histórico de avaliações (fazendo Join com o perfil do profissional)
    const { data: evals } = await supabase
      .from('evaluations')
      .select('*, profiles(full_name, council_type)')
      .eq('patient_id', id)
      .order('evaluation_date', { ascending: false });

    if (evals) {
      setEvaluations(evals);

      // PREPARAÇÃO DOS DADOS PARA O GRÁFICO (Da avaliação mais antiga para a mais recente)
      const dataForChart = evals
        .slice()
        .reverse()
        .map((ev: any) => {
          let score = 0;
          const responses = ev.responses || {};
          const totalRespondidos = Object.keys(responses).length;

          // Matemática Clínica (S=1, AV=0.5, N=0)
          Object.values(responses).forEach((val: any) => {
            if (val === 'S') score += 1;
            if (val === 'AV') score += 0.5;
          });

          const percentagem = totalRespondidos > 0 ? Math.round((score / totalRespondidos) * 100) : 0;

          return {
            data: new Date(ev.evaluation_date).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
            }),
            Evolucao: percentagem, // Valor Y do gráfico
            Itens: totalRespondidos,
          };
        });
      setChartData(dataForChart);
    }

    // 3. Busca a equipa multidisciplinar que tem acesso ao paciente
    const { data: shares } = await supabase
      .from('patient_shares')
      .select('*')
      .eq('patient_id', id);
      
    if (shares && shares.length > 0) {
      const profIds = shares.map((s: any) => s.shared_with);
      const { data: profs } = await supabase
        .from('profiles')
        .select('id, full_name, council_type, email')
        .in('id', profIds);
      setTeam(profs || []);
    }
    
    setLoading(false);
  };

  // Lógica REAL: Partilha do paciente em conformidade com a LGPD
  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    setShareMessage({ text: 'A procurar colega...', type: 'info' });

    if (shareEmail === user?.email) {
      setShareMessage({ text: 'Não necessita de partilhar o paciente consigo mesmo.', type: 'error' });
      return;
    }

    // Procura o colega pelo e-mail
    const { data: colleague } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('email', shareEmail)
      .single();

    if (!colleague) {
      setShareMessage({
        text: 'Profissional não encontrado. Verifique se o e-mail está registado na plataforma.',
        type: 'error',
      });
      return;
    }

    // Insere a permissão na tabela de partilhas
    const { error } = await supabase.from('patient_shares').insert({
      patient_id: id,
      shared_by: user.id,
      shared_with: colleague.id,
    });

    if (error) {
      if (error.code === '23505') {
        setShareMessage({ text: 'Este paciente já está partilhado com este profissional.', type: 'error' });
      } else {
        setShareMessage({ text: 'Erro ao partilhar: ' + error.message, type: 'error' });
      }
    } else {
      setShareMessage({ text: `Acesso concedido a ${colleague.full_name} com sucesso!`, type: 'success' });
      setShareEmail('');
      loadData(); // Recarrega a equipa instantaneamente
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
            font-size: 0.98rem;
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
          <History size={26} />
        </div>
        <div className="portage-loading-title">A carregar registo do paciente...</div>
        <div className="portage-loading-subtitle">Portage Platform • Prontuário Clínico Digital</div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="portage-not-found-wrapper">
        <style>{`
          .portage-not-found-wrapper { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background-color: #F8FAF8; padding: 24px; text-align: center; }
          .portage-not-found-card { background: #FFFFFF; border: 1px solid #E5EDE8; border-radius: 20px; padding: 36px 30px; max-width: 460px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
          .portage-not-found-icon { width: 52px; height: 52px; border-radius: 14px; background: #FDF3DC; color: #B68119; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
          .portage-not-found-title { font-size: 1.15rem; font-weight: 800; color: #1C2420; margin-bottom: 8px; }
          .portage-not-found-desc { font-size: 0.88rem; color: #627268; margin-bottom: 24px; line-height: 1.5; }
          .portage-not-found-btn { display: inline-flex; align-items: center; gap: 8px; background: #26533A; color: #FFFFFF; padding: 12px 20px; border-radius: 12px; font-size: 0.88rem; font-weight: 700; text-decoration: none; cursor: pointer; border: none; }
        `}</style>
        <div className="portage-not-found-card">
          <div className="portage-not-found-icon">
            <AlertCircle size={26} />
          </div>
          <h2 className="portage-not-found-title">Paciente Não Encontrado</h2>
          <p className="portage-not-found-desc">
            Paciente não encontrado ou você não possui permissão de acesso para visualizar este registo.
          </p>
          <button onClick={() => router.push('/dashboard/patients')} className="portage-not-found-btn">
            <ArrowLeft size={16} />
            <span>Voltar à Lista de Pacientes</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="portage-history-root">
      <style>{`
        :root {
          --p-font: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          --p-green-950: #132A1C; --p-green-900: #1D3E2B; --p-green-800: #26533A;
          --p-green-700: #316849; --p-green-600: #3E825D; --p-green-500: #4FA878;
          --p-green-200: #BCE2CB; --p-green-100: #E2F4E9; --p-green-50:  #F2FAF5;
          --p-amber-700: #8C6212; --p-amber-600: #B68119; --p-amber-500: #D99B26;
          --p-amber-200: #F6DF9C; --p-amber-100: #FDF3DC; --p-amber-50:  #FFFBF2;
          --p-indigo-800: #2D3E74; --p-indigo-600: #3D5A98; --p-indigo-100: #E9EEF9;
          --p-neutral-900: #1C2420; --p-neutral-800: #2D3731; --p-neutral-700: #46534B;
          --p-neutral-600: #627268; --p-neutral-500: #83938A; --p-neutral-400: #A8B7AE;
          --p-neutral-300: #D2DDD6; --p-neutral-200: #E5EDE8; --p-neutral-100: #F3F7F4;
          --p-neutral-50:  #F8FAF8; --p-white: #FFFFFF;
          --p-shadow-sm: 0 1px 3px rgba(29, 62, 43, 0.05);
          --p-shadow-md: 0 6px 20px -3px rgba(29, 62, 43, 0.08);
          --p-shadow-lg: 0 16px 40px -8px rgba(29, 62, 43, 0.12);
          --p-shadow-hover: 0 14px 34px -8px rgba(38, 83, 58, 0.16);
          --p-radius-sm: 10px; --p-radius-md: 16px; --p-radius-lg: 24px;
          --p-radius-xl: 32px; --p-radius-full: 9999px;
          --p-transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .portage-history-root { font-family: var(--p-font); color: var(--p-neutral-900); background-color: var(--p-neutral-50); min-height: 100vh; position: relative; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; line-height: 1.5; }
        .portage-history-root * { box-sizing: border-box; margin: 0; padding: 0; }
        .portage-ambient-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; background: radial-gradient(circle at 10% 8%, rgba(253, 243, 220, 0.55) 0%, transparent 30%), radial-gradient(circle at 90% 12%, rgba(226, 244, 233, 0.7) 0%, transparent 32%), radial-gradient(circle at 50% 90%, rgba(242, 250, 245, 0.8) 0%, transparent 42%); }
        .portage-top-navbar { position: sticky; top: 0; z-index: 40; background: rgba(255, 255, 255, 0.92); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid var(--p-neutral-200); }
        .portage-top-navbar-inner { max-width: 1200px; margin: 0 auto; padding: 14px 28px; display: flex; align-items: center; justify-content: space-between; }
        .portage-top-brand { display: flex; align-items: center; gap: 12px; text-decoration: none; color: inherit; }
        .portage-top-brand-icon { display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: var(--p-radius-sm); background: var(--p-green-100); border: 1px solid var(--p-green-200); color: var(--p-green-800); }
        .portage-top-brand-title { font-size: 1.12rem; font-weight: 800; letter-spacing: -0.02em; color: var(--p-neutral-900); line-height: 1.2; }
        .portage-top-brand-title span { font-weight: 500; color: var(--p-neutral-600); }
        .portage-top-pill { display: inline-flex; align-items: center; gap: 7px; padding: 6px 14px; font-size: 0.78rem; font-weight: 700; color: var(--p-green-900); background: var(--p-neutral-100); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-full); }
        .portage-dot-status { width: 8px; height: 8px; border-radius: 50%; background: var(--p-green-500); box-shadow: 0 0 0 3px rgba(79, 168, 120, 0.25); }
        .portage-main-container { max-width: 1200px; margin: 0 auto; padding: 36px 24px 120px; position: relative; z-index: 1; }
        .portage-history-layout { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); gap: 28px; align-items: start; }
        .portage-left-column { display: flex; flex-direction: column; gap: 24px; }
        .portage-patient-hero-card { background: var(--p-white); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-lg); padding: 28px 32px; box-shadow: var(--p-shadow-md); position: relative; overflow: hidden; }
        .portage-patient-hero-card::before { content: ''; position: absolute; top: 0; left: 0; bottom: 0; width: 5px; background: linear-gradient(180deg, var(--p-green-700) 0%, var(--p-green-500) 100%); }
        .portage-btn-back { display: inline-flex; align-items: center; gap: 6px; background: transparent; border: none; color: var(--p-green-700); font-size: 0.86rem; font-weight: 700; cursor: pointer; margin-bottom: 14px; padding: 0; transition: var(--p-transition); }
        .portage-btn-back:hover { color: var(--p-green-900); transform: translateX(-3px); }
        .portage-patient-hero-inner { display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; }
        .portage-patient-meta-col h1 { font-size: 1.85rem; font-weight: 800; letter-spacing: -0.025em; color: var(--p-neutral-900); line-height: 1.2; }
        .portage-patient-dob-tag { display: inline-flex; align-items: center; gap: 6px; margin-top: 8px; font-size: 0.88rem; font-weight: 600; color: var(--p-neutral-600); background: var(--p-neutral-100); padding: 5px 12px; border-radius: var(--p-radius-full); border: 1px solid var(--p-neutral-200); }
        .portage-btn-new-eval { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, var(--p-green-800) 0%, var(--p-green-700) 100%); color: var(--p-white); border: none; padding: 14px 24px; border-radius: var(--p-radius-md); font-size: 0.92rem; font-weight: 700; cursor: pointer; box-shadow: 0 4px 14px rgba(38, 83, 58, 0.22); transition: var(--p-transition); text-decoration: none; }
        .portage-btn-new-eval:hover { background: linear-gradient(135deg, var(--p-green-900) 0%, var(--p-green-800) 100%); transform: translateY(-2px); box-shadow: 0 8px 22px rgba(38, 83, 58, 0.3); }
        .portage-chart-card { background: var(--p-white); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-lg); padding: 28px; box-shadow: var(--p-shadow-md); }
        .portage-chart-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .portage-chart-title-row { display: flex; align-items: center; gap: 10px; }
        .portage-chart-icon-box { width: 36px; height: 36px; border-radius: var(--p-radius-sm); background: var(--p-green-100); border: 1px solid var(--p-green-200); color: var(--p-green-800); display: flex; align-items: center; justify-content: center; }
        .portage-chart-title { font-size: 1.25rem; font-weight: 800; color: var(--p-neutral-900); letter-spacing: -0.01em; }
        .portage-chart-tag { font-size: 0.74rem; font-weight: 700; color: var(--p-green-800); background: var(--p-green-100); padding: 4px 10px; border-radius: var(--p-radius-full); border: 1px solid var(--p-green-200); }
        .portage-chart-wrapper { height: 310px; width: 100%; margin: 0 auto; }
        .portage-chart-footer-note { font-size: 0.78rem; color: var(--p-neutral-500); text-align: center; margin-top: 18px; padding-top: 14px; border-top: 1px dashed var(--p-neutral-200); line-height: 1.4; }
        .portage-history-card { background: var(--p-white); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-lg); overflow: hidden; box-shadow: var(--p-shadow-md); }
        .portage-history-header-bar { background: #FAFCFA; border-bottom: 1px solid var(--p-neutral-200); padding: 18px 26px; display: flex; align-items: center; justify-content: space-between; }
        .portage-history-title-row { display: flex; align-items: center; gap: 10px; }
        .portage-history-icon-box { width: 34px; height: 34px; border-radius: var(--p-radius-sm); background: var(--p-neutral-100); border: 1px solid var(--p-neutral-200); color: var(--p-green-800); display: flex; align-items: center; justify-content: center; }
        .portage-history-title { font-size: 1.15rem; font-weight: 800; color: var(--p-neutral-900); }
        .portage-history-count-badge { font-size: 0.74rem; font-weight: 700; background: var(--p-neutral-100); color: var(--p-neutral-700); padding: 4px 10px; border-radius: var(--p-radius-full); border: 1px solid var(--p-neutral-200); }
        .portage-history-list { padding: 22px; display: flex; flex-direction: column; gap: 16px; }
        .portage-eval-card { background: var(--p-neutral-50); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-md); padding: 20px 22px; transition: var(--p-transition); }
        .portage-eval-card:hover { background: var(--p-white); border-color: var(--p-green-200); box-shadow: var(--p-shadow-sm); transform: translateY(-2px); }
        .portage-eval-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; gap: 12px; flex-wrap: wrap; }
        .portage-eval-date-box { display: flex; align-items: center; gap: 7px; font-size: 1.05rem; font-weight: 800; color: var(--p-green-950); }
        .portage-eval-score-pill { display: inline-flex; align-items: center; gap: 5px; font-size: 0.78rem; font-weight: 800; background: var(--p-green-100); color: var(--p-green-800); border: 1px solid var(--p-green-200); padding: 4px 12px; border-radius: var(--p-radius-full); }
        .portage-eval-pro-row { display: flex; align-items: center; gap: 6px; font-size: 0.86rem; color: var(--p-neutral-600); margin-bottom: 8px; }
        .portage-eval-pro-row strong { color: var(--p-neutral-800); }
        .portage-eval-notes-bubble { margin-top: 10px; padding: 12px 14px; background: var(--p-white); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-sm); font-size: 0.85rem; color: var(--p-neutral-700); line-height: 1.5; position: relative; }
        .portage-empty-evals { text-align: center; padding: 38px 20px; color: var(--p-neutral-500); font-style: italic; font-size: 0.9rem; }
        .portage-right-column { display: flex; flex-direction: column; gap: 24px; }
        .portage-team-card { background: var(--p-white); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-lg); padding: 26px 24px; box-shadow: var(--p-shadow-md); }
        .portage-team-header { display: flex; align-items: center; gap: 10px; padding-bottom: 14px; border-bottom: 1px solid var(--p-neutral-200); margin-bottom: 20px; }
        .portage-team-icon-box { width: 34px; height: 34px; border-radius: var(--p-radius-sm); background: var(--p-green-100); border: 1px solid var(--p-green-200); color: var(--p-green-800); display: flex; align-items: center; justify-content: center; }
        .portage-team-title { font-size: 1.15rem; font-weight: 800; color: var(--p-neutral-900); }
        .portage-share-form { margin-bottom: 28px; }
        .portage-share-label { display: flex; align-items: center; justify-content: space-between; font-size: 0.82rem; font-weight: 700; color: var(--p-neutral-800); margin-bottom: 8px; }
        .portage-share-label-tag { font-size: 0.7rem; font-weight: 700; color: var(--p-amber-700); background: var(--p-amber-50); border: 1px solid var(--p-amber-200); padding: 2px 7px; border-radius: var(--p-radius-full); }
        .portage-share-input-row { display: flex; gap: 8px; }
        .portage-share-input-box { position: relative; flex: 1; }
        .portage-share-leading-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--p-neutral-400); pointer-events: none; }
        .portage-share-input { width: 100%; font-family: var(--p-font); background: var(--p-neutral-50); border: 1.5px solid var(--p-neutral-200); border-radius: var(--p-radius-sm); padding: 10px 12px 10px 36px; font-size: 0.86rem; color: var(--p-neutral-900); outline: none; transition: var(--p-transition); }
        .portage-share-input:focus { border-color: var(--p-green-600); background: var(--p-white); box-shadow: 0 0 0 3px rgba(62, 130, 93, 0.12); }
        .portage-btn-share-submit { display: inline-flex; align-items: center; gap: 6px; background: var(--p-neutral-800); color: var(--p-white); border: none; padding: 10px 16px; border-radius: var(--p-radius-sm); font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: var(--p-transition); white-space: nowrap; }
        .portage-btn-share-submit:hover { background: var(--p-neutral-900); transform: translateY(-1px); }
        .portage-share-feedback { display: flex; align-items: center; gap: 6px; margin-top: 10px; padding: 8px 12px; border-radius: var(--p-radius-sm); font-size: 0.78rem; font-weight: 700; line-height: 1.4; }
        .portage-share-feedback.error { background: #FDF2F2; border: 1px solid #F8B4B4; color: #9B1C1C; }
        .portage-share-feedback.success { background: var(--p-green-50); border: 1px solid var(--p-green-200); color: var(--p-green-800); }
        .portage-share-feedback.info { background: #EFF6FF; border: 1px solid #BFDBFE; color: #1E40AF; }
        .portage-team-subtitle { font-size: 0.74rem; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; color: var(--p-neutral-500); margin-bottom: 12px; }
        .portage-team-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .portage-team-member-item { display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: var(--p-neutral-50); border: 1px solid var(--p-neutral-200); border-radius: var(--p-radius-sm); transition: var(--p-transition); }
        .portage-team-member-item:hover { background: var(--p-white); border-color: var(--p-neutral-300); }
        .portage-member-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--p-green-100); border: 1px solid var(--p-green-200); color: var(--p-green-800); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.88rem; flex-shrink: 0; }
        .portage-member-info { display: flex; flex-direction: column; min-width: 0; }
        .portage-member-name { font-size: 0.86rem; font-weight: 700; color: var(--p-neutral-900); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .portage-member-sub { font-size: 0.74rem; color: var(--p-neutral-500); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .portage-team-empty { font-size: 0.84rem; color: var(--p-neutral-400); font-style: italic; padding: 8px 0; }
        @media (max-width: 992px) { .portage-history-layout { grid-template-columns: 1fr; } .portage-main-container { padding: 24px 16px 80px; } }
        @media (max-width: 600px) {
          .portage-top-navbar-inner { padding: 12px 16px; }
          .portage-patient-hero-card { padding: 22px 18px; }
          .portage-patient-meta-col h1 { font-size: 1.5rem; }
          .portage-patient-hero-inner { flex-direction: column; align-items: stretch; }
          .portage-btn-new-eval { width: 100%; justify-content: center; }
          .portage-chart-card { padding: 20px 14px; }
          .portage-chart-wrapper { height: 250px; }
          .portage-share-input-row { flex-direction: column; }
          .portage-btn-share-submit { width: 100%; justify-content: center; }
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
            <span>Prontuário Multidisciplinar</span>
          </div>
        </div>
      </header>

      <main className="portage-main-container">
        <div className="portage-history-layout">
          
          {/* COLUNA ESQUERDA: Dados do Paciente, Gráfico e Histórico */}
          <div className="portage-left-column">
            
            <div className="portage-patient-hero-card">
              <button
                onClick={() => router.push('/dashboard/patients')}
                className="portage-btn-back"
                aria-label="Voltar para a lista de pacientes"
              >
                <ArrowLeft size={16} />
                <span>Voltar à Lista</span>
              </button>

              <div className="portage-patient-hero-inner">
                <div className="portage-patient-meta-col">
                  <h1>{patient.full_name}</h1>
                  <div className="portage-patient-dob-tag">
                    <Calendar size={15} color="#3E825D" />
                    <span>
                      Data de Nascimento: {new Date(patient.birth_date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => router.push(`/dashboard/evaluation/${patient.id}`)}
                  className="portage-btn-new-eval"
                >
                  <Plus size={18} strokeWidth={2.5} />
                  <span>Nova Avaliação Portage</span>
                </button>
              </div>
            </div>

            {/* GRÁFICO SÓ APARECE SE HOUVER MAIS DE 1 AVALIAÇÃO PARA TRAÇAR A CURVA */}
            {chartData.length > 1 && (
              <div className="portage-chart-card">
                <div className="portage-chart-header">
                  <div className="portage-chart-title-row">
                    <div className="portage-chart-icon-box">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <h2 className="portage-chart-title">Evolução Clínica (% de Aquisição)</h2>
                    </div>
                  </div>
                  <span className="portage-chart-tag">
                    {chartData[chartData.length - 1]?.Evolucao}% Atual
                  </span>
                </div>

                <div className="portage-chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 10, right: 20, bottom: 5, left: -10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5EDE8" />
                      <XAxis
                        dataKey="data"
                        stroke="#627268"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="#627268"
                        fontSize={12}
                        domain={[0, 100]}
                        tickFormatter={(tick) => `${tick}%`}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1D3E2B',
                          borderRadius: '12px',
                          border: 'none',
                          color: '#FFFFFF',
                          boxShadow: '0 10px 25px rgba(29, 62, 43, 0.25)',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                        itemStyle={{ color: '#E2F4E9' }}
                        formatter={(value: any) => [`${value}%`, 'Aquisição']}
                        labelFormatter={(label) => `Data da Aplicação: ${label}`}
                      />
                      <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                      <Line
                        type="monotone"
                        dataKey="Evolucao"
                        name="Curva de Desenvolvimento"
                        stroke="#26533A"
                        strokeWidth={3.5}
                        activeDot={{ r: 7, fill: '#3E825D', stroke: '#FFFFFF', strokeWidth: 2 }}
                        dot={{ r: 5, fill: '#26533A', stroke: '#FFFFFF', strokeWidth: 1.5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <p className="portage-chart-footer-note">
                  O gráfico apresenta o domínio das competências avaliadas ao longo do tempo (S=1, AV=0.5, N=0).
                </p>
              </div>
            )}

            <div className="portage-history-card">
              <div className="portage-history-header-bar">
                <div className="portage-history-title-row">
                  <div className="portage-history-icon-box">
                    <FileText size={18} />
                  </div>
                  <h2 className="portage-history-title">Histórico de Aplicações</h2>
                </div>
                <span className="portage-history-count-badge">
                  {evaluations.length} {evaluations.length === 1 ? 'registo' : 'registos'}
                </span>
              </div>

              <div className="portage-history-list">
                {evaluations.length === 0 ? (
                  <p className="portage-empty-evals">
                    Nenhuma avaliação registada para este paciente.
                  </p>
                ) : (
                  evaluations.map((evalRecord) => {
                    let score = 0;
                    Object.values(evalRecord.responses || {}).forEach((val: any) => {
                      if (val === 'S') score += 1;
                      if (val === 'AV') score += 0.5;
                    });

                    return (
                      <div key={evalRecord.id} className="portage-eval-card">
                        <div className="portage-eval-card-header">
                          <div className="portage-eval-date-box">
                            <Clock size={16} color="#26533A" />
                            <span>
                              Avaliação de {new Date(evalRecord.evaluation_date).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <span className="portage-eval-score-pill">
                            <Award size={13} />
                            {score} pts / {Object.keys(evalRecord.responses || {}).length} itens
                          </span>
                        </div>

                        <p className="portage-eval-pro-row">
                          <strong>Profissional:</strong>{' '}
                          {evalRecord.profiles?.full_name} ({evalRecord.profiles?.council_type})
                        </p>

                        {evalRecord.notes && (
                          <div className="portage-eval-notes-bubble">
                            {evalRecord.notes}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

          {/* COLUNA DIREITA: Gestão da Equipa Multidisciplinar */}
          <div className="portage-right-column">
            <div className="portage-team-card">
              <div className="portage-team-header">
                <div className="portage-team-icon-box">
                  <Users size={18} />
                </div>
                <h2 className="portage-team-title">Equipa Multidisciplinar</h2>
              </div>

              <form onSubmit={handleShare} className="portage-share-form">
                <label className="portage-share-label">
                  <span>Convidar Colega</span>
                  <span className="portage-share-label-tag">LGPD Conforme</span>
                </label>

                <div className="portage-share-input-row">
                  <div className="portage-share-input-box">
                    <Mail size={15} className="portage-share-leading-icon" />
                    <input
                      type="email"
                      value={shareEmail}
                      onChange={(e) => setShareEmail(e.target.value)}
                      placeholder="email@clinica.com"
                      required
                      className="portage-share-input"
                    />
                  </div>

                  <button type="submit" className="portage-btn-share-submit">
                    <UserPlus size={15} />
                    <span>Partilhar</span>
                  </button>
                </div>

                {shareMessage.text && (
                  <div
                    className={`portage-share-feedback ${
                      shareMessage.type === 'error'
                        ? 'error'
                        : shareMessage.type === 'success'
                        ? 'success'
                        : 'info'
                    }`}
                  >
                    {shareMessage.type === 'error' ? (
                      <AlertCircle size={14} style={{ flexShrink: 0 }} />
                    ) : (
                      <CheckCircle2 size={14} style={{ flexShrink: 0 }} />
                    )}
                    <span>{shareMessage.text}</span>
                  </div>
                )}
              </form>

              <div>
                <h3 className="portage-team-subtitle">Acesso Concedido a:</h3>
                {team.length === 0 ? (
                  <p className="portage-team-empty">
                    Apenas você tem acesso a este paciente.
                  </p>
                ) : (
                  <ul className="portage-team-list">
                    {team.map((member) => (
                      <li key={member.id} className="portage-team-member-item">
                        <div className="portage-member-avatar">
                          {member.full_name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className="portage-member-info">
                          <span className="portage-member-name">
                            {member.full_name || 'Profissional Sem Nome'}
                          </span>
                          <span className="portage-member-sub">
                            {member.council_type || 'Sem conselho'} • {member.email}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}