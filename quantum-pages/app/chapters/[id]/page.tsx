'use client'

import { chapters } from '@/lib/chapters'
import ChapterContent from '@/components/ChapterContent'
import { useParams } from 'next/navigation'

export default function ChapterPage() {
  const params = useParams()
  const id = params?.id as string
  const chapter = chapters.find(c => c.id === id)

  if (!chapter) {
    return (
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl font-bold text-slate-300">Chapter not found</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <ChapterContent chapter={chapter} />
      </div>
    </div>
  )
}
