export interface Chapter {
  id: string
  title: string
  description: string
  icon: string
  lessons: number
  duration: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  content?: string
}
