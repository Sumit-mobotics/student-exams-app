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
    if (percentage >= 90) return { label: 'Excellent!',       emoji: '🏆', color: 'text-emerald-600', barColor: 'bg-emerald-500' }
    if (percentage >= 70) return { label: 'Great job!',       emoji: '🌟', color: 'text-emerald-600', barColor: 'bg-emerald-500' }
    if (percentage >= 50) return { label: 'Good effort!',     emoji: '👍', color: 'text-amber-600',   barColor: 'bg-amber-500'   }
    if (percentage >= 35) return { label: 'Keep practising!', emoji: '📚', color: 'text-amber-600',   barColor: 'bg-amber-500'   }
    return                       { label: 'Needs more work',  emoji: '💪', color: 'text-red-600',     barColor: 'bg-red-500'     }
  }

  const grade = getGrade()

  const correctCount = questions.filter((q) => {
    const ans = answers[q.id]
    return q.type === 'mcq' ? ans?.charAt(0) === q.correct_answer : false
  }).length
  const wrongCount = questions.filter((q) => {
    const ans = answers[q.id]
    return q.type === 'mcq' ? (ans && ans.charAt(0) !== q.correct_answer) : false
  }).length

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Score card */}
      <div className="bg-white rounded-3xl border border-violet-100/60 shadow-sm p-7 sm:p-9 text-center">
        <div className="text-5xl mb-4 animate-float">{grade.emoji}</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">{grade.label}</h2>
        <p className="text-slate-400 text-sm mb-7">{chapterName}</p>

        {/* Score stats */}
        <div className="flex items-center justify-center gap-6 sm:gap-10 mb-7">
          <div>
            <div className={cn('text-4xl font-black', grade.color)}>{percentage}%</div>
            <div className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wide">Score</div>
          </div>
          <div className="w-px h-12 bg-slate-100" />
          <div>
            <div className="text-4xl font-black text-slate-800">{formatScore(score, totalMarks).split(' ')[0]}</div>
            <div className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wide">Marks</div>
          </div>
          <div className="w-px h-12 bg-slate-100" />
          <div>
            <div className="text-2xl font-bold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-5 h-5 text-slate-300" />
              {formatDuration(timeTaken)}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wide">Time</div>
          </div>
        </div>

        {/* Score progress bar */}
        <div className="max-w-xs mx-auto">
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all duration-1000', grade.barColor)}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-violet-100/60 p-4 text-center shadow-sm">
          <div className="text-2xl font-black text-emerald-600 mb-1">{correctCount}</div>
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Correct</div>
        </div>
        <div className="bg-white rounded-2xl border border-violet-100/60 p-4 text-center shadow-sm">
          <div className="text-2xl font-black text-red-500 mb-1">{wrongCount}</div>
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Wrong</div>
        </div>
        <div className="bg-white rounded-2xl border border-violet-100/60 p-4 text-center shadow-sm">
          <div className="text-2xl font-black text-slate-700 mb-1">{questions.length}</div>
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Total</div>
        </div>
      </div>

      {/* Review toggle */}
      <button
        onClick={() => setShowReview(!showReview)}
        className="w-full bg-white border border-violet-100/60 rounded-2xl px-5 py-3.5 flex items-center justify-between text-sm font-semibold text-slate-700 hover:bg-violet-50 hover:border-violet-200 transition-all shadow-sm"
      >
        <span>Review all questions</span>
        {showReview ? <ChevronUp className="w-4 h-4 text-violet-500" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {showReview && (
        <div className="space-y-3 animate-fade-in">
          {questions.map((q, i) => {
            const ans = answers[q.id]
            const isCorrect = q.type === 'mcq' ? ans?.charAt(0) === q.correct_answer : ans !== undefined
            return (
              <div key={q.id} className="bg-white rounded-2xl border border-violet-100/60 p-4 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                    isCorrect ? 'bg-emerald-100' : 'bg-red-50'
                  )}>
                    {isCorrect
                      ? <CheckCircle className="w-4 h-4 text-emerald-600" />
                      : <XCircle className="w-4 h-4 text-red-500" />}
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold mb-1">
                      Q{i + 1} · {q.marks} mark{q.marks > 1 ? 's' : ''}
                    </div>
                    <p className="text-sm text-slate-800 font-medium leading-relaxed">{q.question}</p>
                  </div>
                </div>
                {q.type === 'mcq' && (
                  <div className="ml-9 text-sm space-y-1">
                    {ans && (
                      <div className={cn('flex items-center gap-1.5', isCorrect ? 'text-emerald-700' : 'text-red-600')}>
                        <span className="text-xs font-semibold">Your answer:</span> {ans}
                      </div>
                    )}
                    {!isCorrect && (
                      <div className="flex items-center gap-1.5 text-emerald-700">
                        <span className="text-xs font-semibold">Correct:</span> {q.options?.find((o) => o.charAt(0) === q.correct_answer)}
                      </div>
                    )}
                    <div className="text-xs text-slate-400 mt-1.5 leading-relaxed">{q.explanation}</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 pb-4">
        <button
          onClick={onRetry}
          className="flex-1 flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 font-semibold py-3.5 rounded-2xl transition-all text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
        <Link
          href="/dashboard"
          className="flex-1 flex items-center justify-center gap-2 btn-primary py-3.5 rounded-2xl text-sm"
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>
      </div>
    </div>
  )
}
