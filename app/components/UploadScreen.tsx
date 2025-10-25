'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from './Card'
import { uploadToIPFS, uploadTextToIPFS, getIPFSURL } from '../lib/pinata'
import { useSolanaWallet } from '../lib/useSolanaWallet'
import { useAppKitAccount } from '@reown/appkit/react'

interface UploadScreenProps {
  onSuccess: (data: { 
    file: File; 
    preview: string; 
    story: string; 
    hash: string; 
    fileName: string;
    imageIpfsHash?: string;
    storyIpfsHash?: string;
    solanaTxHash?: string;
  }) => void
  onBack: () => void
}
export default function UploadScreen({ onSuccess, onBack }: UploadScreenProps) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [story, setStory] = useState('')
  const [hash, setHash] = useState('')
  const [isCalculating, setIsCalculating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const [imageIpfsHash, setImageIpfsHash] = useState('')
  const [storyIpfsHash, setStoryIpfsHash] = useState('')
  const [solanaTxHash, setSolanaTxHash] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Hook de Reown
  const { address, isConnected } = useAppKitAccount()
  
  // Hook de Solana
  const { 
    registerImage, 
    isLoading: isSolanaLoading, 
    isProcessing: isSolanaProcessing,
    error: solanaError,
    checkTransactionStatus
  } = useSolanaWallet()


  // Función para calcular hash SHA-256
  const calculateHash = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
      alert('Por favor, selecciona una imagen PNG o JPG.')
      return
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen debe ser menor a 5MB.')
      return
    }

    setImageFile(file)
    
    // Crear preview
    const preview = URL.createObjectURL(file)
    setImagePreview(preview)

    // Calcular hash
    setIsCalculating(true)
    try {
      const fileHash = await calculateHash(file)
      setHash(fileHash)
    } catch (error) {
      console.error('Error calculando hash:', error)
      alert('Error al procesar la imagen.')
    } finally {
      setIsCalculating(false)
    }
  }

  const handleSave = async () => {
    if (!imageFile || !story.trim()) {
      alert('Por favor, selecciona una imagen y escribe tu historia.')
      return
    }

    // Verificar conexión de wallet
    if (!isConnected) {
      alert('Por favor, conecta tu wallet primero.')
      return
    }

    setIsSaving(true)
    try {
      // Subir imagen a IPFS
      setUploadStatus('Subiendo imagen a IPFS...')
      const imageHash = await uploadToIPFS(imageFile)
      setImageIpfsHash(imageHash)
      
      // Subir historia a IPFS
      setUploadStatus('Subiendo historia a IPFS...')
      const storyHash = await uploadTextToIPFS(story.trim())
      setStoryIpfsHash(storyHash)
      
      // Registrar en Solana
      setUploadStatus('Registrando en Solana...')
      const txHash = await registerImage(imageHash, imageFile.name)
      setSolanaTxHash(txHash)
      
      // Verificar estado de la transacción después de un breve delay
      setTimeout(async () => {
        try {
          const status = await checkTransactionStatus(txHash)
          console.log('🔍 Estado de transacción verificado:', status)
          
          if (status.status === 'success') {
            setUploadStatus('¡Recuerdo guardado exitosamente en blockchain!')
          } else if (status.status === 'failed') {
            setUploadStatus('⚠️ Transacción falló, pero la imagen se subió a IPFS')
          } else {
            setUploadStatus('⏳ Transacción pendiente - verificar en explorer')
          }
        } catch (error) {
          console.log('🔍 No se pudo verificar el estado de la transacción')
        }
      }, 2000)
      
      setUploadStatus('¡Recuerdo guardado exitosamente!')
      
      onSuccess({
        file: imageFile,
        preview: imagePreview,
        story: story.trim(),
        hash,
        fileName: imageFile.name,
        imageIpfsHash: imageHash,
        storyIpfsHash: storyHash,
        solanaTxHash: txHash
      })
    } catch (error) {
      console.error('Error guardando:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      alert(`Error al guardar: ${errorMessage}`)
    } finally {
      setIsSaving(false)
      setUploadStatus('')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.match(/^image\/(png|jpeg|jpg)$/)) {
        // Crear un evento sintético para manejar el archivo
        const syntheticEvent = {
          target: { files: [file] }
        } as unknown as React.ChangeEvent<HTMLInputElement>
        handleFileChange(syntheticEvent)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Estado de la wallet */}
          <div className="bg-warm-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-warm-700">
                  Estado de la Wallet:
                </p>
                <p className="text-sm text-warm-600">
                  {isConnected ? `Conectada: ${address?.slice(0, 8)}...${address?.slice(-8)}` : 'No conectada'}
                </p>
              </div>
              <div>
                <p className="text-xs text-warm-500">
                  Usa el botón de wallet en la barra de navegación
                </p>
              </div>
            </div>
            {solanaError && (
              <p className="text-xs text-red-600 mt-2">
                Error: {solanaError}
              </p>
            )}
          </div>
          
          {/* Título */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-warm-900 mb-2">
              Subir Recuerdo
            </h2>
            <p className="text-warm-600">
              Comparte una foto y cuenta su historia
            </p>
          </div>

          {/* Área de subida de archivos */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="
              border-2 border-dashed border-warm-300
              rounded-xl p-8 text-center
              hover:border-warm-400 transition-colors
              cursor-pointer
            "
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <AnimatePresence mode="wait">
              {!imagePreview ? (
                <motion.div
                  key="upload-prompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="text-4xl">📸</div>
                  <div>
                    <p className="text-lg font-medium text-warm-700">
                      Arrastra una imagen aquí o haz clic para seleccionar
                    </p>
                    <p className="text-sm text-warm-500 mt-1">
                      PNG o JPG, máximo 5MB
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="image-preview"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="space-y-4"
                >
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg shadow-md"
                  />
                  <p className="text-sm text-warm-600">
                    {imageFile?.name}
                  </p>
                  {isCalculating && (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-warm-600"></div>
                      <span className="text-sm text-warm-600">Calculando hash...</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Textarea para la historia */}
          <div>
            <label className="block text-sm font-medium text-warm-700 mb-2">
              Cuenta la historia o los sentimientos que te genera esta foto
            </label>
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Escribe aquí tu historia..."
              className="
                w-full h-32 p-4 border border-warm-300 rounded-lg
                focus:ring-2 focus:ring-warm-500 focus:border-transparent
                resize-none text-warm-700
                placeholder-warm-400
              "
            />
          </div>

          {/* Hash display */}
          {hash && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-warm-50 p-4 rounded-lg"
            >
              <p className="text-sm font-medium text-warm-700 mb-1">
                Hash SHA-256:
              </p>
              <p className="text-xs font-mono text-warm-600 break-all">
                {hash}
              </p>
            </motion.div>
          )}
          {/* IPFS Hashes display */}
          {(imageIpfsHash || storyIpfsHash) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 p-4 rounded-lg space-y-2"
            >
              <p className="text-sm font-medium text-blue-700 mb-2">
                Hashes IPFS:
              </p>
              {imageIpfsHash && (
                <div>
                  <p className="text-xs font-medium text-blue-600">Imagen:</p>
                  <p className="text-xs font-mono text-blue-500 break-all">
                    {imageIpfsHash}
                  </p>
                </div>
              )}
              {storyIpfsHash && (
                <div>
                  <p className="text-xs font-medium text-blue-600">Historia:</p>
                  <p className="text-xs font-mono text-blue-500 break-all">
                    {storyIpfsHash}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Solana Transaction Hash display */}
          {solanaTxHash && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-purple-50 p-4 rounded-lg"
            >
              <p className="text-sm font-medium text-purple-700 mb-1">
                Transacción Solana:
              </p>
              <p className="text-xs font-mono text-purple-600 break-all">
                {solanaTxHash}
              </p>
            </motion.div>
          )}

          {/* Botones */}
          <div className="flex space-x-4">
            <button
              onClick={onBack}
              className="
                flex-1 px-6 py-3 border border-warm-300
                text-warm-700 rounded-lg
                hover:bg-warm-50 transition-colors
              "
            >
              Volver
            </button>
            <button
              onClick={handleSave}
              disabled={!imageFile || !story.trim() || isSaving || isSolanaProcessing || !isConnected}
              className="
                flex-1 px-6 py-3 bg-warm-800 text-white
                rounded-lg font-medium
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:bg-warm-900 transition-colors
                flex items-center justify-center space-x-2
              "
            >
              {isSaving || isSolanaProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{uploadStatus || 'Guardando...'}</span>
                </>
              ) : !isConnected ? (
                'Conecta tu wallet primero'
              ) : (
                'Guardar en Blockchain'
              )}
            </button>
          </div>
        </motion.div>
      </Card>
    </div>
  )
}
