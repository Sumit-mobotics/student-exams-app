'use client'

import { X, Zap, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface PaywallModalProps {
  onClose: () => void
  sessionsUsed: number
  freeLimit: number
}

export default function PaywallModal({ onClose, sessionsUsed, freeLimit }: PaywallModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-7 h-7 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">You&apos;ve Used Your Free Sessions</h2>
          <p className="text-slate-600 text-sm mt-2">
            You&apos;ve completed {sessionsUsed} of {freeLimit} free sessions. Upgrade to keep practising with unlimited access.
          </p>
        </div>

        <div className="bg-indigo-50 rounded-xl p-4 mb-6">
          <div className="font-semibold text-indigo-900 mb-3">Premium includes:</div>
          <ul className="space-y-2">
            {[
              'Unlimited practice sessions',
              'All chapters & subjects',
              'Previous year style questions',
              'Full sample papers',
              'Progress tracking',
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-indigo-800">
                <CheckCircle className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <Link
            href="/pricing"
            className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Upgrade — Starting ₹99/month
          </Link>
          <button
            onClick={onClose}
            className="block w-full text-center text-slate-600 hover:text-slate-800 text-sm py-2 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
