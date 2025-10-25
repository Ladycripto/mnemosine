'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface WalletContextType {
  isConnected: boolean
  address: string | null
  connect: () => void
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)

  const connect = () => {
    // Simular conexión de wallet para demo
    const mockAddress = 'DemoWallet123456789'
    setAddress(mockAddress)
    setIsConnected(true)
  }

  const disconnect = () => {
    setAddress(null)
    setIsConnected(false)
  }

  return (
    <WalletContext.Provider value={{ isConnected, address, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
