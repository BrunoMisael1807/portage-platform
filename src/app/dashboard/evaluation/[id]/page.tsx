'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../../lib/supabase'

// IMPORTAÇÃO DOS DADOS DO EXCEL
import { portageAreas } from '../../../../data/portage'

export default function EvaluationPage() {
  const { id } = useParams()
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [patient, setPatient] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [message, setMessage] = useState('')
  
  // 1. ATUALIZAÇÃO DO ESTADO DE RESPOSTAS
  // Em vez de guardar verdadeiro/falso, agora guardamos 'S', 'AV' ou 'N' para cada pergunta
  const [responses, setResponses] = useState<Record<string, 'S' | 'AV' | 'N'>>({})
  const [selectedFaixa, setSelectedFaixa] = useState<number>(5)

  useEffect(() => {
    const loadData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return router.push('/login')
      setUser(session.user)

      const { data: patientData } = await supabase.from('patients').select('*').eq('id', id).single()
      if (patientData) setPatient(patientData)
      setLoading(false)
    }
    loadData()
  }, [id, router])

  // 2. NOVA FUNÇÃO DE RESPOSTA
  // Regista a escolha exata do profissional (S, AV ou N)
  const handleResponse = (itemId: string, value: 'S' | 'AV' | 'N') => {
    setResponses(prev => ({ ...prev, [itemId]: value }))
  }

  // ============================================================================
  // 3. MOTOR CLÍNICO ATUALIZADO (S=1, AV=0.5, N=0)
  // ============================================================================
  const itemsInCurrentFaixa = portageAreas.flatMap((area: any) => area.items).filter((item: any) => item.faixa_etaria === selectedFaixa)
  const totalItems = itemsInCurrentFaixa.length
  
  // Calcula a pontuação somando 1 ponto para S e 0.5 para AV
  let score = 0
  let itensRespondidos = 0

  itemsInCurrentFaixa.forEach((item: any) => {
    const resposta = responses[item.id]
    if (resposta) {
      itensRespondidos++
      if (resposta === 'S') score += 1
      else if (resposta === 'AV') score += 0.5
      // 'N' soma 0, portanto não precisa de condição
    }
  })

  // Calcula a percentagem de aquisição (acertos) e não-aquisição (erros) baseada nos pontos
  const percAcertos = totalItems > 0 ? Math.round((score / totalItems) * 100) : 0
  // A percentagem de erros é o restante da pontuação possível que não foi atingida
  const percErros = totalItems > 0 ? Math.round(((totalItems - score) / totalItems) * 100) : 0

  let alertStatus = 'neutro' 
  let alertMessage = 'Preencha os itens para calcular a linha de base e teto.'

  if (totalItems > 0) {
    if (percAcertos >= 75) {
      alertStatus = 'avanco'
      alertMessage = `Critério atingido (${percAcertos}% alcançado). Pode avançar para a faixa dos ${selectedFaixa + 1} anos.`
    } else if (percErros >= 50 && itensRespondidos > 0) { 
      alertStatus = 'recuo'
      alertMessage = `Atenção: ${percErros}% de não-aquisições/falhas. Recue para a faixa dos ${selectedFaixa - 1} anos para a linha de base.`
    } else if (itensRespondidos > 0) {
      alertStatus = 'neutro'
      alertMessage = `Em avaliação... (${percAcertos}% alcançado).`
    }
  }

  const handleSave = async () => {
    setLoading(true)
    const { error } = await supabase.from('evaluations').insert({
      patient_id: id, 
      professional_id: user.id, 
      evaluation_date: new Date().toISOString().split('T')[0], 
      responses: responses, 
      notes: `Avaliação na faixa dos ${selectedFaixa} anos. (S=1, AV=0.5, N=0)`
    })

    if (!error) {
      setMessage('Avaliação salva com sucesso!')
      setTimeout(() => router.push(`/dashboard/patient/${id}`), 2000)
    } else {
      setMessage('Erro ao salvar: ' + error.message)
    }
    setLoading(false)
  }

  if (loading) return <div className="p-8 text-gray-500">A carregar o motor clínico...</div>

  return (
    <div className="p-8 max-w-5xl mx-auto pb-32">
      
      <div className="mb-6 border-b pb-4 flex justify-between items-end">
        <div>
          <button onClick={() => router.push(`/dashboard/patient/${id}`)} className="text-indigo-600 hover:underline mb-2 block text-sm font-semibold">
            &larr; Voltar ao Histórico
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Inventário Portage</h1>
          {patient && <p className="text-gray-600 mt-1">Paciente: <strong className="text-gray-800">{patient.full_name}</strong></p>}
        </div>
        
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Idade Alvo (Anos)</label>
          <select 
            value={selectedFaixa} 
            onChange={(e) => setSelectedFaixa(Number(e.target.value))}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded focus:ring-indigo-500 focus:border-indigo-500 block p-2 font-semibold"
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

      {message && <div className="mb-6 p-4 rounded bg-green-50 text-green-700 font-semibold border border-green-200">{message}</div>}

      {/* TERMÓMETRO VISUAL */}
      <div className={`sticky top-4 z-10 mb-8 p-5 rounded-xl shadow-md border transition-all duration-300 ${
        alertStatus === 'avanco' ? 'bg-green-50 border-green-300' : 
        alertStatus === 'recuo' ? 'bg-red-50 border-red-300' : 
        'bg-white border-gray-200'
      }`}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-gray-800">Métricas da Faixa Etária ({selectedFaixa} anos)</h3>
          <span className="text-sm font-semibold text-gray-500">
            {score} pontos / {totalItems} possíveis
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden flex">
          <div className="bg-green-500 h-3 transition-all duration-500" style={{ width: `${percAcertos}%` }}></div>
        </div>
        
        <p className={`text-sm font-bold flex items-center gap-2 ${
          alertStatus === 'avanco' ? 'text-green-700' : alertStatus === 'recuo' ? 'text-red-700' : 'text-gray-600'
        }`}>
          {alertStatus === 'avanco' && '✅ '}
          {alertStatus === 'recuo' && '⚠️ '}
          {alertMessage}
        </p>
      </div>

      {/* ÁREAS E PERGUNTAS */}
      <div className="space-y-6">
        {portageAreas.map((area: any) => (
          <div key={area.area} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <h2 className="text-lg font-bold text-indigo-900 bg-indigo-50 p-4 border-b border-indigo-100">
              Área: {area.area}
            </h2>
            <div className="p-4 space-y-4">
              
              {area.items.filter((item: any) => item.faixa_etaria === selectedFaixa).map((item: any) => (
                <div key={item.id} className="p-4 rounded-lg border border-gray-200 hover:border-indigo-300 transition-all bg-gray-50">
                  <div className="flex flex-col">
                    <span className="text-gray-800 font-medium text-lg mb-2">
                      <span className="text-indigo-400 font-bold mr-2">{item.numero}.</span> 
                      {item.pergunta}
                    </span>
                    {item.criterio && (
                      <span className="text-sm text-gray-600 mb-4 bg-white p-2 rounded border-l-2 border-indigo-300">
                        {item.criterio}
                      </span>
                    )}
                    
                    {/* 4. NOVOS BOTÕES DE RESPOSTA CLÍNICA */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button
                        onClick={() => handleResponse(item.id, 'S')}
                        className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-colors border ${
                          responses[item.id] === 'S' ? 'bg-green-500 text-white border-green-600 shadow-inner' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        S (Sim)
                      </button>
                      <button
                        onClick={() => handleResponse(item.id, 'AV')}
                        className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-colors border ${
                          responses[item.id] === 'AV' ? 'bg-yellow-400 text-gray-900 border-yellow-500 shadow-inner' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        AV (Às Vezes)
                      </button>
                      <button
                        onClick={() => handleResponse(item.id, 'N')}
                        className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-colors border ${
                          responses[item.id] === 'N' ? 'bg-red-500 text-white border-red-600 shadow-inner' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        N (Não)
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {area.items.filter((item: any) => item.faixa_etaria === selectedFaixa).length === 0 && (
                <p className="text-gray-500 italic p-4 text-center">Nenhum item registado para esta faixa etária nesta área.</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex justify-center">
        <button 
          onClick={handleSave} 
          disabled={loading || !patient} 
          className="w-full max-w-5xl bg-indigo-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          Guardar Avaliação e Voltar
        </button>
      </div>
    </div>
  )
}