import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Pega na URL de retorno e extrai o código de segurança do Google
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    // Troca o código temporário por uma sessão válida no Supabase
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Após o sucesso, redireciona o utilizador para a sua página principal ou dashboard
  // (Se a sua página logada tiver outro nome, altere '/dashboard' abaixo)
  return NextResponse.redirect(new URL('/dashboard', request.url))
}