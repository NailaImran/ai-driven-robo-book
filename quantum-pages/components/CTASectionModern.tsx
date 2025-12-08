'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CTASectionModern() {
  return (
    <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(34, 211, 238, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.1) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      />

      <motion.div
        className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            className="glass-dark rounded-3xl p-12 border-2 border-cyan-500/30 hover:border-cyan-500/60 transition-colors"
            whileHover={{ boxShadow: '0 0 30px rgba(34, 211, 238, 0.3)' }}
          >
            <motion.h2
              className="text-5xl font-bold mb-6 gradient-text"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Ready to Transform Your Learning?
            </motion.h2>

            <motion.p
              className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Join thousands of learners exploring Physical AI, Robotics, and
              Advanced Physics with QuantumPages. Experience the future of
              education with 3D visualizations and interactive learning.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/chapters"
                  className="btn-primary inline-block group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Exploring
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      -&gt;
                    </motion.span>
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 -z-10"
                    initial={{ x: '100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/about"
                  className="btn-secondary inline-block group relative overflow-hidden"
                >
                  <span className="relative z-10">Learn More</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/50 to-blue-500/50 -z-10"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="mt-12 pt-12 border-t border-slate-700/50 grid grid-cols-3 gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {[
                { value: '6', label: 'Chapters' },
                { value: '100+', label: 'Lessons' },
                { value: '2', label: 'Languages' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  className="group"
                >
                  <div className="text-3xl font-bold gradient-text group-hover:scale-110 transition">
                    {stat.value}
                  </div>
                  <p className="text-slate-400 text-sm mt-2">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
