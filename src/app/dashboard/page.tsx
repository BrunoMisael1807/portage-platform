'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState<string | undefined>('')

  useEffect(() => {
    // Função que verifica se a pessoa está logada
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        // Se não tiver sessão, chuta para o login
        router.push('/login')
      } else {
        // Se tiver, libera a tela e guarda o email
        setUserEmail(session.user.email)
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Mostra uma tela de carregamento enquanto verifica a segurança
  if (loading) {
    return <div className="p-8">Verificando credenciais...</div>
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold">Painel do Profissional</h1>
        <button 
          onClick={handleLogout}
          className="bg-red-100 text-red-700 px-4 py-2 rounded font-semibold"
        >
          Sair
        </button>
      </div>
      
      <p className="mb-4">Logado como: <strong>{userEmail}</strong></p>
      
      <div className="bg-gray-100 p-4 rounded border">
        <p>A lista de pacientes e as avaliações Portage/IPO aparecerão aqui em breve.</p>
      </div>
    </div>
  )
}