'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function DashboardHub() {
  const router = useRouter()
  const [userName, setUserName] = useState('Profissional')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return router.push('/login')
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', session.user.id)
        .single()
        
      if (profile?.full_name) {
        setUserName(profile.full_name.split(' ')[0]) // Mostra apenas o primeiro nome
      }
      setLoading(false)
    }
    loadUser()
  }, [router])

  // Função para fazer logout e voltar à página de login
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <div className="p-8 text-gray-500">A carregar plataforma...</div>

  return (
    <div className="p-8 max-w-6xl mx-auto pb-32">
      <div className="flex justify-between items-end mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Olá, {userName}!</h1>
          <p className="text-gray-600 mt-2">Bem-vindo(a) à sua plataforma de avaliação clínica.</p>
        </div>
        <button onClick={handleLogout} className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-semibold transition-colors">
          Sair da Conta
        </button>
      </div>

      {/* GRELHA DE NAVEGAÇÃO PRINCIPAL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CARTÃO 1: PACIENTES */}
        <div 
          onClick={() => router.push('/dashboard/patients')}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
            👥
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Meus Pacientes</h2>
          <p className="text-sm text-gray-500">Gerencie cadastros, visualize o histórico clínico e partilhe acessos com a equipa.</p>
        </div>

        {/* CARTÃO 2: PERFIL PROFISSIONAL */}
        <div 
          onClick={() => router.push('/dashboard/profile')}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
            ⚕️
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Meu Perfil</h2>
          <p className="text-sm text-gray-500">Atualize os seus dados de contacto e registo nos conselhos de classe (CRFa, CRP, etc).</p>
        </div>

        {/* CARTÃO 3: PROTOCOLOS */}
        <div 
          onClick={() => router.push('/dashboard/protocols')}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
            📚
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Protocolos</h2>
          <p className="text-sm text-gray-500">Inventário Portage ativo. Novos protocolos (Denver, VB-MAPP) em breve.</p>
        </div>

        
      </div>
    </div>
  )
}