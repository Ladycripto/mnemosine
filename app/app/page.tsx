'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import HomeScreen from '../components/HomeScreen'
import UploadScreen from '../components/UploadScreen'
import SuccessScreen from '../components/SuccessScreen'

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
