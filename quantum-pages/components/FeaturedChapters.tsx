import Link from 'next/link'
import { chapters } from '@/lib/chapters'

export default function FeaturedChapters() {
  const featured = chapters.slice(0, 3)

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Chapters</h2>
          <p className="text-xl text-gray-600">
            Dive into our most popular learning modules
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((chapter) => (
            <Link key={chapter.id} href={`/chapters/${chapter.id}`}>
              <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 hover:shadow-xl transition transform hover:scale-105 cursor-pointer border border-gray-200">
                <div className="mb-4 w-12 h-12 bg-quantum-100 rounded-lg flex items-center justify-center text-quantum-600 text-xl font-bold">
                  {chapter.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {chapter.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {chapter.description}
                </p>
                <div className="flex items-center text-quantum-600 font-semibold">
                  Explore →
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/chapters" className="inline-block px-8 py-3 bg-quantum-100 text-quantum-600 font-bold rounded-lg hover:bg-quantum-200 transition">
            View All Chapters
          </Link>
        </div>
      </div>
    </section>
  )
}
