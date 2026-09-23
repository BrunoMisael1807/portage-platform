import './globals.css'

export const metadata = {
  title: 'Portage Platform',
  description: 'Plataforma de Avaliação e Desenvolvimento Infantil',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}