import type { Metadata } from 'next'
import { Barlow } from 'next/font/google'
import { ToastProvider } from '@/lib/providers/ToastProvider'
import { ThemeProvider } from '@/lib/providers/ThemeProvider'
import { ErrorBoundary } from '@/componentes/errors/ErrorBoundary'
import '@/estilos/globals.css'

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-barlow',
  display: 'swap',
  fallback: ['system-ui', 'arial', 'sans-serif'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'VIP Assist - Atendimento Inteligente',
  description: 'Plataforma de atendimento omnichannel com IA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={barlow.variable} suppressHydrationWarning>
      <body className={barlow.className}>
        <ThemeProvider>
          <ErrorBoundary>
            <ToastProvider />
            {children}
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}
