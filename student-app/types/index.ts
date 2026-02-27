export interface UserProfile {
  id: string
  email: string
  full_name: string
  class: 9 | 10 | 11 | 12
  subjects: string[]
  sessions_used: number
  is_premium: boolean
  premium_expires_at: string | null
  created_at: string
}

export interface Question {
  id: string
  type: 'mcq' | 'short_answer' | 'long_answer'
  question: string
  options?: string[]
  correct_answer: string
  explanation: string
  marks: number
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface PracticeSession {
  id: string
  user_id: string
  subject: string
  chapter: string
  class: number
  questions: Question[]
  answers: Record<string, string>
  score: number
  total_marks: number
  completed_at: string
}

export interface ChapterInfo {
  id: number
  name: string
  topics: string[]
}

export interface SubjectInfo {
  name: string
  chapters: ChapterInfo[]
}

export type PracticeMode = 'quick' | 'chapter_test' | 'pyq' | 'sample_paper'

export interface PaperQuestion {
  id: string
  type: 'mcq' | 'short_answer' | 'long_answer'
  question: string
  options?: string[]
  correct_answer: string
  explanation: string
  marks: number
  chapter_reference?: string
}

export interface PaperSection {
  name: string
  description: string
  questions: PaperQuestion[]
}

export interface ExamPaper {
  classNum: number
  subjectName: string
  totalMarks: number
  duration: string
  sections: PaperSection[]
}

export interface GenerateQuestionsRequest {
  classNum: number
  subject: string
  chapter: string
  topics: string[]
  count: number
  mode: PracticeMode
}

export interface Plan {
  id: string
  name: string
  price: number
  duration: string
  features: string[]
  popular?: boolean
}

export const PLANS: Plan[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: 99,
    duration: '1 month',
    features: [
      'Unlimited practice sessions',
      'All subjects & chapters',
      'AI-powered questions',
      'Previous year style questions',
      'Sample papers',
      'Progress tracking',
    ],
  },
  {
    id: 'half_yearly',
    name: '6 Months',
    price: 499,
    duration: '6 months',
    popular: true,
    features: [
      'Everything in Monthly',
      'Save 16% vs monthly',
      'Detailed analytics',
      'Performance reports',
    ],
  },
  {
    id: 'annual',
    name: 'Annual',
    price: 799,
    duration: '1 year',
    features: [
      'Everything in 6 Months',
      'Save 33% vs monthly',
      'Priority support',
      'Exam strategy guides',
    ],
  },
]

export const FREE_SESSION_LIMIT = 3
