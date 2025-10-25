import type { Metadata } from 'next'
import './globals.css'
import { ReownProvider } from '../components/ReownProvider'
import { WalletButton } from '../components/WalletButton'
import { WalletProvider } from '../contexts/WalletContext'


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
        <ReownProvider>
          <WalletProvider>
            <nav className="bg-white shadow-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-2xl font-bold text-indigo-600">
                    Mnemósine
                  </h1>
                </div>
              </div>
              
              {/* Navigation Links */}
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a
                    href="/"
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Inicio
                  </a>
                  <a
                    href="/upload"
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Subir Recuerdo
                  </a>
                  <a
                    href="/memories"
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Mis Recuerdos
                  </a>
                  
                  <WalletButton />
                  
                </div>
              </div>
              
              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  type="button"
                  className="text-gray-700 hover:text-indigo-600 focus:outline-none focus:text-indigo-600"
                  aria-controls="mobile-menu"
                  aria-expanded="false"
                >
                  <span className="sr-only">Abrir menú principal</span>
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile menu */}
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <a
                href="/"
                className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                Inicio
              </a>
              <a
                href="/upload"
                className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                Subir Recuerdo
              </a>
              <a
                href="/memories"
                className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                Mis Recuerdos
              </a>
              <WalletButton />
            </div>
          </div>
          </nav>
          
            <main className="min-h-screen">
              {children}
            </main>
          </WalletProvider>
        </ReownProvider>
      </body>
    </html>
  )
}
