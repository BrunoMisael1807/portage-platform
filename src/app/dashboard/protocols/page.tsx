'use client'

import { useRouter } from 'next/navigation'

export default function ProtocolsPage() {
  const router = useRouter()

  return (
    <div className="p-8 max-w-6xl mx-auto pb-32">
      
      {/* CABEÇALHO */}
      <div className="mb-8 border-b pb-4">
        <button onClick={() => router.push('/dashboard')} className="text-indigo-600 hover:underline mb-4 block text-sm font-semibold">
          &larr; Voltar ao Início
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Biblioteca de Protocolos</h1>
        <p className="text-gray-600 mt-2">Selecione o instrumento de avaliação clínica.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CARTÃO 1: INVENTÁRIO PORTAGE (ATIVO) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-200 relative">
          <span className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">Disponível</span>
          <h2 className="text-2xl font-bold text-indigo-900 mb-2">Inventário Portage</h2>
          <p className="text-sm text-gray-600 mb-6">Operacionalizado para avaliação do desenvolvimento infantil de 0 a 6 anos em 5 áreas fundamentais.</p>
          <button 
            onClick={() => router.push('/dashboard/patients')} 
            className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
          >
            Aplicar Avaliação (Selecionar Paciente)
          </button>
        </div>

        {/* CARTÃO 2: MODELO DENVER (FUTURO) */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200 relative opacity-70">
          <span className="absolute top-4 right-4 bg-gray-200 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">Em Breve</span>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Modelo Denver (ESDM)</h2>
          <p className="text-sm text-gray-600 mb-6">Lista de verificação do Modelo Denver de Intervenção Precoce para crianças com autismo.</p>
          <button disabled className="w-full bg-gray-300 text-gray-500 px-4 py-3 rounded-lg font-bold cursor-not-allowed">
            Indisponível no momento
          </button>
        </div>

      </div>
    </div>
  )
}