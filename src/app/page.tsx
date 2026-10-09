import { redirect } from 'next/navigation';

export default function Home() {
  // Redireciona automaticamente quem acede à raiz do site para o Login
  redirect('/login');
}