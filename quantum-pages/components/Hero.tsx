import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-quantum-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-quantum-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-block mb-6 px-4 py-2 bg-quantum-100 rounded-full">
          <span className="text-quantum-700 font-semibold text-sm">
            Welcome to the Future of Learning
          </span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Master <span className="bg-gradient-to-r from-quantum-500 to-quantum-700 bg-clip-text text-transparent">
            Physical AI
          </span>
          <br />
          and Robotics
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Comprehensive textbook covering robotics, physics, AI, and control systems.
          Learn in your preferred language with interactive examples and hands-on code.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/chapters" className="px-8 py-4 bg-gradient-to-r from-quantum-500 to-quantum-700 text-white font-bold rounded-lg hover:shadow-lg transition transform hover:scale-105">
            Start Learning
          </Link>
          <Link href="/about" className="px-8 py-4 bg-white text-quantum-600 font-bold rounded-lg border-2 border-quantum-200 hover:border-quantum-600 transition">
            Learn More
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mt-16">
          <div>
            <div className="text-4xl font-bold text-quantum-600">3</div>
            <p className="text-gray-600">Comprehensive Chapters</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-quantum-600">2</div>
            <p className="text-gray-600">Languages</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-quantum-600">100+</div>
            <p className="text-gray-600">Code Examples</p>
          </div>
        </div>
      </div>
    </section>
  )
}
