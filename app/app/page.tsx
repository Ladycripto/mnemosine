'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import HomeScreen from '../components/HomeScreen'
import UploadScreen from '../components/UploadScreen'
import SuccessScreen from '../components/SuccessScreen'

// App.tsx
import { createAppKit } from "@reown/appkit/react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { solana, solanaTestnet, solanaDevnet } from "@reown/appkit/networks";

// 0. Set up Solana Adapter
const solanaWeb3JsAdapter = new SolanaAdapter();

// 1. Get projectId from https://dashboard.reown.com
const projectId = "c4c0f68957787526532c13f886a41ac0";

// 2. Create a metadata object - optional
const metadata = {
  name: "AppKit",
  description: "AppKit Solana Example",
  url: "https://example.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// 3. Create modal
createAppKit({
  adapters: [solanaWeb3JsAdapter],
  networks: [solana, solanaTestnet, solanaDevnet],
  metadata: metadata,
  projectId,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

type Screen = 'home' | 'upload' | 'success'

interface SuccessData {
  file: File
  preview: string
  story: string
  hash: string
  fileName: string
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home')
  const [successData, setSuccessData] = useState<SuccessData | null>(null)

  const handleAccess = () => {
    setCurrentScreen('upload')
  }

  const handleUploadSuccess = (data: SuccessData) => {
    setSuccessData(data)
    setCurrentScreen('success')
  }

  const handleUploadAnother = () => {
    setCurrentScreen('upload')
  }

  const handleExit = () => {
    setCurrentScreen('home')
    setSuccessData(null)
  }

  const handleBackToHome = () => {
    setCurrentScreen('home')
  }

  return (
    <main className="min-h-screen">
      <AnimatePresence mode="wait">
        {currentScreen === 'home' && (
          <HomeScreen key="home" onAccess={handleAccess} />
        )}
        
        {currentScreen === 'upload' && (
          <UploadScreen
            key="upload"
            onSuccess={handleUploadSuccess}
            onBack={handleBackToHome}
          />
        )}
        
        {currentScreen === 'success' && successData && (
          <SuccessScreen
            key="success"
            data={successData}
            onUploadAnother={handleUploadAnother}
            onExit={handleExit}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
