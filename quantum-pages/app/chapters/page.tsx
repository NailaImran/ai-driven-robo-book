'use client'

import ChapterGrid from '@/components/ChapterGrid'
import { chapters } from '@/lib/chapters'

export default function ChaptersPage() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-4">
            All Chapters
          </h1>
          <p className="text-xl text-slate-300">
            Explore the complete Physical AI curriculum
          </p>
        </div>
        <ChapterGrid chapters={chapters} />
      </div>
    </div>
  )
}
