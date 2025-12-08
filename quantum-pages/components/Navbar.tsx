'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 glass-dark border-b border-slate-700/50 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo with gradient */}
          <Link href="/" className="flex items-center gap-3 font-bold text-2xl group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold glow-cyan"
            >
              Q
            </motion.div>
            <span className="gradient-text">QuantumPages</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            {[
              { href: '/', label: 'Home' },
              { href: '/chapters', label: 'Chapters' },
              { href: '/about', label: 'About' },
            ].map((item) => (
              <motion.div
                key={item.href}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.href}
                  className="text-slate-300 hover:text-cyan-400 font-medium transition relative group"
                >
                  {item.label}
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            ))}
            <LanguageSwitcher />
          </div>

          {/* Mobile menu button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden p-2 rounded-lg glass-dark"
          >
            <svg
              className="w-6 h-6 text-cyan-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={isOpen ? { height: 'auto' } : { height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="pb-4 border-t border-slate-700/50 space-y-2">
            {[
              { href: '/', label: 'Home' },
              { href: '/chapters', label: 'Chapters' },
              { href: '/about', label: 'About' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 text-slate-300 hover:text-cyan-400 hover:pl-2 transition"
              >
                {item.label}
              </Link>
            ))}
            <div className="py-2 border-t border-slate-700/50 mt-4 pt-4">
              <LanguageSwitcher />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}
