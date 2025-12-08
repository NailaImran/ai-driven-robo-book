import Link from 'next/link'
import { Chapter } from '@/types/chapter'

interface ChapterGridProps {
  chapters: Chapter[]
}

export default function ChapterGrid({ chapters }: ChapterGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {chapters.map((chapter) => (
        <Link key={chapter.id} href={`/chapters/${chapter.id}`}>
          <div className="h-full glass-dark rounded-xl p-8 border-2 border-slate-700/50 hover:border-cyan-500/50 hover:shadow-xl transition transform hover:scale-105 cursor-pointer group">
            <div className="mb-6 w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg flex items-center justify-center text-3xl group-hover:shadow-lg transition">
              {chapter.icon}
            </div>
            <h3 className="text-2xl font-bold gradient-text mb-2 group-hover:text-cyan-400 transition">
              {chapter.title}
            </h3>
            <p className="text-slate-300 mb-4">
              {chapter.description}
            </p>
            <div className="pt-4 border-t border-slate-700/50">
              <p className="text-sm text-slate-400">
                {chapter.lessons} lessons • {chapter.duration}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
