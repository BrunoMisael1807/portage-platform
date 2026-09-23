'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../../lib/supabase'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function PatientHistoryPage() {
  const { id } = useParams()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [patient, setPatient] = useState<any>(null)
  const [evaluations, setEvaluations] = useState<any[]>([])
  const [team, setTeam] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  
  const [shareEmail, setShareEmail] = useState('')
  const [shareMessage, setShareMessage] = useState({ text: '', type: '' })
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return router.push('/login')
    setUser(session.user)

    const { data: pat } = await supabase.from('patients').select('*').eq('id', id).single()
    setPatient(pat)

    const { data: evals } = await supabase
      .from('evaluations')
      .select('*, profiles(full_name, council_type)')
      .eq('patient_id', id)
      .order('evaluation_date', { ascending: false })
    
    if (evals) {
      setEvaluations(evals)
      
      // PREPARAÇÃO DOS DADOS PARA O GRÁFICO (Da avaliação mais antiga para a mais recente)
      const dataForChart = evals.slice().reverse().map(ev => {
        let score = 0
        const responses = ev.responses || {}
        const totalRespondidos = Object.keys(responses).length

        // Aplica a mesma matemática do ecrã de avaliação para manter a consistência clínica
        Object.values(responses).forEach((val: any) => {
          if (val === 'S') score += 1
          if (val === 'AV') score += 0.5
        })

        // Calcula a percentagem de sucesso nesta avaliação específica
        const percentagem = totalRespondidos > 0 ? Math.round((score / totalRespondidos) * 100) : 0

        return {
          data: new Date(ev.evaluation_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          Evolucao: percentagem, // Valor Y do gráfico
          Itens: totalRespondidos
        }
      })
      setChartData(dataForChart)
    }

    const { data: shares } = await supabase.from('patient_shares').select('*').eq('patient_id', id)
    if (shares && shares.length > 0) {
      const profIds = shares.map(s => s.shared_with)
      const { data: profs } = await supabase.from('profiles').select('id, full_name, council_type, email').in('id', profIds)
      setTeam(profs || [])
    }
    setLoading(false)
  }

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault()
    setShareMessage({ text: 'A procurar colega...', type: 'info' })

    if (shareEmail === user.email) {
      setShareMessage({ text: 'Não necessita de partilhar o paciente consigo mesmo.', type: 'error' })
      return
    }

    const { data: colleague } = await supabase.from('profiles').select('id, full_name').eq('email', shareEmail).single()

    if (!colleague) {
      setShareMessage({ text: 'Profissional não encontrado. Verifique se o e-mail está registado na plataforma.', type: 'error' })
      return
    }

    const { error } = await supabase.from('patient_shares').insert({
      patient_id: id,
      shared_by: user.id,
      shared_with: colleague.id
    })

    if (error) {
      if (error.code === '23505') { 
        setShareMessage({ text: 'Este paciente já está partilhado com este profissional.', type: 'error' })
      } else {
        setShareMessage({ text: 'Erro ao partilhar: ' + error.message, type: 'error' })
      }
    } else {
      setShareMessage({ text: `Acesso concedido a ${colleague.full_name} com sucesso!`, type: 'success' })
      setShareEmail('') 
      loadData() 
    }
  }

  if (loading) return <div className="p-8 text-gray-500">A carregar registo do paciente...</div>
  if (!patient) return <div className="p-8 text-red-500">Paciente não encontrado ou sem permissão de acesso.</div>

  return (
    <div className="p-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-32">
      
      {/* COLUNA ESQUERDA: Dados, Gráfico e Histórico */}
      <div className="md:col-span-2 space-y-6">
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <button onClick={() => router.push('/dashboard/patients')} className="text-indigo-600 hover:underline mb-4 block text-sm font-semibold">&larr; Voltar à Lista</button>
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

        {/* GRÁFICO DE EVOLUÇÃO CLÍNICA */}
        {chartData.length > 1 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Evolução Clínica (% de Aquisição)</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="data" stroke="#8884d8" fontSize={12} />
                  <YAxis stroke="#8884d8" fontSize={12} domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, 'Aquisição']}
                    labelFormatter={(label) => `Data: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="Evolucao" 
                    name="Curva de Desenvolvimento" 
                    stroke="#4f46e5" 
                    strokeWidth={3} 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">O gráfico apresenta o domínio das competências avaliadas ao longo do tempo (S=1, AV=0.5, N=0).</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <h2 className="text-xl font-bold text-gray-800 bg-gray-50 p-4 border-b">Histórico de Aplicações</h2>
          
          <div className="p-4 space-y-4">
            {evaluations.length === 0 ? (
              <p className="text-gray-500 italic text-center py-4">Nenhuma avaliação registada para este paciente.</p>
            ) : (
              evaluations.map((evalRecord) => {
                let score = 0
                Object.values(evalRecord.responses || {}).forEach((val: any) => {
                  if (val === 'S') score += 1
                  if (val === 'AV') score += 0.5
                })

                return (
                  <div key={evalRecord.id} className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-lg text-indigo-900">
                        Avaliação de {new Date(evalRecord.evaluation_date).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full font-bold">
                        {score} pts / {Object.keys(evalRecord.responses || {}).length} itens
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Profissional:</strong> {evalRecord.profiles?.full_name} ({evalRecord.profiles?.council_type})
                    </p>
                    {evalRecord.notes && (
                      <p className="text-sm text-gray-500 bg-gray-100 p-2 rounded mt-2">{evalRecord.notes}</p>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* COLUNA DIREITA: Gestão da Equipa Multidisciplinar */}
      <div className="space-y-6">
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

          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Acesso Concedido a:</h3>
            {team.length === 0 ? (
              <p className="text-sm text-gray-400 italic">Apenas você tem acesso a este paciente.</p>
            ) : (
              <ul className="space-y-3">
                {team.map(member => (
                  <li key={member.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded border border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                      {member.full_name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-800">{member.full_name || 'Profissional Sem Nome'}</span>
                      <span className="text-xs text-gray-500">{member.council_type || 'Sem conselho'} • {member.email}</span>
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