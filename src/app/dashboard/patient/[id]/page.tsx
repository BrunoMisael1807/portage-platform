'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../../lib/supabase'

export default function PatientHistoryPage() {
  const { id } = useParams()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [patient, setPatient] = useState<any>(null)
  const [evaluations, setEvaluations] = useState<any[]>([])
  const [team, setTeam] = useState<any[]>([])
  
  // Estados para o formulário de convite
  const [shareEmail, setShareEmail] = useState('')
  const [shareMessage, setShareMessage] = useState({ text: '', type: '' })
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    loadData()
  }, [id])

  // 1. CARREGAMENTO CENTRALIZADO DE DADOS
  const loadData = async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return router.push('/login')
    setUser(session.user)

    // A. Busca os dados demográficos do paciente
    const { data: pat } = await supabase.from('patients').select('*').eq('id', id).single()
    setPatient(pat)

    // B. Busca o histórico de avaliações (incluindo o nome do profissional que as fez)
    const { data: evals } = await supabase
      .from('evaluations')
      .select('*, profiles(full_name, council_type)')
      .eq('patient_id', id)
      .order('evaluation_date', { ascending: false })
    
    if (evals) setEvaluations(evals)

    // C. Busca a equipa multidisciplinar que tem acesso a este paciente
    const { data: shares } = await supabase.from('patient_shares').select('*').eq('patient_id', id)
    if (shares && shares.length > 0) {
      const profIds = shares.map(s => s.shared_with)
      // Vai buscar os nomes e conselhos dos colegas convidados
      const { data: profs } = await supabase.from('profiles').select('id, full_name, council_type, email').in('id', profIds)
      setTeam(profs || [])
    }
    setLoading(false)
  }

  // 2. LÓGICA DE CONVITE CLÍNICO (PARTILHA)
  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault()
    setShareMessage({ text: 'A procurar colega...', type: 'info' })

    if (shareEmail === user.email) {
      setShareMessage({ text: 'Não necessita de partilhar o paciente consigo mesmo.', type: 'error' })
      return
    }

    // Procura o perfil do colega pelo e-mail inserido
    const { data: colleague } = await supabase.from('profiles').select('id, full_name').eq('email', shareEmail).single()

    if (!colleague) {
      setShareMessage({ text: 'Profissional não encontrado. Verifique se o e-mail está registado na plataforma.', type: 'error' })
      return
    }

    // Regista o convite cruzando o ID do paciente, quem partilhou e quem recebeu
    const { error } = await supabase.from('patient_shares').insert({
      patient_id: id,
      shared_by: user.id,
      shared_with: colleague.id
    })

    if (error) {
      if (error.code === '23505') { // Erro 23505 no Postgres significa violação de UNIQUE (já existe)
        setShareMessage({ text: 'Este paciente já está partilhado com este profissional.', type: 'error' })
      } else {
        setShareMessage({ text: 'Erro ao partilhar: ' + error.message, type: 'error' })
      }
    } else {
      setShareMessage({ text: `Acesso concedido a ${colleague.full_name} com sucesso!`, type: 'success' })
      setShareEmail('') // Limpa o campo
      loadData() // Recarrega a página para o colega aparecer na lista da equipa
    }
  }

  if (loading) return <div className="p-8 text-gray-500">A carregar registo do paciente...</div>
  if (!patient) return <div className="p-8 text-red-500">Paciente não encontrado ou sem permissão de acesso.</div>

  return (
    <div className="p-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* COLUNA ESQUERDA: Dados e Histórico */}
      <div className="md:col-span-2 space-y-6">
        
        {/* CABEÇALHO DO PACIENTE */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <button onClick={() => router.push('/dashboard')} className="text-indigo-600 hover:underline mb-4 block text-sm font-semibold">&larr; Voltar à Lista</button>
              <h1 className="text-3xl font-bold text-gray-800">{patient.full_name}</h1>
              <p className="text-gray-500 mt-2">Data de Nascimento: {new Date(patient.birth_date).toLocaleDateString('pt-BR')}</p>
            </div>
            <button 
              onClick={() => router.push(`/dashboard/evaluation/${patient.id}`)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-sm"
            >
              + Nova Avaliação Portage
            </button>
          </div>
        </div>

        {/* HISTÓRICO DE AVALIAÇÕES */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <h2 className="text-xl font-bold text-gray-800 bg-gray-50 p-4 border-b">Histórico de Aplicações</h2>
          
          <div className="p-4 space-y-4">
            {evaluations.length === 0 ? (
              <p className="text-gray-500 italic text-center py-4">Nenhuma avaliação registada para este paciente.</p>
            ) : (
              evaluations.map((evalRecord) => (
                <div key={evalRecord.id} className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-lg text-indigo-900">
                      Avaliação de {new Date(evalRecord.evaluation_date).toLocaleDateString('pt-BR')}
                    </span>
                    {/* Calcula a quantidade de perguntas respondidas lendo as chaves do JSON */}
                    <span className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full font-bold">
                      {Object.keys(evalRecord.responses || {}).length} itens pontuados
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Profissional:</strong> {evalRecord.profiles?.full_name} ({evalRecord.profiles?.council_type})
                  </p>
                  {evalRecord.notes && (
                    <p className="text-sm text-gray-500 bg-gray-100 p-2 rounded mt-2">{evalRecord.notes}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* COLUNA DIREITA: Gestão da Equipa Multidisciplinar */}
      <div className="space-y-6">
        
        {/* PAINEL DE CONVITE */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Equipa Multidisciplinar</h2>
          
          <form onSubmit={handleShare} className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">Convidar Colega (LGPD)</label>
            <div className="flex gap-2">
              <input 
                type="email" 
                value={shareEmail} 
                onChange={(e) => setShareEmail(e.target.value)} 
                placeholder="email@clinica.com" 
                required 
                className="flex-1 bg-gray-50 border border-gray-300 rounded p-2 text-sm"
              />
              <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded text-sm font-bold hover:bg-gray-700">
                Partilhar
              </button>
            </div>
            
            {shareMessage.text && (
              <p className={`mt-2 text-xs font-bold ${shareMessage.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                {shareMessage.text}
              </p>
            )}
          </form>

          {/* LISTA DE PROFISSIONAIS COM ACESSO */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Acesso Concedido a:</h3>
            {team.length === 0 ? (
              <p className="text-sm text-gray-400 italic">Apenas você tem acesso a este paciente.</p>
            ) : (
              <ul className="space-y-3">
                {team.map(member => (
                  <li key={member.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded border border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                      {member.full_name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-800">{member.full_name}</span>
                      <span className="text-xs text-gray-500">{member.council_type} • {member.email}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}