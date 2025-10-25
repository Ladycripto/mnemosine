'use client'

import { useAppKitAccount, useAppKit, useDisconnect } from '@reown/appkit/react'

export function WalletButton() {
  const { address, isConnected } = useAppKitAccount()
  const { open } = useAppKit()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <button
          onClick={() => disconnect()}
          className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
        >
          Desconectar
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => open()}
      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
    >
      Conectar Wallet
    </button>
  )
}
