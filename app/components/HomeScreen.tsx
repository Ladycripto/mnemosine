'use client'

import { motion } from 'framer-motion'
import Card from './Card'

interface HomeScreenProps {
  onAccess: () => void
}

export default function HomeScreen({ onAccess }: HomeScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center space-y-8"
        >
          {/* Logo/Título */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            <h1 className="text-5xl font-bold text-warm-900 tracking-tight">
              Mnemósine
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-warm-600 to-warm-400 mx-auto rounded-full"></div>
          </motion.div>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl text-warm-700 font-light leading-relaxed"
          >
            Preserva tus recuerdos para las próximas generaciones.
          </motion.p>

          {/* Descripción */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-warm-600 leading-relaxed max-w-md mx-auto"
          >
            Una experiencia para guardar tus historias de forma digital y segura.
          </motion.p>

          {/* Botones de acción */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="flex flex-col space-y-4"
          >
            <button
              onClick={onAccess}
              className="
                bg-warm-100 hover:bg-warm-200
                text-warm-700 font-medium
                px-8 py-4 rounded-xl
                transition-all duration-300
                border border-warm-300
              "
            >
              Acceder a mi espacio
            </button>
          </motion.div>

          {/* Elemento decorativo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex justify-center space-x-2 pt-4"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 1.4 + i * 0.1 }}
                className="w-2 h-2 bg-warm-400 rounded-full"
              />
            ))}
          </motion.div>
        </motion.div>
      </Card>
    </div>
  )
}
