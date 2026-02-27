'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSubjectsForClass, CURRICULUM } from '@/lib/curriculum'
import { Zap, ChevronRight, BookOpen } from 'lucide-react'

const CLASS_OPTIONS = [9, 10, 11, 12] as const

const SUBJECT_ICONS: Record<string, string> = {
  science: '🔬',
  maths: '📐',
  physics: '⚡',
  chemistry: '⚗️',
  biology: '🧬',
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="h-16 flex items-center px-4 sm:px-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">StudyAce</span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-slate-200">
        <div
          className="h-full bg-indigo-600 transition-all duration-500"
          style={{ width: step === 1 ? '50%' : '100%' }}
        />
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Step indicator */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <span className={step === 1 ? 'text-indigo-600 font-medium' : ''}>Step 1: Your Class</span>
            <ChevronRight className="w-4 h-4" />
            <span className={step === 2 ? 'text-indigo-600 font-medium' : ''}>Step 2: Your Subjects</span>
          </div>

          {step === 1 && (
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Which class are you in?</h1>
              <p className="text-slate-600 mb-8">We&apos;ll personalise your experience based on your CBSE class.</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {CLASS_OPTIONS.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setSelectedClass(cls)}
                    className={`p-6 rounded-2xl border-2 transition-all font-semibold text-lg ${
                      selectedClass === cls
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-slate-50'
                    }`}
                  >
                    Class {cls}
                    <div className="text-sm font-normal mt-1 text-slate-500">
                      {cls <= 10 ? 'CBSE Secondary' : 'CBSE Senior Secondary'}
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!selectedClass}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && selectedClass && (
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Choose your subjects</h1>
              <p className="text-slate-600 mb-8">
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
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-slate-200 bg-white hover:border-indigo-300'
                      }`}
                    >
                      <span className="text-2xl">{SUBJECT_ICONS[sub] || '📚'}</span>
                      <div className="flex-1">
                        <div className={`font-semibold ${isSelected ? 'text-indigo-700' : 'text-slate-900'}`}>
                          {info.name}
                        </div>
                        <div className="text-sm text-slate-500">{info.chapters.length} chapters</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
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
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-slate-300 text-slate-700 font-medium py-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  disabled={selectedSubjects.length === 0 || saving}
                  className="flex-2 flex-grow bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-5 h-5" />
                  {saving ? 'Setting up...' : 'Go to Dashboard'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
