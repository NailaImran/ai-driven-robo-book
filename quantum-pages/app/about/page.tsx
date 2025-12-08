export default function About() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold gradient-text mb-6">About QuantumPages</h1>
          <p className="text-xl text-slate-300">
            Empowering learners worldwide with comprehensive education in Physical AI and Robotics
          </p>
        </div>

        {/* Mission */}
        <section className="glass-dark rounded-xl p-8 border border-slate-700/50 mb-8">
          <h2 className="text-3xl font-bold gradient-text mb-4">Our Mission</h2>
          <p className="text-slate-300 leading-relaxed">
            QuantumPages is dedicated to making advanced physics, AI, and robotics education accessible to everyone.
            We believe in creating interactive, comprehensive learning experiences that bridge theory and practice.
          </p>
        </section>

        {/* What we offer */}
        <section className="glass-dark rounded-xl p-8 border border-cyan-500/30 mb-8">
          <h2 className="text-3xl font-bold gradient-text mb-4">What We Offer</h2>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold text-xl mt-1">✓</span>
              <span><strong>Comprehensive Curriculum:</strong> From basics to advanced topics in physics, AI, and robotics</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold text-xl mt-1">✓</span>
              <span><strong>Bilingual Content:</strong> Learn in English or Urdu with full translation</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold text-xl mt-1">✓</span>
              <span><strong>Interactive Examples:</strong> Code samples, visualizations, and simulations</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold text-xl mt-1">✓</span>
              <span><strong>Real-World Applications:</strong> Case studies and practical implementation guides</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold text-xl mt-1">✓</span>
              <span><strong>Community Support:</strong> Connect with learners and experts worldwide</span>
            </li>
          </ul>
        </section>

        {/* Team */}
        <section className="glass-dark rounded-xl p-8 border border-slate-700/50 mb-8">
          <h2 className="text-3xl font-bold gradient-text mb-6">Our Vision</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            We envision a world where high-quality STEM education is accessible to learners regardless of location,
            language, or background. By combining cutting-edge content with modern learning technologies,
            we're building the next generation of innovators and problem-solvers.
          </p>
          <p className="text-slate-300 leading-relaxed">
            QuantumPages represents our commitment to making physical computing, AI, and advanced physics
            an integral part of global education.
          </p>
        </section>

        {/* Contact */}
        <section className="text-center">
          <h2 className="text-3xl font-bold gradient-text mb-6">Get In Touch</h2>
          <p className="text-slate-300 mb-6">
            Have questions or feedback? We'd love to hear from you!
          </p>
          <a
            href="mailto:hello@quantumpages.com"
            className="btn-primary inline-block"
          >
            Contact Us
          </a>
        </section>
      </div>
    </div>
  )
}
