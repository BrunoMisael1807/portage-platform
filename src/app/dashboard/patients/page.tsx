'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function PatientsManagerPage() {
  const router = useRouter()
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Estado do formulário de novo paciente
  const [formData, setFormData] = useState({
    full_name: '', birth_date: '', height: '', weight: '',
    father_name: '', father_email: '', father_phone: '',
    mother_name: '', mother_email: '', mother_phone: ''
  })

  // Função para calcular a idade exata baseada na data de nascimento
  const calculateAge = (dob: string) => {
    if (!dob) return ''
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return router.push('/login')

    // Procura pacientes criados por mim OU partilhados comigo
    const { data: myPatients } = await supabase.from('patients').select('*').eq('professional_id', session.user.id)
    const { data: shared } = await supabase.from('patient_shares').select('patient_id').eq('shared_with', session.user.id)
    
    let allPatients = myPatients || []
    if (shared && shared.length > 0) {
      const sharedIds = shared.map(s => s.patient_id)
      const { data: sharedPatients } = await supabase.from('patients').select('*').in('id', sharedIds)
      if (sharedPatients) allPatients = [...allPatients, ...sharedPatients]
    }
    
    setPatients(allPatients)
    setLoading(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSavePatient = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    // VALIDAÇÃO: Obriga a ter pelo menos um responsável preenchido
    if (!formData.father_name && !formData.mother_name) {
      setErrorMsg('É obrigatório preencher os dados de pelo menos um dos responsáveis (Pai ou Mãe).')
      return
    }

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const { data, error } = await supabase.from('patients').insert([{
      professional_id: session.user.id,
      ...formData
    }]).select().single()

    if (error) {
      setErrorMsg('Erro ao guardar: ' + error.message)
    } else if (data) {
      // Redireciona imediatamente para o histórico do paciente criado
      router.push(`/dashboard/patient/${data.id}`)
    }
  }

  if (loading) return <div className="p-8">A carregar lista de pacientes...</div>

  return (
    <div className="p-8 max-w-6xl mx-auto pb-32">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <button onClick={() => router.push('/dashboard')} className="text-indigo-600 hover:underline mb-2 block text-sm font-semibold">&larr; Voltar ao Início</button>
          <h1 className="text-3xl font-bold text-gray-800">Gestão de Pacientes</h1>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
        >
          {showForm ? 'Cancelar Registo' : '+ Novo Paciente'}
        </button>
      </div>

      {errorMsg && <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded font-semibold">{errorMsg}</div>}

      {/* FORMULÁRIO DE CADASTRO EXPANDIDO */}
      {showForm && (
        <form onSubmit={handleSavePatient} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8 space-y-6">
          
          {/* DADOS DO PACIENTE */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-indigo-900 border-b pb-2">Dados da Criança</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nome Completo</label>
                <input type="text" name="full_name" required onChange={handleInputChange} className="w-full border rounded p-2 bg-gray-50" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Data de Nascimento</label>
                  <input type="date" name="birth_date" required onChange={handleInputChange} className="w-full border rounded p-2 bg-gray-50" />
                </div>
                <div className="w-24">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Idade</label>
                  <input type="text" disabled value={`${calculateAge(formData.birth_date)} anos`} className="w-full border rounded p-2 bg-gray-200 text-center font-bold text-gray-600 cursor-not-allowed" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Altura (cm)</label>
                <input type="number" step="0.01" name="height" onChange={handleInputChange} placeholder="Ex: 110" className="w-full border rounded p-2 bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Peso (kg)</label>
                <input type="number" step="0.1" name="weight" onChange={handleInputChange} placeholder="Ex: 18.5" className="w-full border rounded p-2 bg-gray-50" />
              </div>
            </div>
          </div>

          {/* DADOS DOS RESPONSÁVEIS */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-indigo-900 border-b pb-2">Responsáveis (Preencher pelo menos um)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* BLOCO DA MÃE */}
              <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="font-bold text-gray-800 text-center">Dados da Mãe</h3>
                <input type="text" name="mother_name" onChange={handleInputChange} placeholder="Nome Completo" className="w-full border rounded p-2" />
                <input type="email" name="mother_email" onChange={handleInputChange} placeholder="Email" className="w-full border rounded p-2" />
                <input type="text" name="mother_phone" onChange={handleInputChange} placeholder="Telefone / WhatsApp" className="w-full border rounded p-2" />
              </div>

              {/* BLOCO DO PAI */}
              <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="font-bold text-gray-800 text-center">Dados do Pai</h3>
                <input type="text" name="father_name" onChange={handleInputChange} placeholder="Nome Completo" className="w-full border rounded p-2" />
                <input type="email" name="father_email" onChange={handleInputChange} placeholder="Email" className="w-full border rounded p-2" />
                <input type="text" name="father_phone" onChange={handleInputChange} placeholder="Telefone / WhatsApp" className="w-full border rounded p-2" />
              </div>

            </div>
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-indigo-700 transition-colors">
            Salvar Paciente e Iniciar Prontuário
          </button>
        </form>
      )}

      {/* LISTA DE PACIENTES */}
      {!showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {patients.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p className="text-lg">Nenhum paciente registado.</p>
              <p className="text-sm mt-2">Clique em "+ Novo Paciente" para começar.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {patients.map(pat => (
                <li key={pat.id} onClick={() => router.push(`/dashboard/patient/${pat.id}`)} className="p-4 hover:bg-indigo-50 cursor-pointer transition-colors flex justify-between items-center group">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg group-hover:text-indigo-700">{pat.full_name}</h3>
                    <p className="text-sm text-gray-500">Idade: {calculateAge(pat.birth_date)} anos | Resp: {pat.mother_name || pat.father_name}</p>
                  </div>
                  <span className="text-indigo-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Aceder Prontuário &rarr;</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}