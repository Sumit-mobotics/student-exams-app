'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getSubjectInfo } from '@/lib/curriculum'
import { Question, PracticeMode, ExamPaper, FREE_SESSION_LIMIT } from '@/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import PaywallModal from '@/components/ui/PaywallModal'
import QuestionCard from '@/components/practice/QuestionCard'
import ResultsView from '@/components/practice/ResultsView'
import ExamPaperView from '@/components/papers/ExamPaperView'
import { FileText, Scroll, BookMarked } from 'lucide-react'

type Stage = 'select' | 'loading' | 'paper' | 'results' | 'full-pyq-loading' | 'full-pyq'

const CHAPTER_PAPER_TYPES: { id: PracticeMode; label: string; desc: string; icon: string }[] = [
  { id: 'pyq', label: 'Chapter PYQ', desc: 'CBSE board-style questions for one chapter (2018–2024 pattern)', icon: '📅' },
  { id: 'sample_paper', label: 'Chapter Sample Paper', desc: 'Full-format CBSE sample paper for one chapter', icon: '📋' },
]

export default function PapersPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<{ class: number; subjects: string[]; sessions_used: number; is_premium: boolean } | null>(null)
  const [stage, setStage] = useState<Stage>('select')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedChapter, setSelectedChapter] = useState<{ id: number; name: string; topics: string[] } | null>(null)
  const [selectedPaperType, setSelectedPaperType] = useState<PracticeMode>('pyq')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [score, setScore] = useState(0)
  const [totalMarks, setTotalMarks] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [error, setError] = useState('')
  const [showPaywall, setShowPaywall] = useState(false)
  const [examPaper, setExamPaper] = useState<ExamPaper | null>(null)
  const [fullPyqSubject, setFullPyqSubject] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('profiles').select('class, subjects, sessions_used, is_premium').eq('id', user.id).single()
      if (data) setProfile(data as typeof profile)
    }
    load()
  }, [router])

  // Timer for chapter papers
  useEffect(() => {
    if (stage !== 'paper') return
    const interval = setInterval(() => setElapsedTime(Math.floor((Date.now() - startTime) / 1000)), 1000)
    return () => clearInterval(interval)
  }, [stage, startTime])

  const subjectInfo = profile && selectedSubject ? getSubjectInfo(profile.class, selectedSubject) : null

  // ── Generate chapter paper ──────────────────────────────────────────────────
  async function startChapterPaper() {
    if (!profile || !selectedSubject || !selectedChapter) return
    const isBlocked = !profile.is_premium && profile.sessions_used >= FREE_SESSION_LIMIT
    if (isBlocked) { setShowPaywall(true); return }

    setStage('loading')
    setError('')
    try {
      const res = await fetch('/api/questions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classNum: profile.class,
          subject: selectedSubject,
          chapterId: selectedChapter.id,
          topics: selectedChapter.topics,
          mode: selectedPaperType,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 403) { setShowPaywall(true); setStage('select'); return }
        throw new Error(data.error || 'Failed to generate paper')
      }
      setQuestions(data.questions)
      setCurrentIndex(0)
      setAnswers({})
      setScore(0)
      setTotalMarks(data.questions.reduce((s: number, q: Question) => s + q.marks, 0))
      setStartTime(Date.now())
      setElapsedTime(0)
      setStage('paper')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setStage('select')
    }
  }

  // ── Generate full-syllabus PYQ paper ───────────────────────────────────────
  async function generateFullPYQ() {
    if (!profile || !fullPyqSubject) return
    const isBlocked = !profile.is_premium && profile.sessions_used >= FREE_SESSION_LIMIT
    if (isBlocked) { setShowPaywall(true); return }

    setStage('full-pyq-loading')
    setError('')
    try {
      const res = await fetch('/api/papers/generate-full-pyq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: fullPyqSubject }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 403) { setShowPaywall(true); setStage('select'); return }
        throw new Error(data.error || 'Failed to generate paper')
      }
      setExamPaper(data.paper)
      setStage('full-pyq')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setStage('select')
    }
  }

  function handleAnswer(qId: string, ans: string, isCorrect: boolean, marks: number) {
    setAnswers((prev) => ({ ...prev, [qId]: ans }))
    if (isCorrect) setScore((prev) => prev + marks)
  }

  async function handleFinish() {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000)
    try {
      await fetch('/api/practice/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classNum: profile?.class, subject: selectedSubject, chapterId: selectedChapter?.id,
          chapterName: selectedChapter?.name, mode: selectedPaperType, questions, answers, score, totalMarks, timeTaken,
        }),
      })
    } catch { /* non-blocking */ }
    setElapsedTime(timeTaken)
    setStage('results')
  }

  if (!profile) return (
    <div className="flex items-center justify-center py-20">
      <LoadingSpinner size="lg" message="Loading..." />
    </div>
  )

  // ── Full PYQ paper viewer ───────────────────────────────────────────────────
  if (stage === 'full-pyq' && examPaper) {
    return (
      <ExamPaperView
        paper={examPaper}
        onClose={() => { setStage('select'); setExamPaper(null) }}
      />
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {showPaywall && (
        <PaywallModal onClose={() => setShowPaywall(false)} sessionsUsed={profile.sessions_used} freeLimit={FREE_SESSION_LIMIT} />
      )}

      {/* ── Select stage ── */}
      {stage === 'select' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Papers & Past Questions</h1>
            <p className="text-slate-600 mt-1">Generate CBSE-style papers and previous year question patterns</p>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}

          {/* ── Full Syllabus PYQ ── */}
          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border-2 border-indigo-200 shadow-sm p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                <Scroll className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Full Syllabus PYQ Paper</h2>
                <p className="text-sm text-slate-600 mt-0.5">
                  Complete board-exam style paper covering <span className="font-semibold">all chapters</span> — download as PDF
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">100 marks</span>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">5 sections</span>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">MCQ + Short + Long Answer</span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Downloadable PDF</span>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Select Subject</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {profile.subjects.map((sub) => {
                  const info = getSubjectInfo(profile.class, sub)
                  return (
                    <button
                      key={sub}
                      onClick={() => setFullPyqSubject(sub)}
                      className={`p-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                        fullPyqSubject === sub
                          ? 'border-indigo-600 bg-white text-indigo-700 shadow-sm'
                          : 'border-indigo-200 bg-white/60 text-slate-700 hover:border-indigo-400'
                      }`}
                    >
                      {info?.name}
                    </button>
                  )
                })}
              </div>
            </div>

            <button
              onClick={generateFullPYQ}
              disabled={!fullPyqSubject}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Scroll className="w-4 h-4" />
              Generate Full Syllabus Paper
            </button>
          </div>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 border-t border-slate-200" />
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">or chapter-wise</span>
            <div className="flex-1 border-t border-slate-200" />
          </div>

          {/* ── Chapter-based papers ── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <BookMarked className="w-4 h-4" />
              Chapter-Wise Paper
            </h2>

            {/* Paper type */}
            <div className="grid sm:grid-cols-2 gap-3 mb-5">
              {CHAPTER_PAPER_TYPES.map((pt) => (
                <button
                  key={pt.id}
                  onClick={() => setSelectedPaperType(pt.id)}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    selectedPaperType === pt.id ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <span className="text-2xl mt-0.5">{pt.icon}</span>
                  <div>
                    <div className={`font-medium text-sm ${selectedPaperType === pt.id ? 'text-indigo-700' : 'text-slate-900'}`}>{pt.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{pt.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Subject */}
            <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Subject</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
              {profile.subjects.map((sub) => {
                const info = getSubjectInfo(profile.class, sub)
                return (
                  <button
                    key={sub}
                    onClick={() => { setSelectedSubject(sub); setSelectedChapter(null) }}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      selectedSubject === sub ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-700 hover:border-indigo-300'
                    }`}
                  >
                    {info?.name}
                  </button>
                )
              })}
            </div>

            {/* Chapter */}
            {subjectInfo && (
              <>
                <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Chapter</p>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 mb-5">
                  {subjectInfo.chapters.map((ch) => (
                    <button
                      key={ch.id}
                      onClick={() => setSelectedChapter(ch)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all ${
                        selectedChapter?.id === ch.id ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="w-6 h-6 rounded bg-slate-100 text-xs font-medium text-slate-600 flex items-center justify-center shrink-0">
                        {ch.id}
                      </span>
                      {ch.name}
                    </button>
                  ))}
                </div>
              </>
            )}

            <button
              onClick={startChapterPaper}
              disabled={!selectedSubject || !selectedChapter}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <FileText className="w-4 h-4" />
              Generate {CHAPTER_PAPER_TYPES.find((p) => p.id === selectedPaperType)?.label}
            </button>
          </div>
        </div>
      )}

      {/* ── Loading ── */}
      {(stage === 'loading' || stage === 'full-pyq-loading') && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12">
          <LoadingSpinner
            size="lg"
            message={
              stage === 'full-pyq-loading'
                ? 'Generating full-syllabus paper with AI... this may take 15–30 seconds'
                : 'Generating your paper with AI...'
            }
            className="py-8"
          />
        </div>
      )}

      {/* ── Chapter paper interactive view ── */}
      {stage === 'paper' && questions.length > 0 && (
        <div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-4 flex items-center justify-between">
            <div className="text-sm font-medium text-slate-700">
              Question {currentIndex + 1} of {questions.length}
            </div>
            <div className="flex-1 mx-4">
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
              </div>
            </div>
            <div className="text-sm text-slate-500">{selectedChapter?.name}</div>
          </div>
          <QuestionCard
            key={questions[currentIndex].id}
            question={questions[currentIndex]}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
            onNext={() => {
              if (currentIndex < questions.length - 1) setCurrentIndex((i) => i + 1)
              else handleFinish()
            }}
            isLast={currentIndex === questions.length - 1}
          />
        </div>
      )}

      {/* ── Results ── */}
      {stage === 'results' && (
        <ResultsView
          questions={questions}
          answers={answers}
          score={score}
          totalMarks={totalMarks}
          timeTaken={elapsedTime}
          chapterName={selectedChapter?.name ?? ''}
          onRetry={() => { setStage('select'); setQuestions([]); setAnswers({}); setScore(0) }}
        />
      )}
    </div>
  )
}
