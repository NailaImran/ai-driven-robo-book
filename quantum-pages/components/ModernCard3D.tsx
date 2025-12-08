'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface ModernCard3DProps {
  icon: string
  title: string
  description: string
  gradient: string
  glowColor: string
}

export default function ModernCard3D({
  icon,
  title,
  description,
  gradient,
  glowColor,
}: ModernCard3DProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className={`absolute -inset-1 rounded-2xl ${gradient} opacity-0 blur-xl transition-all duration-500`}
        animate={{ opacity: isHovered ? 0.5 : 0 }}
      />

      <div className={`relative card rounded-2xl h-full flex flex-col p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 ${glowColor}`}>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-5xl mb-6"
        >
          {icon}
        </motion.div>

        <h3 className={`text-2xl font-bold mb-3 transition-all ${isHovered ? 'gradient-text' : ''}`}>
          {title}
        </h3>

        <p className={`transition-colors flex-grow ${isHovered ? 'text-slate-200' : 'text-slate-300'}`}>
          {description}
        </p>

        <motion.div
          className={`h-1 rounded-full mt-4 ${gradient} origin-left`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  )
}
