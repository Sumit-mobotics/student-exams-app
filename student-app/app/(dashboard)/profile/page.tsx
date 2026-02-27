import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { UserProfile, FREE_SESSION_LIMIT } from '@/types'
import { getSubjectInfo } from '@/lib/curriculum'
import { User, BookOpen, Trophy, Zap, Calendar, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile?.class) redirect('/onboarding')

  const p = profile as UserProfile

  const { data: sessions } = await supabase
    .from('practice_sessions')
    .select('id, subject, chapter, score, total_marks, completed, created_at, time_taken')
    .eq('user_id', user.id)
    .eq('completed', true)
    .order('created_at', { ascending: false })
    .limit(20)

  const totalScore = sessions?.reduce((s, sess) => s + (sess.score || 0), 0) ?? 0
  const totalMarks = sessions?.reduce((s, sess) => s + (sess.total_marks || 0), 0) ?? 0
  const avgPct = totalMarks > 0 ? Math.round((totalScore / totalMarks) * 100) : 0
  const totalTime = sessions?.reduce((s, sess) => s + (sess.time_taken || 0), 0) ?? 0

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <User className="w-8 h-8 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-900">{p.full_name || 'Student'}</h1>
            <p className="text-slate-600 text-sm">{p.email}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs bg-indigo-100 text-indigo-700 font-medium px-2.5 py-1 rounded-full">
                Class {p.class} · CBSE
              </span>
              {p.subjects?.map((sub) => {
                const info = getSubjectInfo(p.class, sub)
                return (
                  <span key={sub} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                    {info?.name}
                  </span>
                )
              })}
            </div>
          </div>
          <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${p.is_premium ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            <Zap className="w-3.5 h-3.5" />
            {p.is_premium ? 'Premium' : 'Free Plan'}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Sessions', value: p.sessions_used, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Avg Score', value: `${avgPct}%`, icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Time Spent', value: `${Math.round(totalTime / 60)}m`, icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: isPremiumLabel(p), value: p.is_premium ? '∞' : `${Math.max(0, FREE_SESSION_LIMIT - p.sessions_used)}`, icon: Zap, color: 'text-violet-600', bg: 'bg-violet-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2 ${stat.bg}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Subscription */}
      {!p.is_premium && (
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold mb-1">Unlock Unlimited Practice</div>
              <div className="text-indigo-200 text-sm">You&apos;ve used {p.sessions_used} of {FREE_SESSION_LIMIT} free sessions</div>
            </div>
            <Link
              href="/pricing"
              className="flex-shrink-0 bg-white text-indigo-600 hover:bg-indigo-50 font-semibold px-4 py-2 rounded-xl text-sm transition-colors flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4" />
              Upgrade
            </Link>
          </div>
          <div className="mt-3 h-2 bg-indigo-500 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full"
              style={{ width: `${Math.min(100, (p.sessions_used / FREE_SESSION_LIMIT) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Session history */}
      {sessions && sessions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Session History</h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {sessions.map((sess, i) => {
              const pct = sess.total_marks > 0 ? Math.round((sess.score / sess.total_marks) * 100) : 0
              return (
                <div key={sess.id} className={`flex items-center gap-4 px-5 py-3.5 ${i < sessions.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-slate-900 capitalize truncate">{sess.subject} · Ch. {sess.chapter}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {new Date(sess.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div className={`text-sm font-semibold ${pct >= 70 ? 'text-emerald-600' : pct >= 40 ? 'text-amber-600' : 'text-red-600'}`}>
                    {pct}%
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {!sessions || sessions.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 text-sm">No completed sessions yet.</p>
          <Link href="/dashboard" className="text-indigo-600 text-sm font-medium hover:underline mt-2 inline-block">
            Start practising →
          </Link>
        </div>
      )}
    </div>
  )
}

function isPremiumLabel(p: UserProfile) {
  return p.is_premium ? 'Unlimited' : 'Free Left'
}
