'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [userEmail, setUserEmail] = useState('')

  const [formData, setFormData] = useState({
    full_name: '',
    cpf: '',
    council_type: '',
    registration_number: '',
    cep: '',
    state: '',
    city: '',
    phone: ''
  })

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return router.push('/login')
      
      setUserEmail(session.user.email || '')

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (profile) {
        setFormData({
          full_name: profile.full_name || '',
          cpf: profile.cpf || '',
          council_type: profile.council_type || '',
          registration_number: profile.registration_number || '',
          cep: profile.cep || '',
          state: profile.state || '',
          city: profile.city || '',
          phone: profile.phone || ''
        })
      }
      setLoading(false)
    }
    loadProfile()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    // AGORA INCLUI O E-MAIL DO USUÁRIO LOGADO JUNTO COM OS DADOS DO FORMULÁRIO
    const { error } = await supabase
      .from('profiles')
      .update({ ...formData, email: session.user.email }) 
      .eq('id', session.user.id)

    if (error) {
      setMessage('Erro ao guardar perfil: ' + error.message)
    } else {
      setMessage('Perfil atualizado com sucesso!')
    }
    setSaving(false)
  }
  

  if (loading) return <div className="p-8 text-gray-500">A carregar perfil...</div>

  return (
    <div className="p-8 max-w-3xl mx-auto pb-32">
      
      {/* CABEÇALHO CORRIGIDO COM BOTÃO DE VOLTAR */}
      <div className="mb-8 border-b pb-4">
        <button onClick={() => router.push('/dashboard')} className="text-indigo-600 hover:underline mb-4 block text-sm font-semibold">
          &larr; Voltar ao Início
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Perfil Profissional</h1>
        <p className="text-gray-600 mt-2">Mantenha os seus dados de registo clínico atualizados.</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded font-semibold border ${
          message.includes('Erro') ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
        
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-indigo-900 border-b pb-2">Identificação</h2>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nome Completo</label>
            <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-300 rounded p-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">CPF</label>
              <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} placeholder="000.000.000-00" className="w-full bg-gray-50 border border-gray-300 rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email (Login)</label>
              <input type="email" value={userEmail} disabled className="w-full bg-gray-200 border border-gray-300 text-gray-500 rounded p-2 cursor-not-allowed" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-indigo-900 border-b pb-2">Registo Profissional</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Conselho de Classe</label>
              <select name="council_type" value={formData.council_type} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-300 rounded p-2">
                <option value="">Selecione...</option>
                <option value="CRFa">CRFa (Fonoaudiologia)</option>
                <option value="CREFITO_TO">CREFITO (Terapia Ocupacional)</option>
                <option value="CREFITO_FISIO">CREFITO (Fisioterapia)</option>
                <option value="CRP">CRP (Psicologia)</option>
                <option value="CREF">CREF (Educação Física)</option>
                <option value="ABPp">ABPp (Psicopedagogia)</option>
                <option value="ABP">ABP (Psicomotricidade)</option>
                <option value="OUTRO">Outro / Sem Conselho</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Número do Conselho</label>
              <input type="text" name="registration_number" value={formData.registration_number} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-300 rounded p-2" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-indigo-900 border-b pb-2">Contacto e Endereço</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Telefone / WhatsApp</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">CEP</label>
              <input type="text" name="cep" value={formData.cep} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 rounded p-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Estado (UF)</label>
              <input type="text" name="state" value={formData.state} onChange={handleChange} maxLength={2} placeholder="Ex: PB" className="w-full bg-gray-50 border border-gray-300 rounded p-2 uppercase" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Cidade</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 rounded p-2" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 mt-4">
          {saving ? 'A Guardar...' : 'Salvar Perfil Profissional'}
        </button>
      </form>
    </div>
  )
}