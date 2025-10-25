'use client'

import { AppKitProvider } from '@reown/appkit/react'
import { projectId, metadata } from '../lib/reown-config'
import { solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks'

export function ReownProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppKitProvider
      projectId={projectId}
      networks={[solana, solanaTestnet, solanaDevnet]}
      metadata={metadata}
    >
      {children}
    </AppKitProvider>
  )
}
