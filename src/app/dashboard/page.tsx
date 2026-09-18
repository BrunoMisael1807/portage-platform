'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

// Define a estrutura de dados do paciente
type Patient = {
  id: string
  full_name: string
  date_of_birth: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  
  // Estados do formulário e da lista
  const [patients, setPatients] = useState<Patient[]>([])
  const [patientName, setPatientName] = useState('')
  const [patientDob, setPatientDob] = useState('')
  const [formMessage, setFormMessage] = useState('')

  useEffect(() => {
    // Verifica a sessão e carrega os pacientes
    const checkAuthAndLoadData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
        await loadPatients()
        setLoading(false)
      }
    }
    
    checkAuthAndLoadData()
  }, [router])

  // Função para buscar pacientes restritos pela LGPD (RLS no Supabase)
  const loadPatients = async () => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false })
      
    if (data) setPatients(data)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormMessage('')
    
    if (!user) return

    // 1. Truque de segurança: Garante que o perfil do profissional existe no banco
    // antes de vincular um paciente, evitando erros de chave estrangeira (Foreign Key).
    await supabase.from('profiles').upsert({
      id: user.id,
      full_name: user.email?.split('@')[0] || 'Profissional',
      role: 'professional'
    })

    // 2. Insere o paciente com o ID do profissional (Gatilho da LGPD)
    const { error } = await supabase.from('patients').insert({
      professional_id: user.id,
      full_name: patientName,
      date_of_birth: patientDob
    })

    if (error) {
      setFormMessage('Erro ao cadastrar: ' + error.message)
    } else {
      setFormMessage('Paciente cadastrado com sucesso!')
      setPatientName('')
      setPatientDob('')
      // Atualiza a lista na tela imediatamente
      await loadPatients()
    }
  }

  if (loading) {
    return <div className="p-8 text-gray-500">Verificando credenciais e carregando dados seguros...</div>
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Portage Platform - Painel Clínico</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.email}</span>
          <button 
            onClick={handleLogout}
            className="bg-red-50 text-red-700 px-4 py-2 rounded text-sm font-semibold hover:bg-red-100"
          >
            Sair
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LADO ESQUERDO: Formulário de Cadastro */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg border border-gray-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Novo Paciente</h2>
          <form onSubmit={handleAddPatient} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Ex: João da Silva"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
              <input
                type="date"
                required
                value={patientDob}
                onChange={(e) => setPatientDob(e.target.value)}
                className="w-full rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            
            {formMessage && (
              <div className={`p-3 text-sm rounded ${formMessage.includes('Erro') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                {formMessage}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 rounded text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Cadastrar Paciente
            </button>
          </form>
        </div>

        {/* LADO DIREITO: Lista de Pacientes */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Meus Pacientes</h2>
          
          {patients.length === 0 ? (
            <p className="text-gray-500 text-sm p-4 bg-gray-50 rounded border border-dashed border-gray-300 text-center">
              Nenhum paciente cadastrado ainda. Utilize o formulário ao lado para começar.
            </p>
          ) : (
            <div className="space-y-3">
              {patients.map((patient) => (
                <div key={patient.id} className="p-4 border border-gray-100 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all flex justify-between items-center bg-gray-50">
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">{patient.full_name}</p>
                    <p className="text-sm text-gray-500">
                      Nascimento: {new Date(patient.date_of_birth).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                    </p>
                  </div>
                 <Link 
                    href={`/dashboard/evaluation/${patient.id}`}
                    className="text-blue-600 text-sm font-semibold hover:underline bg-blue-50 px-3 py-1.5 rounded"
                    >
                   Nova Avaliação
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}