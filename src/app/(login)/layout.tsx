import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import '@/app/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'O.R.I - Login',
  description: 'Acesso ao painel O.R.I v3.0',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  )
}