'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Question, PracticeMode, FREE_SESSION_LIMIT } from '@/types'
import { formatDuration } from '@/lib/utils'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import PaywallModal from '@/components/ui/PaywallModal'
import QuestionCard from './QuestionCard'
import ResultsView from './ResultsView'
import { Brain, ChevronLeft, Zap } from 'lucide-react'
import Link from 'next/link'

interface Props {
  classNum: number
  subject: string
  subjectName: string
  chapterId: number
  chapterName: string
  topics: string[]
  sessionsUsed: number
  isPremium: boolean
}

type Stage = 'start' | 'loading' | 'practice' | 'results'

const MODES: { id: PracticeMode; label: string; desc: string; count: number; icon: string }[] = [
  { id: 'quick', label: 'Quick Practice', desc: '10 MCQs · ~15 min', count: 10, icon: '⚡' },
  { id: 'chapter_test', label: 'Chapter Test', desc: 'MCQ + Short Answer · ~45 min', count: 8, icon: '📝' },
  { id: 'pyq', label: 'Previous Year Style', desc: 'CBSE board pattern · ~30 min', count: 8, icon: '📅' },
]

export default function PracticeSession({
  classNum, subject, subjectName, chapterId, chapterName, topics, sessionsUsed, isPremium,
}: Props) {
  const router = useRouter()
  const [stage, setStage] = useState<Stage>('start')
  const [mode, setMode] = useState<PracticeMode>('quick')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [score, setScore] = useState(0)
  const [totalMarks, setTotalMarks] = useState(0)
  const [startTime, setStartTime] = useState<number>(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [error, setError] = useState('')
  const [showPaywall, setShowPaywall] = useState(false)

  const isBlocked = !isPremium && sessionsUsed >= FREE_SESSION_LIMIT

  // Timer
  useEffect(() => {
    if (stage !== 'practice') return
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [stage, startTime])

  const startPractice = useCallback(async () => {
    if (isBlocked) { setShowPaywall(true); return }

    setStage('loading')
    setError('')

    try {
      const res = await fetch('/api/questions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classNum, subject, chapterId, topics, mode }),
      })

      const data = await res.json()
      if (!res.ok) {
        if (res.status === 403) { setShowPaywall(true); setStage('start'); return }
        throw new Error(data.error || 'Failed to generate questions')
      }

      setQuestions(data.questions)
      setCurrentIndex(0)
      setAnswers({})
      setScore(0)
      setTotalMarks(data.questions.reduce((sum: number, q: Question) => sum + q.marks, 0))
      setStartTime(Date.now())
      setElapsedTime(0)
      setStage('practice')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStage('start')
    }
  }, [isBlocked, classNum, subject, chapterId, topics, mode])

  async function handleAnswer(questionId: string, answer: string, isCorrect: boolean, marks: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
    if (isCorrect) setScore((prev) => prev + marks)
  }

  async function handleFinish() {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000)

    // Save session to DB
    try {
      await fetch('/api/practice/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classNum, subject, chapterId,
          chapterName, mode, questions, answers,
          score, totalMarks, timeTaken,
        }),
      })
    } catch {
      // Non-blocking — don't show error to user
    }

    setElapsedTime(timeTaken)
    setStage('results')
  }

  function handleRetry() {
    setStage('start')
    setQuestions([])
    setAnswers({})
    setScore(0)
  }

  const selectedMode = MODES.find((m) => m.id === mode)!

  return (
    <div className="max-w-3xl mx-auto">
      {showPaywall && (
        <PaywallModal
          onClose={() => setShowPaywall(false)}
          sessionsUsed={sessionsUsed}
          freeLimit={FREE_SESSION_LIMIT}
        />
      )}

      {/* Back link */}
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Stage: Start */}
      {stage === 'start' && (
        <div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-indigo-600 mb-1">{subjectName} · Class {classNum}</div>
                <h1 className="text-xl font-bold text-slate-900">{chapterName}</h1>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {topics.slice(0, 4).map((t) => (
                    <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                  {topics.length > 4 && (
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">+{topics.length - 4} more</span>
                  )}
                </div>
              </div>
            </div>

            {/* Mode selection */}
            <div className="mb-6">
              <div className="text-sm font-medium text-slate-700 mb-3">Choose practice mode:</div>
              <div className="space-y-2">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${
                      mode === m.id
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-slate-200 bg-white hover:border-indigo-300'
                    }`}
                  >
                    <span className="text-xl">{m.icon}</span>
                    <div className="flex-1">
                      <div className={`font-medium text-sm ${mode === m.id ? 'text-indigo-700' : 'text-slate-900'}`}>
                        {m.label}
                      </div>
                      <div className="text-xs text-slate-500">{m.desc}</div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${mode === m.id ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {isBlocked && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 flex-shrink-0" />
                You&apos;ve used all {FREE_SESSION_LIMIT} free sessions. Upgrade to continue.
              </div>
            )}

            <button
              onClick={startPractice}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Brain className="w-5 h-5" />
              Start {selectedMode.label}
            </button>
          </div>
        </div>
      )}

      {/* Stage: Loading */}
      {stage === 'loading' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12">
          <LoadingSpinner size="lg" message="Generating questions with AI... this may take a few seconds" className="py-8" />
        </div>
      )}

      {/* Stage: Practice */}
      {stage === 'practice' && questions.length > 0 && (
        <div>
          {/* Progress header */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-4 flex items-center justify-between">
            <div className="text-sm font-medium text-slate-700">
              Question {currentIndex + 1} of {questions.length}
            </div>
            <div className="flex-1 mx-4">
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="text-sm text-slate-500 font-mono">{formatDuration(elapsedTime)}</div>
          </div>

          <QuestionCard
            key={questions[currentIndex].id}
            question={questions[currentIndex]}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
            onNext={() => {
              if (currentIndex < questions.length - 1) {
                setCurrentIndex((i) => i + 1)
              } else {
                handleFinish()
              }
            }}
            isLast={currentIndex === questions.length - 1}
          />
        </div>
      )}

      {/* Stage: Results */}
      {stage === 'results' && (
        <ResultsView
          questions={questions}
          answers={answers}
          score={score}
          totalMarks={totalMarks}
          timeTaken={elapsedTime}
          chapterName={chapterName}
          onRetry={handleRetry}
        />
      )}
    </div>
  )
}
