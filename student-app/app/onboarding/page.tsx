'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSubjectsForClass, CURRICULUM } from '@/lib/curriculum'
import { Zap, ChevronRight, BookOpen, CheckCircle } from 'lucide-react'

const CLASS_OPTIONS = [9, 10, 11, 12] as const

const SUBJECT_ICONS: Record<string, string> = {
  science: '🔬',
  maths: '📐',
  physics: '⚡',
  chemistry: '⚗️',
  biology: '🧬',
}

const CLASS_LABELS: Record<number, string> = {
  9: 'CBSE Secondary',
  10: 'CBSE Secondary',
  11: 'CBSE Senior Secondary',
  12: 'CBSE Senior Secondary',
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedClass, setSelectedClass] = useState<9 | 10 | 11 | 12 | null>(null)
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const availableSubjects = selectedClass ? getSubjectsForClass(selectedClass) : []

  function toggleSubject(sub: string) {
    setSelectedSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    )
  }

  async function handleFinish() {
    if (!selectedClass || selectedSubjects.length === 0) return
    setSaving(true)
    setError('')

    const res = await fetch('/api/profile/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ class: selectedClass, subjects: selectedSubjects }),
    })

    if (!res.ok) {
      setError('Something went wrong. Please try again.')
      setSaving(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen mesh-bg flex flex-col">
      {/* Header */}
      <header className="h-16 flex items-center px-4 sm:px-8">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-linear-to-br from-violet-600 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-violet-200/60">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">StudyAce</span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-violet-100">
        <div
          className="h-full bg-linear-to-r from-violet-600 to-indigo-500 transition-all duration-700 ease-out"
          style={{ width: step === 1 ? '50%' : '100%' }}
        />
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg animate-slide-up">
          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-10">
            <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${step === 1 ? 'text-violet-700' : 'text-slate-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 1 ? 'bg-violet-600 text-white' : 'bg-emerald-100 text-emerald-600'}`}>
                {step > 1 ? '✓' : '1'}
              </div>
              Your Class
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
            <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${step === 2 ? 'text-violet-700' : 'text-slate-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                2
              </div>
              Your Subjects
            </div>
          </div>

          {step === 1 && (
            <div className="animate-fade-in">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Which class are you in?</h1>
              <p className="text-slate-500 mb-8">We&apos;ll personalise your experience based on your CBSE class.</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {CLASS_OPTIONS.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setSelectedClass(cls)}
                    className={`relative p-6 rounded-2xl border-2 transition-all font-semibold text-lg text-left overflow-hidden ${
                      selectedClass === cls
                        ? 'border-violet-500 bg-violet-50 shadow-lg shadow-violet-100'
                        : 'border-slate-200 bg-white hover:border-violet-300 hover:shadow-md hover:shadow-violet-50'
                    }`}
                  >
                    {selectedClass === cls && (
                      <div className="absolute top-3 right-3">
                        <CheckCircle className="w-5 h-5 text-violet-600" />
                      </div>
                    )}
                    <div className={`text-2xl font-black mb-1 ${selectedClass === cls ? 'text-violet-700' : 'text-slate-800'}`}>
                      Class {cls}
                    </div>
                    <div className="text-xs font-medium text-slate-400">
                      {CLASS_LABELS[cls]}
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!selectedClass}
                className="w-full btn-primary disabled:opacity-40 py-3.5 rounded-xl flex items-center justify-center gap-2"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && selectedClass && (
            <div className="animate-fade-in">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Choose your subjects</h1>
              <p className="text-slate-500 mb-8">
                Select the subjects you want to practise for Class {selectedClass}.
              </p>
              <div className="space-y-3 mb-8">
                {availableSubjects.map((sub) => {
                  const info = CURRICULUM[selectedClass][sub]
                  const isSelected = selectedSubjects.includes(sub)
                  return (
                    <button
                      key={sub}
                      onClick={() => toggleSubject(sub)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-violet-500 bg-violet-50 shadow-sm shadow-violet-100'
                          : 'border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50/30'
                      }`}
                    >
                      <span className="text-2xl">{SUBJECT_ICONS[sub] || '📚'}</span>
                      <div className="flex-1">
                        <div className={`font-semibold ${isSelected ? 'text-violet-700' : 'text-slate-900'}`}>
                          {info.name}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">{info.chapters.length} chapters</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected ? 'border-violet-600 bg-violet-600 scale-110' : 'border-slate-300'
                      }`}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4 animate-fade-in-fast">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border-2 border-slate-200 text-slate-600 font-semibold py-3.5 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  disabled={selectedSubjects.length === 0 || saving}
                  className="flex-[2] btn-primary disabled:opacity-40 py-3.5 rounded-xl flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-5 h-5" />
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Setting up...
                    </span>
                  ) : 'Go to Dashboard'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
