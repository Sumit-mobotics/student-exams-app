'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PLANS } from '@/types'
import { CheckCircle, Zap, ChevronLeft, Shield } from 'lucide-react'
import Link from 'next/link'

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayResponse) => void
  prefill?: { name?: string; email?: string }
  theme?: { color?: string }
  modal?: { ondismiss?: () => void }
}

interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

interface RazorpayInstance {
  open: () => void
}

export default function PricingPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<{ full_name: string; email: string; is_premium: boolean } | null>(null)
  const [selectedPlan, setSelectedPlan] = useState('half_yearly')
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

    async function loadProfile() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('profiles').select('full_name, email, is_premium').eq('id', user.id).single()
      if (data) setProfile(data as typeof profile)
    }
    loadProfile()
    return () => { document.body.removeChild(script) }
  }, [router])

  async function handleSubscribe(planId: string) {
    setLoading(planId)
    setError('')
    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create order')

      const options: RazorpayOptions = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'StudyAce',
        description: `${PLANS.find((p) => p.id === planId)?.name} Plan`,
        order_id: data.id,
        handler: async (response: RazorpayResponse) => {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...response, planId }),
          })
          const verifyData = await verifyRes.json()
          if (verifyRes.ok) {
            setSuccess('Payment successful! Your account has been upgraded to Premium.')
            setLoading(null)
            setTimeout(() => router.push('/dashboard'), 2000)
          } else {
            setError(verifyData.error || 'Payment verification failed')
            setLoading(null)
          }
        },
        prefill: { name: profile?.full_name, email: profile?.email },
        theme: { color: '#4f46e5' },
        modal: { ondismiss: () => setLoading(null) },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setLoading(null)
    }
  }

  if (profile?.is_premium) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">You&apos;re on Premium!</h1>
        <p className="text-slate-600 mb-6">You already have unlimited access to all features.</p>
        <Link href="/dashboard" className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors">
          Go to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Upgrade to Premium</h1>
        <p className="text-slate-600 text-lg">Unlimited practice sessions for the whole year.</p>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl mb-6 text-center font-medium">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        {PLANS.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={`relative text-left p-6 rounded-2xl border-2 transition-all ${
              selectedPlan === plan.id
                ? 'border-indigo-600 bg-indigo-50 shadow-md'
                : 'border-slate-200 bg-white hover:border-indigo-300'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-xs font-bold px-3 py-1 rounded-full">
                BEST VALUE
              </div>
            )}
            <div className={`text-sm font-semibold mb-1 ${selectedPlan === plan.id ? 'text-indigo-700' : 'text-slate-700'}`}>
              {plan.name}
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-0.5">
              ₹{plan.price}
            </div>
            <div className="text-xs text-slate-500 mb-4">for {plan.duration}</div>
            <ul className="space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-1.5 text-xs text-slate-600">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-semibold text-slate-900">
              {PLANS.find((p) => p.id === selectedPlan)?.name} Plan
            </div>
            <div className="text-slate-600 text-sm">
              ₹{PLANS.find((p) => p.id === selectedPlan)?.price} · {PLANS.find((p) => p.id === selectedPlan)?.duration}
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            ₹{PLANS.find((p) => p.id === selectedPlan)?.price}
          </div>
        </div>
        <button
          onClick={() => handleSubscribe(selectedPlan)}
          disabled={!!loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Zap className="w-5 h-5" />
          {loading === selectedPlan ? 'Opening payment...' : `Pay ₹${PLANS.find((p) => p.id === selectedPlan)?.price}`}
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
        <Shield className="w-4 h-4" />
        <span>Secure payment via Razorpay. UPI, cards, netbanking accepted.</span>
      </div>
    </div>
  )
}
