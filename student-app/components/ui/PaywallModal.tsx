'use client'

import { X, Zap, CheckCircle, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface PaywallModalProps {
  onClose: () => void
  sessionsUsed: number
  freeLimit: number
}

export default function PaywallModal({ onClose, sessionsUsed, freeLimit }: PaywallModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in-fast"
        onClick={onClose}
      />

      {/* Modal card */}
      <div className="relative bg-white rounded-3xl shadow-2xl shadow-violet-200/40 w-full max-w-md p-7 sm:p-8 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 bg-linear-to-br from-violet-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl shadow-violet-200 animate-float">
            <Zap className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2">You&apos;ve Used Your Free Sessions</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            You&apos;ve completed{' '}
            <span className="font-semibold text-slate-700">{sessionsUsed}</span> of{' '}
            <span className="font-semibold text-slate-700">{freeLimit}</span> free sessions.
            Upgrade to keep practising with unlimited access.
          </p>
        </div>

        {/* Features */}
        <div className="bg-linear-to-br from-violet-50 to-indigo-50 rounded-2xl p-5 mb-6 border border-violet-100">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <div className="font-bold text-violet-900 text-sm">Premium includes:</div>
          </div>
          <ul className="space-y-2">
            {[
              'Unlimited practice sessions',
              'All chapters & subjects',
              'Previous year style questions',
              'Full sample papers',
              'Progress tracking',
            ].map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-slate-700">
                <div className="w-4 h-4 bg-violet-100 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle className="w-3 h-3 text-violet-600" />
                </div>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <Link
            href="/pricing"
            className="flex items-center justify-center gap-2 w-full btn-primary py-3.5 rounded-xl text-sm"
          >
            <Zap className="w-4 h-4" />
            Upgrade — Starting ₹99/month
          </Link>
          <button
            onClick={onClose}
            className="block w-full text-center text-slate-400 hover:text-slate-600 text-sm py-2 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
