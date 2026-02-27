'use client'

import { useState } from 'react'
import { ExamPaper } from '@/types'
import { Printer, X, Eye, EyeOff, BookOpen, ChevronLeft } from 'lucide-react'

interface Props {
  paper: ExamPaper
  onClose: () => void
}

const GENERAL_INSTRUCTIONS = [
  'This practice paper consists of five sections — A, B, C, D and E.',
  'All questions are compulsory unless stated otherwise.',
  'Section A contains 20 MCQs of 1 mark each. Section B contains 10 Very Short Answer questions of 2 marks each.',
  'Section C contains 8 Short Answer questions of 3 marks each. Section D contains 4 Long Answer questions of 4 marks each.',
  'Section E contains 4 Long Answer questions of 5 marks each.',
  'Draw neat and labelled diagrams wherever required.',
  'Write legibly. All rough work must be done in the space provided.',
]

export default function ExamPaperView({ paper, onClose }: Props) {
  const [showAnswers, setShowAnswers] = useState(false)

  // Running question number across sections
  let globalQ = 0

  return (
    <>
      {/* Print-only CSS — hides everything except the paper */}
      <style>{`
        @media print {
          body > * { visibility: hidden !important; }
          #exam-paper-printable,
          #exam-paper-printable * { visibility: visible !important; }
          #exam-paper-printable {
            position: fixed !important;
            inset: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          .no-print { display: none !important; }
          .answer-block { display: none !important; }
          @page { size: A4 portrait; margin: 15mm 18mm; }
        }
      `}</style>

      {/* Full-screen overlay */}
      <div className="fixed inset-0 bg-gray-100 z-50 overflow-y-auto">

        {/* Sticky toolbar — hidden when printing */}
        <div className="no-print sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm px-4 py-3 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex-1 text-center">
            <span className="text-sm font-semibold text-slate-700">
              Practice Board Paper · Class {paper.classNum} {paper.subjectName} · {paper.totalMarks} Marks
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAnswers(!showAnswers)}
              className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border transition-all ${
                showAnswers
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-white border-slate-300 text-slate-600 hover:border-slate-400'
              }`}
            >
              {showAnswers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showAnswers ? 'Hide Answers' : 'Show Answers'}
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Paper content */}
        <div
          id="exam-paper-printable"
          className="max-w-[780px] mx-auto my-6 bg-white shadow-sm border border-slate-200 px-12 py-10 font-serif text-slate-900"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >

          {/* ── Header ── */}
          <div className="text-center border-b-2 border-black pb-5 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 no-print text-slate-500" />
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                Board Exam Preparation — Practice Paper
              </p>
            </div>
            <h1 className="text-xl font-bold uppercase tracking-wide">
              Practice Board Examination
            </h1>
            <p className="text-sm text-slate-500 mt-1 italic">
              Full Syllabus · CBSE Pattern · {paper.totalMarks} Marks
            </p>
            <div className="mt-3 text-sm font-semibold">
              Subject: {paper.subjectName} &nbsp;|&nbsp; Class: {paper.classNum}
            </div>
            <div className="mt-2 flex justify-between text-sm font-medium px-4 border-t border-slate-300 pt-2">
              <span>Time Allowed: {paper.duration}</span>
              <span>Maximum Marks: {paper.totalMarks}</span>
            </div>
          </div>

          {/* ── General Instructions ── */}
          <div className="mb-8">
            <p className="font-bold underline mb-2 text-sm">General Instructions:</p>
            <ol className="list-decimal list-inside space-y-1 text-[13px] leading-relaxed">
              {GENERAL_INSTRUCTIONS.map((inst, i) => (
                <li key={i}>{inst}</li>
              ))}
            </ol>
          </div>

          {/* ── Sections ── */}
          {paper.sections.map((section) => (
            <div key={section.name} className="mb-10">

              {/* Section header */}
              <div className="border-t-2 border-b-2 border-black py-1 text-center mb-5">
                <span className="font-bold text-sm uppercase tracking-wide">{section.name}</span>
                <span className="mx-2 text-slate-400">—</span>
                <span className="text-sm">{section.description}</span>
              </div>

              {/* Questions */}
              <div className="space-y-5">
                {section.questions.map((q) => {
                  globalQ++
                  const num = globalQ
                  return (
                    <div key={q.id}>
                      {/* Question text */}
                      <div className="flex gap-2">
                        <span className="font-bold text-[13px] shrink-0">{num}.</span>
                        <div className="flex-1">
                          <span className="text-[13px] leading-relaxed">{q.question}</span>
                          <span className="ml-2 text-[12px] text-slate-500 font-sans">
                            [{q.marks} mark{q.marks > 1 ? 's' : ''}]
                          </span>

                          {/* Chapter reference */}
                          {q.chapter_reference && (
                            <span className="no-print ml-2 text-[11px] text-indigo-500 font-sans italic">
                              ({q.chapter_reference})
                            </span>
                          )}

                          {/* MCQ options — 2-column grid */}
                          {q.options && (
                            <div className="grid grid-cols-2 gap-x-6 gap-y-0.5 mt-2">
                              {q.options.map((opt) => (
                                <p key={opt} className="text-[13px]">{opt}</p>
                              ))}
                            </div>
                          )}

                          {/* Answer block — shown on screen when toggled, always hidden in print */}
                          {showAnswers && (
                            <div className="answer-block no-print mt-2 pl-3 border-l-4 border-emerald-400 bg-emerald-50 rounded-r-lg py-2 pr-3">
                              <p className="text-[12px] font-semibold text-emerald-700 font-sans mb-0.5">
                                Answer:
                              </p>
                              <p className="text-[12px] text-slate-700 font-sans whitespace-pre-wrap leading-relaxed">
                                {q.correct_answer}
                              </p>
                              {q.explanation && (
                                <p className="text-[11px] text-slate-500 font-sans mt-1 italic">
                                  {q.explanation}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Answer lines for subjective — shown in print */}
                          {q.type !== 'mcq' && (
                            <div className="mt-3 space-y-4 print-only hidden print:block">
                              {Array.from({
                                length: q.marks <= 2 ? 4 : q.marks === 3 ? 6 : q.marks === 4 ? 9 : 12
                              }).map((_, i) => (
                                <div key={i} className="border-b border-slate-300 h-5" />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Footer */}
          <div className="border-t-2 border-black pt-3 mt-8 text-center text-[12px] text-slate-600">
            *** End of Question Paper ***
          </div>

          {/* Answer Key (screen only, only when answers shown) */}
          {showAnswers && (
            <div className="no-print mt-10 border-t-2 border-dashed border-slate-300 pt-6">
              <h2 className="font-bold text-center text-sm mb-4 font-sans uppercase tracking-wide">
                Answer Key
              </h2>
              <div className="space-y-1">
                {(() => {
                  let n = 0
                  return paper.sections.flatMap((sec) =>
                    sec.questions.map((q) => {
                      n++
                      return (
                        <div key={q.id} className="flex gap-2 text-[12px] font-sans">
                          <span className="font-bold w-6 shrink-0">{n}.</span>
                          <span className="text-slate-700">
                            {q.type === 'mcq'
                              ? `(${q.correct_answer})`
                              : q.correct_answer.split('\n')[0]}
                          </span>
                        </div>
                      )
                    })
                  )
                })()}
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="no-print text-center pb-8">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm shadow-md"
          >
            <Printer className="w-4 h-4" />
            Print or Save as PDF
          </button>
          <p className="text-xs text-slate-400 mt-2">
            In the print dialog, choose &ldquo;Save as PDF&rdquo; as the destination
          </p>
        </div>
      </div>
    </>
  )
}
