'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Question, PracticeMode, FREE_SESSION_LIMIT } from '@/types'
import { formatDuration } from '@/lib/utils'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import PaywallModal from '@/components/ui/PaywallModal'
import QuestionCard from './QuestionCard'
import ResultsView from './ResultsView'
import { Brain, ChevronLeft, Zap, CheckCircle } from 'lucide-react'
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

const MODES: { id: PracticeMode; label: string; desc: string; count: number; icon: string; color: string }[] = [
  { id: 'quick',        label: 'Quick Practice',      desc: '10 MCQs · ~15 min',            count: 10, icon: '⚡', color: 'from-violet-500 to-indigo-500' },
  { id: 'chapter_test', label: 'Chapter Test',         desc: 'MCQ + Short Answer · ~45 min',  count: 8,  icon: '📝', color: 'from-blue-500 to-indigo-500'   },
  { id: 'pyq',          label: 'Previous Year Style',  desc: 'CBSE board pattern · ~30 min',  count: 8,  icon: '📅', color: 'from-emerald-500 to-teal-500'  },
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
    try {
      await fetch('/api/practice/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classNum, subject, chapterId, chapterName, mode, questions, answers,
          score, totalMarks, timeTaken,
        }),
      })
    } catch {
      // Non-blocking
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
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-violet-600 mb-6 transition-colors font-medium group">
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Dashboard
      </Link>

      {/* Stage: Start */}
      {stage === 'start' && (
        <div className="animate-slide-up">
          <div className="bg-white rounded-3xl border border-violet-100/60 shadow-sm p-6 sm:p-8 mb-6">
            {/* Chapter header */}
            <div className="flex items-start gap-4 mb-7">
              <div className="w-14 h-14 bg-linear-to-br from-violet-600 to-indigo-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-violet-200">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-violet-600 uppercase tracking-wider mb-1">{subjectName} · Class {classNum}</div>
                <h1 className="text-xl font-bold text-slate-900 leading-tight">{chapterName}</h1>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {topics.slice(0, 4).map((t) => (
                    <span key={t} className="text-xs bg-violet-50 text-violet-600 px-2.5 py-0.5 rounded-full border border-violet-100 font-medium">{t}</span>
                  ))}
                  {topics.length > 4 && (
                    <span className="text-xs bg-slate-50 text-slate-500 px-2.5 py-0.5 rounded-full border border-slate-200">+{topics.length - 4} more</span>
                  )}
                </div>
              </div>
            </div>

            {/* Mode selection */}
            <div className="mb-7">
              <div className="text-sm font-bold text-slate-700 mb-3">Choose practice mode:</div>
              <div className="space-y-2.5">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                      mode === m.id
                        ? 'border-violet-400 bg-violet-50 shadow-sm shadow-violet-100'
                        : 'border-slate-200 bg-white hover:border-violet-200 hover:bg-violet-50/30'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-linear-to-br ${m.color} shrink-0 text-lg`}>
                      {m.icon}
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold text-sm ${mode === m.id ? 'text-violet-700' : 'text-slate-800'}`}>
                        {m.label}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{m.desc}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                      mode === m.id ? 'border-violet-600 bg-violet-600 scale-110' : 'border-slate-300'
                    }`}>
                      {mode === m.id && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5 animate-fade-in-fast">
                {error}
              </div>
            )}

            {isBlocked && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
                <Zap className="w-4 h-4 shrink-0" />
                You&apos;ve used all {FREE_SESSION_LIMIT} free sessions. Upgrade to continue.
              </div>
            )}

            <button
              onClick={startPractice}
              className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-2 text-base"
            >
              <Brain className="w-5 h-5" />
              Start {selectedMode.label}
            </button>
          </div>
        </div>
      )}

      {/* Stage: Loading */}
      {stage === 'loading' && (
        <div className="bg-white rounded-3xl border border-violet-100/60 shadow-sm p-14 animate-fade-in">
          <LoadingSpinner size="lg" message="Generating questions with AI… this may take a few seconds" className="py-8" />
        </div>
      )}

      {/* Stage: Practice */}
      {stage === 'practice' && questions.length > 0 && (
        <div className="animate-fade-in">
          {/* Progress header */}
          <div className="bg-white rounded-2xl border border-violet-100/60 shadow-sm p-4 mb-5 flex items-center gap-3">
            <div className="text-sm font-bold text-slate-700 shrink-0">
              {currentIndex + 1} / {questions.length}
            </div>
            <div className="flex-1">
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-violet-600 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-500 font-mono shrink-0">
              <CheckCircle className="w-3.5 h-3.5 text-violet-400" />
              {formatDuration(elapsedTime)}
            </div>
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
