'use client'

import { useState } from 'react'
import Link from 'next/link'

interface LessonViewerProps {
  chapterId: string
  lessonNumber: number
  title: string
  description: string
}

export default function LessonViewer({
  chapterId,
  lessonNumber,
  title,
  description
}: LessonViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleExpandClick = async () => {
    if (!isExpanded && !content) {
      setLoading(true)
      try {
        // Map chapter and lesson to actual markdown files
        const fileMapping: Record<string, Record<number, string>> = {
          'chapter-1': {
            1: 'chapter-1/1-1-intro-to-physical-ai',
            2: 'chapter-1/1-2-embodied-intelligence',
            3: 'chapter-1/1-3-hardware-landscape',
            4: 'chapter-1/1-4-lab-setup-guide',
            5: 'chapter-1/quiz'
          },
          'chapter-2': {
            1: 'chapter-2/lesson-2-1-ros2-fundamentals',
            2: 'chapter-2/lesson-2-2-urdf-modeling',
            3: 'chapter-2/lesson-2-3-control-theory',
            4: 'chapter-2/lesson-2-4-deployment',
            5: 'chapter-2/chapter-2-index',
            6: 'chapter-2/chapter-2-index'
          },
          'chapter-3': {
            1: 'chapter-3/lesson-3-1-gazebo',
            2: 'chapter-3/lesson-3-2-computer-vision',
            3: 'chapter-3/lesson-3-3-machine-learning',
            4: 'chapter-3/lesson-3-4-advanced-simulation',
            5: 'chapter-3/lesson-3-5-real-world-testing',
            6: 'chapter-3/chapter-3-index',
            7: 'chapter-3/chapter-3-index'
          },
          'chapter-4': {
            1: 'chapter-4/lesson-4-1-ml-fundamentals',
            2: 'chapter-4/lesson-4-2-neural-networks',
            3: 'chapter-4/lesson-4-3-reinforcement-learning',
            4: 'chapter-4/lesson-4-4-transfer-learning',
            5: 'chapter-4/lesson-4-5-learning-from-demos',
            6: 'chapter-4/chapter-4-index'
          },
          'chapter-5': {
            1: 'chapter-5/lesson-5-1-sensors',
            2: 'chapter-5/lesson-5-2-vision',
            3: 'chapter-5/lesson-5-3-sensor-fusion',
            4: 'chapter-5/lesson-5-4-proprioception',
            5: 'chapter-5/chapter-5-index'
          },
          'chapter-6': {
            1: 'chapter-6/lesson-6-1-real-world-apps',
            2: 'chapter-6/lesson-6-2-industrial-robotics',
            3: 'chapter-6/lesson-6-3-healthcare',
            4: 'chapter-6/chapter-6-index'
          }
        }

        const filePath = fileMapping[chapterId]?.[lessonNumber]

        if (filePath) {
          // In a real app, this would fetch from the actual markdown files
          // For now, we'll show a placeholder with links to the content
          const fullContent = `
# ${title}

## Overview
${description}

### Key Sections
- Core Concepts & Theory
- Practical Applications & Examples
- Hands-On Exercises & Labs
- Real-World Case Studies
- Assessment & Practice Problems

### Learning Objectives
After completing this lesson, you will be able to:
✓ Understand the fundamental concepts
✓ Apply knowledge to practical scenarios
✓ Implement solutions in real-world contexts
✓ Analyze complex problems in this domain
✓ Design systems using learned principles

### Resources
This lesson content is sourced from the comprehensive Physical AI Textbook.

**To view the full detailed content:**
- Visit the Physical AI Textbook at: https://physical-ai-textbook.readthedocs.io
- Explore the Docusaurus documentation for this chapter
- Access hands-on code examples and interactive demos

### Related Topics
- Previous lessons provide foundational context
- Next lessons build upon these concepts
- Cross-references to other chapters available in the full textbook

**File Reference:** docs/${filePath}.md
          `
          setContent(fullContent.trim())
        }
      } catch (error) {
        console.error('Error loading content:', error)
        setContent('Failed to load lesson content. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    setIsExpanded(!isExpanded)
  }

  return (
    <div>
      <button
        onClick={handleExpandClick}
        className="w-full text-left glass-dark rounded-lg p-6 border border-slate-700/50 hover:border-cyan-500/50 hover:bg-slate-800/50 transition cursor-pointer group"
      >
        <h3 className="text-lg font-semibold gradient-text mb-2 group-hover:text-cyan-300">
          Lesson {lessonNumber}: {title}
        </h3>
        <p className="text-slate-300 group-hover:text-slate-200 transition">
          {description}
        </p>
        <div className="mt-3 text-cyan-400 text-sm group-hover:translate-x-1 transition-transform">
          {isExpanded ? '▼ Hide full content' : '▶ Click to view full lesson →'}
        </div>
      </button>

      {isExpanded && (
        <div className="mt-3 glass-dark rounded-lg p-8 border border-cyan-500/30 border-t-0 rounded-t-none max-h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-slate-400">Loading lesson content...</p>
            </div>
          ) : (
            <>
              <div className="prose prose-invert max-w-none">
                <div className="text-slate-300 space-y-4">
                  {content.split('\n\n').map((paragraph, idx) => {
                    if (paragraph.startsWith('#')) {
                      const level = paragraph.match(/^#+/)?.[0].length || 1
                      const text = paragraph.replace(/^#+\s+/, '')
                      const HeadingTag = `h${Math.min(level + 1, 6)}` as keyof JSX.IntrinsicElements
                      return (
                        <HeadingTag
                          key={idx}
                          className={`font-bold mb-3 ${
                            level === 1 ? 'text-2xl text-cyan-400' :
                            level === 2 ? 'text-xl text-cyan-300' :
                            'text-lg text-slate-200'
                          }`}
                        >
                          {text}
                        </HeadingTag>
                      )
                    }
                    if (paragraph.startsWith('-')) {
                      return (
                        <ul key={idx} className="list-disc list-inside space-y-1 ml-2">
                          {paragraph.split('\n').map((item, i) => (
                            <li key={i} className="text-slate-300">
                              {item.replace(/^-\s+/, '')}
                            </li>
                          ))}
                        </ul>
                      )
                    }
                    if (paragraph.startsWith('✓')) {
                      return (
                        <div key={idx} className="space-y-1 ml-2">
                          {paragraph.split('\n').map((item, i) => (
                            <div key={i} className="text-slate-300">
                              {item}
                            </div>
                          ))}
                        </div>
                      )
                    }
                    return (
                      <p key={idx} className="text-slate-300 leading-relaxed">
                        {paragraph}
                      </p>
                    )
                  })}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-700/50">
                <a
                  href="https://github.com/quantum-pages/quantum-pages"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition"
                >
                  📚 View on GitHub →
                </a>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
