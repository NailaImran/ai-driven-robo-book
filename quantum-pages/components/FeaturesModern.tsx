'use client'

import { motion } from 'framer-motion'

const featuresList = [
  {
    icon: '📚',
    title: 'Comprehensive Content',
    description: 'Well-structured chapters covering robotics, physics, and AI fundamentals with in-depth explanations',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: '💻',
    title: 'Interactive Code',
    description: 'Live code examples with real-time execution, syntax highlighting, and instant feedback',
    color: 'from-blue-500 to-purple-500',
  },
  {
    icon: '🌍',
    title: 'Bilingual Support',
    description: 'Learn in English or Urdu with complete translation and language switching capability',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: '📊',
    title: '3D Visualizations',
    description: 'Interactive 3D models, simulations, and stunning visual representations of complex concepts',
    color: 'from-pink-500 to-red-500',
  },
  {
    icon: '🚀',
    title: 'Cutting-Edge Topics',
    description: 'Cover latest developments in AI, robotics, quantum computing, and physical computing',
    color: 'from-red-500 to-orange-500',
  },
  {
    icon: '👥',
    title: 'Community Driven',
    description: 'Learn from and contribute to our growing community of learners and experts worldwide',
    color: 'from-orange-500 to-yellow-500',
  },
]

export default function FeaturesModern() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-blob" style={{ animationDelay: '3s' }} />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold gradient-text mb-6">Why Choose QuantumPages?</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Everything you need for a comprehensive learning experience with next-gen technology
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featuresList.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="relative h-full">
                <div
                  className={`absolute -inset-1 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500`}
                />

                <div className="relative card rounded-2xl h-full flex flex-col p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-5xl mb-6"
                  >
                    {feature.icon}
                  </motion.div>

                  <h3 className="text-2xl font-bold mb-3 group-hover:gradient-text transition-all">
                    {feature.title}
                  </h3>

                  <p className="text-slate-300 group-hover:text-slate-200 transition-colors flex-grow">
                    {feature.description}
                  </p>

                  <motion.div
                    className={`h-1 rounded-full mt-4 bg-gradient-to-r ${feature.color} origin-left`}
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
