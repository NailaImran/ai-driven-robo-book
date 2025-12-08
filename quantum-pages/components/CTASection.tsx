import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-quantum-600 to-quantum-800">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Start Your Journey?
        </h2>
        <p className="text-xl text-quantum-100 mb-8">
          Join thousands of learners exploring Physical AI and Robotics with QuantumPages
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/chapters" className="px-8 py-4 bg-white text-quantum-600 font-bold rounded-lg hover:shadow-lg transition transform hover:scale-105">
            Browse All Chapters
          </Link>
          <Link href="#" className="px-8 py-4 bg-quantum-500 text-white font-bold rounded-lg border-2 border-white hover:bg-quantum-700 transition">
            Create Account
          </Link>
        </div>
      </div>
    </section>
  )
}
