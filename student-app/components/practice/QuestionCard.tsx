'use client'

import { useState } from 'react'
import { Question } from '@/types'
import { CheckCircle, XCircle, ChevronRight, AlertCircle, PenLine, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  question: Question
  questionNumber: number
  totalQuestions: number
  onAnswer: (questionId: string, answer: string, isCorrect: boolean, marks: number) => void
  onNext: () => void
  isLast: boolean
}

const TYPE_CONFIG = {
  mcq: {
    label: 'MCQ',
    color: 'bg-violet-100 text-violet-700 border-violet-200',
    icon: null,
    placeholder: '',
    rows: 0,
    hint: '',
  },
  short_answer: {
    label: 'Short Answer',
    color: 'bg-sky-100 text-sky-700 border-sky-200',
    icon: PenLine,
    placeholder: 'Write your answer in 2–4 sentences...',
    rows: 4,
    hint: 'Expected: 2–4 sentences · Focus on key points',
  },
  long_answer: {
    label: 'Long Answer',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    icon: BookOpen,
    placeholder: 'Write a detailed answer with explanations and examples...',
    rows: 8,
    hint: 'Expected: detailed paragraphs · Include examples where relevant',
  },
}

const DIFFICULTY_CONFIG = {
  easy:   { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  medium: { color: 'bg-amber-100 text-amber-700 border-amber-200',       dot: 'bg-amber-500'   },
  hard:   { color: 'bg-red-100 text-red-700 border-red-200',             dot: 'bg-red-500'     },
}

export default function QuestionCard({ question, questionNumber, totalQuestions, onAnswer, onNext, isLast }: Props) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [subjectiveAnswer, setSubjectiveAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [selfGrade, setSelfGrade] = useState<boolean | null>(null)

  const isMCQ = question.type === 'mcq'
  const config = TYPE_CONFIG[question.type]
  const diffConfig = DIFFICULTY_CONFIG[question.difficulty] ?? DIFFICULTY_CONFIG.medium

  function handleMCQSelect(option: string) {
    if (submitted) return
    setSelectedOption(option)
  }

  function handleMCQSubmit() {
    if (!selectedOption) return
    const optionLetter = selectedOption.charAt(0)
    const isCorrect = optionLetter === question.correct_answer
    onAnswer(question.id, selectedOption, isCorrect, question.marks)
    setSubmitted(true)
  }

  function handleSubjectiveSubmit() {
    if (!subjectiveAnswer.trim()) return
    setSubmitted(true)
    onAnswer(question.id, subjectiveAnswer, false, 0)
  }

  function handleSelfGrade(got: boolean) {
    setSelfGrade(got)
    onAnswer(question.id, subjectiveAnswer, got, got ? question.marks : 0)
  }

  return (
    <div className="bg-white rounded-3xl border border-violet-100/60 shadow-sm overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-slate-400">Q{questionNumber}</span>
          <span className={cn('text-xs font-bold px-2.5 py-0.5 rounded-full border', config.color)}>
            {config.label}
          </span>
          <span className={cn('text-xs font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1', diffConfig.color)}>
            <span className={cn('w-1.5 h-1.5 rounded-full', diffConfig.dot)} />
            {question.difficulty}
          </span>
        </div>
        <div className="text-sm font-bold text-slate-700 shrink-0 bg-slate-50 px-3 py-1 rounded-full">
          {question.marks} mark{question.marks > 1 ? 's' : ''}
        </div>
      </div>

      {/* Question text */}
      <div className="px-6 py-5">
        <p className="text-slate-800 leading-relaxed font-medium">{question.question}</p>
        {!isMCQ && config.hint && !submitted && (
          <p className="mt-2 text-xs text-slate-400 italic">{config.hint}</p>
        )}
      </div>

      {/* MCQ Options */}
      {isMCQ && question.options && (
        <div className="px-6 pb-5 space-y-2.5">
          {question.options.map((option) => {
            const letter = option.charAt(0)
            const isSelected = selectedOption?.charAt(0) === letter
            const isCorrect = submitted && letter === question.correct_answer
            const isWrong = submitted && isSelected && letter !== question.correct_answer

            return (
              <button
                key={option}
                onClick={() => handleMCQSelect(option)}
                disabled={submitted}
                className={cn(
                  'w-full text-left px-4 py-3.5 rounded-2xl border-2 transition-all text-sm leading-relaxed',
                  !submitted && !isSelected && 'border-slate-100 bg-slate-50/50 hover:border-violet-300 hover:bg-violet-50',
                  !submitted && isSelected && 'border-violet-500 bg-violet-50 shadow-sm shadow-violet-100',
                  isCorrect && 'border-emerald-400 bg-emerald-50',
                  isWrong && 'border-red-400 bg-red-50',
                  submitted && !isSelected && !isCorrect && 'border-slate-100 opacity-40',
                )}
              >
                <div className="flex items-start gap-3">
                  <span className={cn(
                    'shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all',
                    !submitted && isSelected  ? 'border-violet-600 bg-violet-600 text-white' : '',
                    !submitted && !isSelected ? 'border-slate-300 text-slate-500' : '',
                    isCorrect ? 'border-emerald-500 bg-emerald-500 text-white' : '',
                    isWrong   ? 'border-red-400 bg-red-400 text-white' : '',
                    submitted && !isSelected && !isCorrect ? 'border-slate-200 text-slate-300' : '',
                  )}>
                    {isCorrect ? '✓' : isWrong ? '✗' : letter}
                  </span>
                  <span className={cn(
                    'flex-1',
                    isCorrect ? 'text-emerald-800 font-medium' : isWrong ? 'text-red-800' : 'text-slate-700'
                  )}>
                    {option.slice(3)}
                  </span>
                </div>
              </button>
            )
          })}

          {!submitted && (
            <button
              onClick={handleMCQSubmit}
              disabled={!selectedOption}
              className="mt-1 w-full btn-primary disabled:opacity-40 py-3 rounded-2xl text-sm"
            >
              Submit Answer
            </button>
          )}

          {submitted && (
            <div className={cn(
              'mt-2 p-4 rounded-2xl border',
              selectedOption?.charAt(0) === question.correct_answer
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-red-50 border-red-200'
            )}>
              <div className="flex items-center gap-2 mb-2">
                {selectedOption?.charAt(0) === question.correct_answer ? (
                  <><CheckCircle className="w-4 h-4 text-emerald-600" /><span className="text-sm font-bold text-emerald-700">Correct!</span></>
                ) : (
                  <><XCircle className="w-4 h-4 text-red-500" /><span className="text-sm font-bold text-red-600">Incorrect</span></>
                )}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{question.explanation}</p>
            </div>
          )}
        </div>
      )}

      {/* Short / Long Answer */}
      {!isMCQ && (
        <div className="px-6 pb-5">
          {!submitted ? (
            <>
              <div className={cn(
                'flex items-center gap-2 px-3.5 py-2.5 rounded-xl mb-3 text-xs font-semibold border',
                question.type === 'short_answer'
                  ? 'bg-sky-50 text-sky-700 border-sky-200'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              )}>
                {config.icon && <config.icon className="w-3.5 h-3.5 shrink-0" />}
                {question.type === 'short_answer'
                  ? 'Write a concise answer covering the key points.'
                  : 'Write a detailed answer with explanations, examples, and diagrams if needed.'}
              </div>

              <textarea
                value={subjectiveAnswer}
                onChange={(e) => setSubjectiveAnswer(e.target.value)}
                placeholder={config.placeholder}
                rows={config.rows}
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 text-sm resize-none leading-relaxed bg-slate-50/50 transition-all"
              />

              <div className="flex items-center justify-between mt-1.5 mb-3">
                <span className="text-xs text-slate-400">
                  {subjectiveAnswer.trim() ? `${subjectiveAnswer.trim().split(/\s+/).length} words` : ''}
                </span>
                <span className="text-xs text-slate-400">
                  {question.type === 'short_answer' ? 'Aim for ~50–80 words' : 'Aim for ~150–250 words'}
                </span>
              </div>

              <button
                onClick={handleSubjectiveSubmit}
                disabled={!subjectiveAnswer.trim()}
                className="w-full btn-primary disabled:opacity-40 py-3 rounded-2xl text-sm"
              >
                Submit Answer
              </button>
            </>
          ) : (
            <div className="space-y-4">
              {/* Your answer */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Your Answer</div>
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{subjectiveAnswer}</p>
              </div>

              {/* Model answer */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-700">Model Answer</span>
                  <span className="ml-auto text-xs text-emerald-600 font-semibold">{question.marks} marks</span>
                </div>
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{question.correct_answer}</p>
                {question.explanation && (
                  <div className="mt-3 pt-3 border-t border-emerald-200">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <span className="font-bold">Key concept: </span>{question.explanation}
                    </p>
                  </div>
                )}
              </div>

              {/* Self-grade */}
              {selfGrade === null && (
                <div>
                  <div className="text-sm font-semibold text-slate-700 mb-2.5">Compare and self-grade:</div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleSelfGrade(true)}
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-2xl transition-all text-sm hover:-translate-y-0.5 shadow-sm hover:shadow-md hover:shadow-emerald-200"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Got it! (+{question.marks} mark{question.marks > 1 ? 's' : ''})
                    </button>
                    <button
                      onClick={() => handleSelfGrade(false)}
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-3 rounded-2xl transition-all text-sm"
                    >
                      <XCircle className="w-4 h-4" />
                      Needs work
                    </button>
                  </div>
                </div>
              )}

              {selfGrade !== null && (
                <div className={cn(
                  'text-sm font-semibold px-4 py-3 rounded-2xl animate-fade-in-fast',
                  selfGrade
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-50 text-slate-600 border border-slate-200'
                )}>
                  {selfGrade ? `✓ Marked correct · +${question.marks} mark${question.marks > 1 ? 's' : ''}` : '📚 Keep practising this topic!'}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Next button */}
      {submitted && (isMCQ || selfGrade !== null) && (
        <div className="px-6 py-4 border-t border-slate-50">
          <button
            onClick={onNext}
            className="w-full flex items-center justify-center gap-2 btn-primary py-3.5 rounded-2xl text-sm"
          >
            {isLast ? '🏁 See Results' : 'Next Question'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
