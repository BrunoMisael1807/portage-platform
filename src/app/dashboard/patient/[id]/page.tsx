'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../../lib/supabase'

export default function PatientHistoryPage() {
  const { id } = useParams()
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [patient, setPatient] = useState<any>(null)
  const [evaluations, setEvaluations] = useState<any[]>([])

  useEffect(() => {
    const loadPatientAndHistory = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      // Busca os dados do paciente
      const { data: patientData } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .single()
        
      if (patientData) {
        setPatient(patientData)
      }

      // Busca o histórico de avaliações, ordenado da mais recente para a mais antiga
      const { data: evalData } = await supabase
        .from('evaluations')
        .select('*')
        .eq('patient_id', id)
        .order('evaluation_date', { ascending: false })

      if (evalData) {
        setEvaluations(evalData)
      }
      
      setLoading(false)
    }
    
    loadPatientAndHistory()
  }, [id, router])

  // Função para calcular o intervalo em dias entre duas datas
  const calculateDaysInterval = (currentDate: string, previousDate: string) => {
    const current = new Date(currentDate)
    const previous = new Date(previousDate)
    const diffTime = Math.abs(current.getTime() - previous.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  if (loading) return <div className="p-8 text-gray-500">A carregar o histórico clínico...</div>

  if (!patient) return <div className="p-8 text-red-500">Paciente não encontrado.</div>

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8 border-b pb-4 flex justify-between items-end">
        <div>
          <button onClick={() => router.push('/dashboard')} className="text-blue-600 hover:underline mb-2 block text-sm">
            &larr; Voltar ao Painel
          </button>
          <h1 className="text-3xl font-bold text-gray-800">{patient.full_name}</h1>
          <p className="text-gray-600 mt-1">
            Data de Nascimento: {new Date(patient.date_of_birth).toLocaleDateString('pt-PT', { timeZone: 'UTC' })}
          </p>
        </div>
        <Link 
          href={`/dashboard/evaluation/${patient.id}`}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm transition-colors"
        >
          + Nova Avaliação
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Histórico de Avaliações Portage</h2>
        </div>
        
        <div className="p-6">
          {evaluations.length === 0 ? (
            <p className="text-gray-500 text-center py-8 bg-gray-50 rounded border border-dashed border-gray-300">
              Nenhuma avaliação registada para este paciente até ao momento.
            </p>
          ) : (
            <div className="space-y-4">
              {evaluations.map((evaluation, index) => {
                // A avaliação anterior na linha do tempo está no próximo índice do array (pois a ordem é decrescente)
                const previousEval = evaluations[index + 1]
                const daysSinceLast = previousEval 
                  ? calculateDaysInterval(evaluation.evaluation_date, previousEval.evaluation_date)
                  : null

                // Calcula o total de marcos atingidos (respostas 'true' no JSON)
                const totalAcertos = Object.values(evaluation.responses).filter(Boolean).length

                return (
                  <div key={evaluation.id} className="p-5 border border-gray-200 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 hover:border-blue-300 transition-colors">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-lg text-gray-800">
                          {new Date(evaluation.evaluation_date).toLocaleDateString('pt-PT', { timeZone: 'UTC' })}
                        </h3>
                        {daysSinceLast !== null && (
                          <span className="text-xs font-semibold px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                            Intervalo: {daysSinceLast} dias
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Marcos Atingidos: <strong className="text-green-600">{totalAcertos}</strong>
                      </p>
                    </div>
                    <button className="text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded">
                      Ver Detalhes
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}