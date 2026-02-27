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
    color: 'bg-indigo-100 text-indigo-700',
    icon: null,
    placeholder: '',
    rows: 0,
    hint: '',
  },
  short_answer: {
    label: 'Short Answer',
    color: 'bg-sky-100 text-sky-700',
    icon: PenLine,
    placeholder: 'Write your answer in 2–4 sentences...',
    rows: 4,
    hint: 'Expected: 2–4 sentences · Focus on key points',
  },
  long_answer: {
    label: 'Long Answer',
    color: 'bg-violet-100 text-violet-700',
    icon: BookOpen,
    placeholder: 'Write a detailed answer with explanations and examples...',
    rows: 8,
    hint: 'Expected: detailed paragraphs · Include diagrams/examples where relevant',
  },
}

export default function QuestionCard({ question, questionNumber, totalQuestions, onAnswer, onNext, isLast }: Props) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [subjectiveAnswer, setSubjectiveAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [selfGrade, setSelfGrade] = useState<boolean | null>(null)

  const isMCQ = question.type === 'mcq'
  const config = TYPE_CONFIG[question.type]

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
    onAnswer(question.id, subjectiveAnswer, false, 0) // self-graded after
  }

  function handleSelfGrade(got: boolean) {
    setSelfGrade(got)
    onAnswer(question.id, subjectiveAnswer, got, got ? question.marks : 0)
  }

  const difficultyColor = {
    easy: 'bg-emerald-100 text-emerald-700',
    medium: 'bg-amber-100 text-amber-700',
    hard: 'bg-red-100 text-red-700',
  }[question.difficulty]

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-slate-500">Q{questionNumber}</span>
          <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', config.color)}>
            {config.label}
          </span>
          <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', difficultyColor)}>
            {question.difficulty}
          </span>
        </div>
        <span className="text-sm font-semibold text-slate-600 shrink-0">
          {question.marks} mark{question.marks > 1 ? 's' : ''}
        </span>
      </div>

      {/* Question text */}
      <div className="px-6 py-5">
        <p className="text-slate-900 leading-relaxed font-medium">{question.question}</p>
        {!isMCQ && config.hint && !submitted && (
          <p className="mt-2 text-xs text-slate-400 italic">{config.hint}</p>
        )}
      </div>

      {/* MCQ Options */}
      {isMCQ && question.options && (
        <div className="px-6 pb-5 space-y-2">
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
                  'w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm leading-relaxed',
                  !submitted && !isSelected && 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50',
                  !submitted && isSelected && 'border-indigo-600 bg-indigo-50',
                  isCorrect && 'border-emerald-500 bg-emerald-50',
                  isWrong && 'border-red-400 bg-red-50',
                  submitted && !isSelected && !isCorrect && 'border-slate-200 opacity-50',
                )}
              >
                <div className="flex items-start gap-3">
                  <span className={cn(
                    'shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold',
                    !submitted && isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : '',
                    !submitted && !isSelected ? 'border-slate-300 text-slate-500' : '',
                    isCorrect ? 'border-emerald-500 bg-emerald-500 text-white' : '',
                    isWrong ? 'border-red-400 bg-red-400 text-white' : '',
                    submitted && !isSelected && !isCorrect ? 'border-slate-300 text-slate-400' : '',
                  )}>
                    {isCorrect ? '✓' : isWrong ? '✗' : letter}
                  </span>
                  <span className={cn(
                    isCorrect ? 'text-emerald-800' : isWrong ? 'text-red-800' : 'text-slate-700'
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
              className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
            >
              Submit Answer
            </button>
          )}

          {submitted && (
            <div className={cn(
              'mt-3 p-4 rounded-xl border',
              selectedOption?.charAt(0) === question.correct_answer
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-red-50 border-red-200'
            )}>
              <div className="flex items-center gap-2 mb-2">
                {selectedOption?.charAt(0) === question.correct_answer ? (
                  <><CheckCircle className="w-4 h-4 text-emerald-600" /><span className="text-sm font-semibold text-emerald-700">Correct!</span></>
                ) : (
                  <><XCircle className="w-4 h-4 text-red-600" /><span className="text-sm font-semibold text-red-700">Incorrect</span></>
                )}
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{question.explanation}</p>
            </div>
          )}
        </div>
      )}

      {/* Short / Long Answer */}
      {!isMCQ && (
        <div className="px-6 pb-5">
          {!submitted ? (
            <>
              {/* Answer type banner */}
              <div className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg mb-3 text-xs font-medium',
                question.type === 'short_answer' ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-violet-50 text-violet-700 border border-violet-200'
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
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none leading-relaxed"
              />

              {/* Word count guide */}
              <div className="flex items-center justify-between mt-1.5">
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
                className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
              >
                Submit Answer
              </button>
            </>
          ) : (
            <div className="space-y-4">
              {/* Student's answer */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Your Answer</div>
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{subjectiveAnswer}</p>
              </div>

              {/* Model answer */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-700">Model Answer</span>
                  <span className="ml-auto text-xs text-emerald-600 font-medium">{question.marks} marks</span>
                </div>
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{question.correct_answer}</p>
                {question.explanation && (
                  <div className="mt-3 pt-3 border-t border-emerald-200">
                    <p className="text-xs text-slate-600 leading-relaxed"><span className="font-semibold">Key concept: </span>{question.explanation}</p>
                  </div>
                )}
              </div>

              {/* Self-grade */}
              {selfGrade === null && (
                <div>
                  <div className="text-sm font-medium text-slate-700 mb-2">Compare your answer and self-grade:</div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleSelfGrade(true)}
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Got it! ({question.marks} mark{question.marks > 1 ? 's' : ''})
                    </button>
                    <button
                      onClick={() => handleSelfGrade(false)}
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2.5 rounded-xl transition-colors text-sm"
                    >
                      <XCircle className="w-4 h-4" />
                      Needs work
                    </button>
                  </div>
                </div>
              )}

              {selfGrade !== null && (
                <div className={cn('text-sm font-medium px-4 py-2.5 rounded-xl', selfGrade ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600')}>
                  {selfGrade ? `✓ Marked correct · +${question.marks} mark${question.marks > 1 ? 's' : ''}` : 'Keep practising this topic!'}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Next button */}
      {submitted && (isMCQ || selfGrade !== null) && (
        <div className="px-6 py-4 border-t border-slate-100">
          <button
            onClick={onNext}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            {isLast ? 'See Results' : 'Next Question'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
