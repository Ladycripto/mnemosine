import type { Metadata } from 'next'
import './globals.css'


export const metadata: Metadata = {
  title: 'Mnemósine - Preserva tus recuerdos',
  description: 'Una experiencia para guardar tus historias de forma digital y segura.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
