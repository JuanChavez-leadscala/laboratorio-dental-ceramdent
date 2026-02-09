import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ceramdent | Laboratorio Dental Digital',
  description: 'Gestión inteligente para laboratorios dentales de alto nivel.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
