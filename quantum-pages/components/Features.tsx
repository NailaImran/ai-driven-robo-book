export default function Features() {
  const features = [
    {
      icon: '📚',
      title: 'Comprehensive Content',
      description: 'Well-structured chapters covering robotics, physics, and AI fundamentals',
    },
    {
      icon: '💻',
      title: 'Code Examples',
      description: 'Hands-on code examples and practical implementation guides',
    },
    {
      icon: '🌍',
      title: 'Bilingual Support',
      description: 'Learn in English or Urdu with full language switching',
    },
    {
      icon: '📊',
      title: 'Interactive Content',
      description: 'Visualizations, simulations, and interactive learning modules',
    },
    {
      icon: '🚀',
      title: 'Cutting-Edge Topics',
      description: 'Cover latest developments in AI, robotics, and physical computing',
    },
    {
      icon: '👥',
      title: 'Community Driven',
      description: 'Learn from and contribute to our growing community',
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose QuantumPages?</h2>
          <p className="text-xl text-gray-600">
            Everything you need for a comprehensive learning experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-8 bg-white rounded-xl border border-gray-200 hover:border-quantum-300 hover:shadow-lg transition">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
