'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-950/80 text-white py-20 border-t border-slate-700/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold glow-cyan">
                Q
              </div>
              <span className="gradient-text">QuantumPages</span>
            </h3>
            <p className="text-slate-400 hover:text-slate-300 transition">
              Interactive learning platform for Physical AI and Robotics
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <h4 className="text-lg font-semibold mb-4 gradient-text">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/chapters', label: 'Chapters' },
                { href: '/about', label: 'About' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-slate-400 hover:text-cyan-400 transition relative group">
                    {item.label}
                    <motion.span
                      className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all"
                      layoutId="underline"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h4 className="text-lg font-semibold mb-4 gradient-text">Resources</h4>
            <ul className="space-y-3">
              {[
                { href: '#', label: 'Documentation' },
                { href: '#', label: 'Code Examples' },
                { href: '#', label: 'FAQ' },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-slate-400 hover:text-cyan-400 transition">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h4 className="text-lg font-semibold mb-4 gradient-text">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:info@quantumpages.com" className="text-slate-400 hover:text-cyan-400 transition">
                  info@quantumpages.com
                </a>
              </li>
              <li className="text-slate-400">
                GitHub: @quantumpages
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="border-t border-slate-700/50 pt-8 mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400">
              © {currentYear} QuantumPages. All rights reserved.
            </p>
            <div className="flex gap-8 mt-6 md:mt-0">
              {[
                { href: '#', label: 'Privacy' },
                { href: '#', label: 'Terms' },
                { href: '#', label: 'Sitemap' },
              ].map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className="text-slate-400 hover:text-cyan-400 transition relative group"
                  whileHover={{ scale: 1.05 }}
                >
                  {item.label}
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all"
                  />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
