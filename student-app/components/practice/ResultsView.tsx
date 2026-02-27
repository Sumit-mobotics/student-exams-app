'use client'

import { useState } from 'react'
import { Question } from '@/types'
import { formatDuration, formatScore, getScoreColor, getScoreBg } from '@/lib/utils'
import { Trophy, Clock, RefreshCw, LayoutDashboard, ChevronDown, ChevronUp, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Props {
  questions: Question[]
  answers: Record<string, string>
  score: number
  totalMarks: number
  timeTaken: number
  chapterName: string
  onRetry: () => void
}

export default function ResultsView({ questions, answers, score, totalMarks, timeTaken, chapterName, onRetry }: Props) {
  const [showReview, setShowReview] = useState(false)
  const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0

  const getGrade = () => {
    if (percentage >= 90) return { label: 'Excellent!', emoji: '🏆' }
    if (percentage >= 70) return { label: 'Great job!', emoji: '🌟' }
    if (percentage >= 50) return { label: 'Good effort!', emoji: '👍' }
    if (percentage >= 35) return { label: 'Keep practising!', emoji: '📚' }
    return { label: 'Needs more work', emoji: '💪' }
  }

  const grade = getGrade()

  return (
    <div className="space-y-4">
      {/* Score card */}
      <div className={cn('bg-white rounded-2xl border-2 shadow-sm p-6 sm:p-8 text-center', getScoreBg(score, totalMarks))}>
        <div className="text-4xl mb-3">{grade.emoji}</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">{grade.label}</h2>
        <p className="text-slate-600 text-sm mb-6">{chapterName}</p>

        <div className="flex items-center justify-center gap-8 mb-6">
          <div>
            <div className={cn('text-4xl font-bold', getScoreColor(score, totalMarks))}>
              {percentage}%
            </div>
            <div className="text-sm text-slate-500 mt-1">Score</div>
          </div>
          <div className="w-px h-12 bg-slate-200" />
          <div>
            <div className="text-4xl font-bold text-slate-900">{formatScore(score, totalMarks).split(' ')[0]}</div>
            <div className="text-sm text-slate-500 mt-1">Marks</div>
          </div>
          <div className="w-px h-12 bg-slate-200" />
          <div>
            <div className="text-4xl font-bold text-slate-900 flex items-center gap-1">
              <Clock className="w-7 h-7 text-slate-400" />
              <span className="text-2xl">{formatDuration(timeTaken)}</span>
            </div>
            <div className="text-sm text-slate-500 mt-1">Time</div>
          </div>
        </div>

        {/* Score bar */}
        <div className="h-3 bg-slate-200 rounded-full overflow-hidden max-w-xs mx-auto">
          <div
            className={cn('h-full rounded-full transition-all', percentage >= 70 ? 'bg-emerald-500' : percentage >= 40 ? 'bg-amber-500' : 'bg-red-500')}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
          <div className="text-lg font-bold text-emerald-600">
            {questions.filter((q) => {
              const ans = answers[q.id]
              if (q.type === 'mcq') return ans?.charAt(0) === q.correct_answer
              return false
            }).length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Correct</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
          <div className="text-lg font-bold text-red-500">
            {questions.filter((q) => {
              const ans = answers[q.id]
              if (q.type === 'mcq') return ans && ans.charAt(0) !== q.correct_answer
              return false
            }).length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Wrong</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
          <div className="text-lg font-bold text-slate-600">{questions.length}</div>
          <div className="text-xs text-slate-500 mt-0.5">Total</div>
        </div>
      </div>

      {/* Review toggle */}
      <button
        onClick={() => setShowReview(!showReview)}
        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <span>Review all questions</span>
        {showReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {showReview && (
        <div className="space-y-3">
          {questions.map((q, i) => {
            const ans = answers[q.id]
            const isCorrect = q.type === 'mcq' ? ans?.charAt(0) === q.correct_answer : ans !== undefined
            return (
              <div key={q.id} className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-start gap-3 mb-3">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Q{i + 1} · {q.marks} mark{q.marks > 1 ? 's' : ''}</div>
                    <p className="text-sm text-slate-800 font-medium leading-relaxed">{q.question}</p>
                  </div>
                </div>
                {q.type === 'mcq' && (
                  <div className="ml-8 text-sm space-y-1">
                    {ans && (
                      <div className={cn('flex items-center gap-1.5', isCorrect ? 'text-emerald-700' : 'text-red-700')}>
                        <span className="font-medium">Your answer:</span> {ans}
                      </div>
                    )}
                    {!isCorrect && (
                      <div className="flex items-center gap-1.5 text-emerald-700">
                        <span className="font-medium">Correct:</span> {q.options?.find((o) => o.charAt(0) === q.correct_answer)}
                      </div>
                    )}
                    <div className="text-slate-500 text-xs mt-1">{q.explanation}</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={onRetry}
          className="flex-1 flex items-center justify-center gap-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium py-3 rounded-xl transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
        <Link
          href="/dashboard"
          className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>
      </div>
    </div>
  )
}
