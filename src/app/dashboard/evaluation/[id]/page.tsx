'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../../lib/supabase'

export default function EvaluationPage() {
  const { id } = useParams() // Pega o ID do paciente na URL
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [patient, setPatient] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [message, setMessage] = useState('')

  // Nosso motor de respostas armazenará um objeto JSON dinâmico
  const [responses, setResponses] = useState<Record<string, boolean>>({})

  // Exemplo de estrutura do Portage (pode ser ampliada futuramente)
  const portageAreas = [
    {
      area: 'Socialização',
      items: [
        { id: 'soc_1', text: 'Observa uma pessoa movimentando-se no seu campo visual' },
        { id: 'soc_2', text: 'Sorri em resposta à atenção do adulto' },
      ]
    },
    {
      area: 'Linguagem',
      items: [
        { id: 'lin_1', text: 'Repete sons emitidos por outras pessoas' },
        { id: 'lin_2', text: 'Obedece a instruções simples (ex: "vem aqui")' },
      ]
    }
  ]

  useEffect(() => {
    const loadData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      setUser(session.user)

      // Busca os dados do paciente para mostrar no cabeçalho
      const { data: patientData } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .single()
        
      if (patientData) {
        setPatient(patientData)
      } else {
        setMessage('Paciente não encontrado ou sem permissão de acesso.')
      }
      setLoading(false)
    }
    loadData()
  }, [id, router])

  // Função para marcar/desmarcar um item
  const toggleResponse = (itemId: string) => {
    setResponses(prev => ({
      ...prev,
      [itemId]: !prev[itemId] // Inverte o valor (true/false)
    }))
  }

  // Função para salvar a avaliação
  const handleSave = async () => {
    setLoading(true)
    setMessage('')

    const { error } = await supabase.from('evaluations').insert({
      patient_id: id,
      professional_id: user.id,
      evaluation_date: new Date().toISOString().split('T')[0], // Data de hoje (YYYY-MM-DD)
      responses: responses, // O pulo do gato: salva o JSON inteiro na coluna
      notes: 'Avaliação inicial de teste'
    })

    if (error) {
      setMessage('Erro ao salvar: ' + error.message)
    } else {
      setMessage('Avaliação salva com sucesso!')
      setTimeout(() => router.push('/dashboard'), 2000) // Volta pro painel após 2s
    }
    setLoading(false)
  }

  if (loading) return <div className="p-8 text-gray-500">Carregando formulário de avaliação...</div>

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 border-b pb-4">
        <button onClick={() => router.push('/dashboard')} className="text-blue-600 hover:underline mb-2 block text-sm">
          &larr; Voltar ao Painel
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Avaliação Portage / IPO</h1>
        {patient && (
          <p className="text-gray-600 mt-2">
            Paciente: <strong className="text-gray-800">{patient.full_name}</strong>
          </p>
        )}
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded ${message.includes('Erro') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* Renderiza o questionário */}
      <div className="space-y-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        {portageAreas.map((area) => (
          <div key={area.area} className="mb-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-4 border-b pb-2">{area.area}</h2>
            <div className="space-y-3">
              {area.items.map((item) => (
                <label key={item.id} className="flex items-start gap-3 p-3 rounded hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-100 transition-all">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={responses[item.id] || false}
                    onChange={() => toggleResponse(item.id)}
                  />
                  <span className="text-gray-700">{item.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        
        <button
          onClick={handleSave}
          disabled={loading || !patient}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Finalizar e Salvar Avaliação'}
        </button>
      </div>
    </div>
  )
}