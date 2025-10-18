'use client'

import { motion } from 'framer-motion'
import Card from './Card'

interface SuccessScreenProps {
  data: {
    file: File
    preview: string
    story: string
    hash: string
    fileName: string
  }
  onUploadAnother: () => void
  onExit: () => void
}

export default function SuccessScreen({ data, onUploadAnother, onExit }: SuccessScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Mensaje de éxito */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center space-y-4"
          >
            <div className="text-6xl">✨</div>
            <h2 className="text-3xl font-bold text-warm-900">
              ¡Recuerdo guardado!
            </h2>
            <p className="text-warm-600 text-lg">
              Tu recuerdo ha sido guardado con éxito.
            </p>
          </motion.div>

          {/* Información del recuerdo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-warm-50 rounded-xl p-6 space-y-4"
          >
            {/* Imagen */}
            <div className="text-center">
              <img
                src={data.preview}
                alt="Recuerdo guardado"
                className="max-h-48 mx-auto rounded-lg shadow-md"
              />
            </div>

            {/* Detalles */}
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-warm-700">
                  Archivo:
                </p>
                <p className="text-sm text-warm-600 font-mono">
                  {data.fileName}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-warm-700">
                  Historia:
                </p>
                <p className="text-sm text-warm-600 italic">
                  "{data.story}"
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-warm-700">
                  Hash SHA-256:
                </p>
                <p className="text-xs text-warm-500 font-mono break-all">
                  {data.hash}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Botones de acción */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex space-x-4"
          >
            <button
              onClick={onUploadAnother}
              className="
                flex-1 px-6 py-3 bg-warm-800 text-white
                rounded-lg font-medium
                hover:bg-warm-900 transition-colors
                flex items-center justify-center space-x-2
              "
            >
              <span>📸</span>
              <span>Subir otro recuerdo</span>
            </button>
            <button
              onClick={onExit}
              className="
                flex-1 px-6 py-3 border border-warm-300
                text-warm-700 rounded-lg
                hover:bg-warm-50 transition-colors
                flex items-center justify-center space-x-2
              "
            >
              <span>👋</span>
              <span>Salir</span>
            </button>
          </motion.div>

          {/* Mensaje final */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center"
          >
            <p className="text-sm text-warm-500 italic">
              "Donde los recuerdos viven para siempre"
            </p>
          </motion.div>
        </motion.div>
      </Card>
    </div>
  )
}
