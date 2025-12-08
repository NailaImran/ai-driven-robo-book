'use client'

import Link from 'next/link'
import { Chapter } from '@/types/chapter'
import { getLessonContent } from '@/lib/lessonContent'
import LessonViewer from '@/components/LessonViewer'

interface ChapterContentProps {
  chapter: Chapter
}

export default function ChapterContent({ chapter }: ChapterContentProps) {

  return (
    <article className="max-w-none">
      {/* Header */}
      <div className="mb-12">
        <Link href="/chapters" className="text-cyan-400 hover:text-cyan-300 font-semibold mb-4 inline-block">
          ← Back to Chapters
        </Link>
        <div className="text-5xl mb-4">{chapter.icon}</div>
        <h1 className="text-5xl font-bold gradient-text mb-4">
          {chapter.title}
        </h1>
        <p className="text-xl text-slate-300 mb-6">
          {chapter.description}
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
          <span>📚 {chapter.lessons} lessons</span>
          <span>⏱️ {chapter.duration}</span>
          <span>🎓 {chapter.level}</span>
        </div>
      </div>

      {/* Content */}
      <div className="glass-dark rounded-xl p-8 border border-slate-700/50 my-8">
        <h2 className="text-2xl font-bold gradient-text mb-4">Chapter Overview</h2>
        <p className="text-slate-300 leading-relaxed">
          This chapter covers essential concepts and practical implementations.
          Work through each lesson to build a solid foundation in the topic.
        </p>
      </div>

      {/* Lessons */}
      <div className="my-12">
        <h2 className="text-3xl font-bold gradient-text mb-6">Lessons</h2>
        <div className="space-y-4">
          {Array.from({ length: chapter.lessons }).map((_, i) => {
            const lessonData = getLessonContent(chapter.id, i + 1)
            return (
              <LessonViewer
                key={i}
                chapterId={chapter.id}
                lessonNumber={i + 1}
                title={lessonData?.title || `${chapter.title} Part ${i + 1}`}
                description={lessonData?.description || "Learn key concepts and explore practical applications in this lesson."}
              />
            )
          })}
        </div>
      </div>

      {/* Code Examples */}
      <div className="my-12">
        <h2 className="text-3xl font-bold gradient-text mb-6">Code Examples</h2>
        <div className="bg-slate-950/80 text-slate-100 p-6 rounded-lg overflow-x-auto border border-slate-700/50">
          <pre className="text-sm">
            <code>{`// Example code for ${chapter.title}
import { Module } from '@quantum/core'

const example = new Module({
  title: '${chapter.title}',
  type: '${chapter.level}'
})

example.initialize()`}</code>
          </pre>
        </div>
      </div>

      {/* Resources */}
      <div className="my-12 glass-dark rounded-xl p-8 border-2 border-cyan-500/30">
        <h2 className="text-2xl font-bold gradient-text mb-4">Resources</h2>
        <ul className="space-y-2 text-slate-300">
          <li>✓ Complete source code examples</li>
          <li>✓ Interactive visualizations</li>
          <li>✓ Practice exercises</li>
          <li>✓ External references and links</li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="mt-12 flex gap-4">
        <Link href="/chapters" className="btn-secondary inline-block">
          ← Back to Chapters
        </Link>
        <Link href="/chapters" className="btn-primary inline-block">
          Next Chapter →
        </Link>
      </div>
    </article>
  )
}
