'use client'

import { motion } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`
        bg-white/80 backdrop-blur-sm
        rounded-2xl shadow-lg shadow-warm-200/50
        border border-warm-200/30
        p-8 max-w-2xl mx-auto
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}
