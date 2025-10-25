'use client'

import { useState, useEffect } from 'react'

// Hook personalizado para manejar la integración con Reown
export function useReownWallet() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Simular conexión de wallet para demo
  const connect = async () => {
    setIsLoading(true)
    try {
      // Simular tiempo de conexión
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simular dirección de wallet
      const mockAddress = 'DemoWallet123456789'
      setAddress(mockAddress)
      setIsConnected(true)
    } catch (error) {
      console.error('Error conectando wallet:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const disconnect = () => {
    setAddress(null)
    setIsConnected(false)
  }

  // Simular conexión automática para demo
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isConnected) {
        connect()
      }
    }, 2000) // Conectar automáticamente después de 2 segundos

    return () => clearTimeout(timer)
  }, [isConnected])

  return {
    isConnected,
    address,
    connect,
    disconnect,
    isLoading
  }
}
