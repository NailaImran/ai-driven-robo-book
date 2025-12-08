'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import ModernCard3D from './ModernCard3D'
import { chapters } from '@/lib/chapters'

export default function FeaturedChaptersModern() {
  const featured = chapters.slice(0, 3)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-blob" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold gradient-text mb-6">Featured Chapters</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Dive into our most popular learning modules with stunning visualizations
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          {featured.map((chapter, index) => (
            <motion.div
              key={chapter.id}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: 'easeOut' },
                },
              }}
            >
              <Link href={`/chapters/${chapter.id}`}>
                <ModernCard3D
                  icon={chapter.icon}
                  title={chapter.title}
                  description={chapter.description}
                  gradient={
                    index === 0
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                      : index === 1
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500'
                  }
                  glowColor={
                    index === 0
                      ? 'border-cyan-500/50'
                      : index === 1
                      ? 'border-blue-500/50'
                      : 'border-purple-500/50'
                  }
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/chapters"
            className="btn-primary inline-block group relative overflow-hidden"
          >
            <span className="relative z-10">Explore All Chapters</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 -z-10"
              initial={{ x: '100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
