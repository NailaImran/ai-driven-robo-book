# 🎨 Frontend Integration Guide - Phase 8

Complete guide for integrating the FastAPI backend with the quantum-pages frontend.

---

## Overview

After your backend is deployed on Railway, you need to:
1. ✅ Create AuthContext for state management
2. ✅ Update components to use the API
3. ✅ Connect LessonViewer to backend
4. ✅ Setup authentication flow
5. ✅ Deploy frontend to Vercel

---

## Prerequisites

Before starting, you need:
- [ ] Backend deployed on Railway
- [ ] Railway URL (e.g., https://your-app.railway.app)
- [ ] Database seeded with lessons
- [ ] API tested and working

If not done yet, complete `RAILWAY_DEPLOYMENT_STEPS.md` first.

---

## Step 1: Setup Environment Variables

### 1.1 Create `.env.local`

```bash
# quantum-pages/.env.local
NEXT_PUBLIC_API_URL=https://your-railway-url.railway.app
```

Replace `your-railway-url` with your actual Railway URL from deployment!

### 1.2 Verify API Access

```bash
# Test from your machine
curl https://your-railway-url.railway.app/health
# Should return: {"status":"healthy",...}
```

✅ **Status**: Environment configured

---

## Step 2: Create AuthContext

### 2.1 Create AuthContext Component

Create `quantum-pages/contexts/AuthContext.tsx`:

```typescript
'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { apiClient } from '@/lib/api-client'

export interface User {
  id: string
  email: string
  name: string
  expertise_level: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  signin: (email: string, password: string) => Promise<void>
  signup: (data: {
    email: string
    password: string
    name: string
    background: {
      python_experience: number
      cpp_experience: number
      ros_experience: number
      robotics_experience: number
      learning_goals: string[]
    }
  }) => Promise<void>
  signout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        if (!apiClient.isAuthenticated()) {
          setLoading(false)
          return
        }

        const session = await apiClient.getSession()
        if (session.authenticated && session.user) {
          setUser(session.user)
        } else {
          apiClient.clearToken()
        }
      } catch (err) {
        console.error('Session check failed:', err)
        apiClient.clearToken()
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const signin = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiClient.signin(email, password)
      setUser(result.user)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signup = async (data: {
    email: string
    password: string
    name: string
    background: {
      python_experience: number
      cpp_experience: number
      ros_experience: number
      robotics_experience: number
      learning_goals: string[]
    }
  }) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiClient.signup(data)
      setUser(result.user)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signout = () => {
    setUser(null)
    setError(null)
    apiClient.signout()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signin,
        signup,
        signout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

✅ **Status**: AuthContext created

### 2.2 Wrap Root Layout with AuthProvider

Update `quantum-pages/app/layout.tsx`:

```typescript
import type { Metadata } from 'next'
import '../styles/globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AnimatedBackground from '@/components/AnimatedBackground'
import { AuthProvider } from '@/contexts/AuthContext'

export const metadata: Metadata = {
  title: 'QuantumPages - Physical AI Textbook',
  description: 'Interactive platform for learning Physical AI, Robotics, and Advanced Physics concepts. Available in English and Urdu.',
  keywords: ['Physics', 'AI', 'Robotics', 'Education', 'Textbook'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white">
        <AuthProvider>
          <AnimatedBackground />
          <Navbar />
          <main className="relative z-10 min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
```

✅ **Status**: AuthProvider wrapped in layout

---

## Step 3: Update Navbar Component

Update `quantum-pages/components/Navbar.tsx` to show user info:

```typescript
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import LanguageSwitcher from './LanguageSwitcher'
import { useAuth } from '@/contexts/AuthContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signout } = useAuth()

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 glass-dark border-b border-slate-700/50 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 font-bold text-2xl group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold glow-cyan"
            >
              Q
            </motion.div>
            <span className="gradient-text">QuantumPages</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            {[
              { href: '/', label: 'Home' },
              { href: '/chapters', label: 'Chapters' },
              { href: '/about', label: 'About' },
            ].map((item) => (
              <motion.div
                key={item.href}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.href}
                  className="text-slate-300 hover:text-cyan-400 font-medium transition relative group"
                >
                  {item.label}
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            ))}

            <LanguageSwitcher />

            {/* User Menu */}
            {user ? (
              <div className="flex gap-4 items-center">
                <span className="text-cyan-400 text-sm">{user.name}</span>
                <button
                  onClick={signout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white text-sm transition"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden p-2 rounded-lg glass-dark"
          >
            <svg
              className="w-6 h-6 text-cyan-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={isOpen ? { height: 'auto' } : { height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="pb-4 border-t border-slate-700/50 space-y-2">
            {[
              { href: '/', label: 'Home' },
              { href: '/chapters', label: 'Chapters' },
              { href: '/about', label: 'About' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 text-slate-300 hover:text-cyan-400 hover:pl-2 transition"
              >
                {item.label}
              </Link>
            ))}
            {user && (
              <>
                <div className="py-2 text-cyan-400">{user.name}</div>
                <button
                  onClick={signout}
                  className="w-full text-left py-2 text-red-400 hover:text-red-300"
                >
                  Sign Out
                </button>
              </>
            )}
            <div className="py-2 border-t border-slate-700/50 mt-4 pt-4">
              <LanguageSwitcher />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}
```

✅ **Status**: Navbar updated with auth

---

## Step 4: Create Auth Pages

### 4.1 Create Sign In Page

Create `quantum-pages/app/auth/signin/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function SignIn() {
  const router = useRouter()
  const { signin, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')

    try {
      await signin(email, password)
      router.push('/chapters')
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Sign in failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-900/50 backdrop-blur border border-slate-700 rounded-lg p-8">
        <h1 className="text-3xl font-bold text-white mb-8 text-center gradient-text">
          Sign In
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              placeholder="••••••••"
            />
          </div>

          {(error || localError) && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded text-red-300 text-sm">
              {error || localError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 rounded-lg text-white font-medium transition"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-slate-400">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-cyan-400 hover:text-cyan-300">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
```

### 4.2 Create Sign Up Page

Create `quantum-pages/app/auth/signup/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function SignUp() {
  const router = useRouter()
  const { signup, loading, error } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    python_experience: 1,
    cpp_experience: 1,
    ros_experience: 1,
    robotics_experience: 1,
    learning_goals: '',
  })
  const [localError, setLocalError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')

    try {
      await signup({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        background: {
          python_experience: parseInt(formData.python_experience as any),
          cpp_experience: parseInt(formData.cpp_experience as any),
          ros_experience: parseInt(formData.ros_experience as any),
          robotics_experience: parseInt(formData.robotics_experience as any),
          learning_goals: formData.learning_goals
            .split(',')
            .map((g) => g.trim())
            .filter((g) => g),
        },
      })
      router.push('/chapters')
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Sign up failed')
    }
  }

  const experienceOptions = [
    { value: 1, label: 'None' },
    { value: 2, label: 'Beginner' },
    { value: 3, label: 'Intermediate' },
    { value: 4, label: 'Advanced' },
    { value: 5, label: 'Expert' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-slate-900/50 backdrop-blur border border-slate-700 rounded-lg p-8">
        <h1 className="text-3xl font-bold text-white mb-8 text-center gradient-text">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              placeholder="••••••••"
            />
          </div>

          {/* Experience */}
          <div className="border-t border-slate-700 pt-4">
            <h3 className="text-sm font-medium text-slate-300 mb-3">Your Experience</h3>

            <div className="space-y-3">
              {['python_experience', 'cpp_experience', 'ros_experience', 'robotics_experience'].map(
                (field) => (
                  <div key={field}>
                    <label className="block text-xs text-slate-400 mb-1">
                      {field.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </label>
                    <select
                      name={field}
                      value={formData[field as keyof typeof formData]}
                      onChange={handleChange}
                      className="w-full px-3 py-1 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:outline-none focus:border-cyan-400"
                    >
                      {experienceOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Learning Goals */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Learning Goals (comma-separated)
            </label>
            <textarea
              name="learning_goals"
              value={formData.learning_goals}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 resize-none"
              placeholder="e.g., Learn ROS2, Build robots, Master control theory"
              rows={2}
            />
          </div>

          {(error || localError) && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded text-red-300 text-sm">
              {error || localError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 rounded-lg text-white font-medium transition"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-slate-400">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-cyan-400 hover:text-cyan-300">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
```

✅ **Status**: Auth pages created

---

## Step 5: Update LessonViewer Component

Update `quantum-pages/components/LessonViewer.tsx` to fetch from backend:

```typescript
'use client'

import { useState } from 'react'
import { apiClient } from '@/lib/api-client'
import { useAuth } from '@/contexts/AuthContext'

interface LessonViewerProps {
  chapterId: string
  lessonNumber: number
}

export default function LessonViewer({ chapterId, lessonNumber }: LessonViewerProps) {
  const { user } = useAuth()
  const [isExpanded, setIsExpanded] = useState(false)
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [title, setTitle] = useState(`Lesson ${lessonNumber}`)

  const lessonId = `chapter-${chapterId}-lesson-${lessonNumber}`

  const handleExpandClick = async () => {
    if (!isExpanded && !content && user) {
      // Fetching content
      setLoading(true)
      setStartTime(Date.now())

      try {
        const data = await apiClient.getLesson(lessonId)
        setContent(data.content_markdown)
        setTitle(data.lesson.title)
      } catch (error) {
        console.error('Error loading lesson:', error)
        setContent('Error loading lesson. Please try again.')
      } finally {
        setLoading(false)
      }
    } else if (isExpanded && startTime && user) {
      // Marking as complete
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)

      try {
        await apiClient.markLessonComplete(lessonId, timeSpent)
        console.log('Lesson marked as complete')
      } catch (error) {
        console.error('Error marking lesson complete:', error)
      }
    }

    setIsExpanded(!isExpanded)
  }

  if (!user) {
    return (
      <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
        <p className="text-slate-300">Please sign in to view lessons.</p>
      </div>
    )
  }

  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={handleExpandClick}
        className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-750 text-left font-semibold text-white flex justify-between items-center transition"
      >
        <span>{title}</span>
        <span className="text-cyan-400">
          {loading ? '⏳' : isExpanded ? '▼' : '▶'}
        </span>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 bg-slate-900/50 text-slate-300">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin">⌛</div>
              <span>Loading lesson...</span>
            </div>
          ) : content ? (
            <div className="prose prose-invert max-w-none prose-code:bg-slate-800">
              {/* Render markdown content */}
              <div
                dangerouslySetInnerHTML={{
                  __html: content.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
                }}
              />
            </div>
          ) : (
            <p>No content available</p>
          )}
        </div>
      )}
    </div>
  )
}
```

✅ **Status**: LessonViewer updated

---

## Step 6: Create Protected Route Component

Create `quantum-pages/components/ProtectedRoute.tsx`:

```typescript
'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
```

✅ **Status**: Protected routes ready

---

## Step 7: Update Chapters Page

Wrap `quantum-pages/app/chapters/page.tsx` with ProtectedRoute:

```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute'
import ChapterGrid from '@/components/ChapterGrid'

export default function ChaptersPage() {
  return (
    <ProtectedRoute>
      <ChapterGrid />
    </ProtectedRoute>
  )
}
```

✅ **Status**: Pages protected

---

## Step 8: Test Frontend Integration

### 8.1 Start Frontend Development Server

```bash
cd quantum-pages
npm run dev
```

### 8.2 Test Signup Flow

1. Go to http://localhost:3000
2. Click "Sign In" button in navbar
3. Go to "Sign up" page
4. Fill in:
   - **Name**: Test User
   - **Email**: test@example.com
   - **Password**: TestPassword123!
   - **Experience**: Select levels
   - **Learning Goals**: Learn ROS2, Build robots
5. Click "Sign Up"
6. Should redirect to `/chapters`

### 8.3 Test Lesson Loading

1. You should now be signed in
2. Go to Chapters page
3. Click on a chapter
4. Try to expand a lesson
5. Should load content from backend!

### 8.4 Test Sign Out

1. Click your name in navbar
2. Click "Sign Out"
3. Should redirect to home page
4. Try accessing chapters without signing in - should redirect to signin

✅ **Status**: Frontend integration working!

---

## Step 9: Deploy to Vercel

### 9.1 Prepare for Deployment

```bash
# Make sure .env.local is in .gitignore
echo ".env.local" >> quantum-pages/.gitignore

# Commit changes
git add .
git commit -m "feat: Add frontend authentication and API integration

- Create AuthContext for state management
- Add Sign In and Sign Up pages
- Update components to use backend API
- Update LessonViewer to fetch from backend
- Add protected routes
- Connect frontend to Railway backend"

git push origin main
```

### 9.2 Deploy to Vercel

**Via Vercel Dashboard:**
1. Go to https://vercel.com/dashboard
2. Select "quantum-pages" project (if already connected)
3. Click "Deploy"
4. Add environment variable:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-railway-url.railway.app`
5. Click "Deploy"

**Or via CLI:**
```bash
npm i -g vercel
cd quantum-pages
vercel env add NEXT_PUBLIC_API_URL
# Enter your Railway URL
vercel
```

### 9.3 Verify Deployment

1. Wait for deployment to complete
2. Go to https://your-project.vercel.app
3. Try signing up
4. Verify lessons load
5. Check console for any errors

✅ **Status**: Frontend deployed!

---

## Troubleshooting

### "Failed to fetch" when signing up
- [ ] Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
- [ ] Verify Railway backend is still running
- [ ] Check CORS configuration in Railway
- [ ] Check browser console for errors

### Blank page on chapters
- [ ] Make sure you're signed in
- [ ] Check browser console for errors
- [ ] Verify API URL is correct
- [ ] Test API directly: `curl https://your-api.railway.app/health`

### "useAuth must be used within AuthProvider"
- [ ] Ensure root layout wraps with `<AuthProvider>`
- [ ] Check component is client-side (`'use client'`)

### Can't sign in
- [ ] Verify user was created during signup
- [ ] Check Railway logs: `railway logs`
- [ ] Test API: `curl -X POST https://your-api/auth/signin ...`

---

## Testing Checklist

- [ ] Frontend starts without errors
- [ ] Can see sign up page
- [ ] Can create account
- [ ] Can sign in
- [ ] Lessons load from backend
- [ ] Can mark lessons complete
- [ ] Can sign out
- [ ] Protected routes work
- [ ] Deployed to Vercel successfully
- [ ] Works on mobile

---

## Summary

✅ **Frontend is now fully integrated with backend!**

**What you have:**
- ✅ AuthContext for state management
- ✅ Sign In and Sign Up pages
- ✅ Protected routes
- ✅ LessonViewer fetching from backend
- ✅ Progress tracking
- ✅ Navbar showing user info
- ✅ Frontend deployed to Vercel
- ✅ Backend deployed to Railway

**Next:**
- Monitor logs in Railway and Vercel
- Test all features
- Gather feedback
- Iterate and improve

---

**Congratulations! Your personalized learning platform is now live! 🎉**
