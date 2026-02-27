import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CURRICULUM, getSubjectInfo } from '@/lib/curriculum'
import { UserProfile, FREE_SESSION_LIMIT } from '@/types'
import { BookOpen, ChevronRight, Zap, Trophy, Target, Clock } from 'lucide-react'

const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  science: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: '🔬' },
  maths: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: '📐' },
  physics: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', icon: '⚡' },
  chemistry: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: '⚗️' },
  biology: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', icon: '🧬' },
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile?.class) redirect('/onboarding')

  const p = profile as UserProfile

  // Fetch recent sessions
  const { data: recentSessions } = await supabase
    .from('practice_sessions')
    .select('id, subject, chapter, score, total_marks, completed, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const sessionsRemaining = Math.max(0, FREE_SESSION_LIMIT - p.sessions_used)
  const isPremium = p.is_premium

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Hey, {p.full_name?.split(' ')[0] || 'Student'} 👋
          </h1>
          <p className="text-slate-600 mt-1">
            Class {p.class} · CBSE Board · Ready to practise?
          </p>
        </div>
        {!isPremium && (
          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{sessionsRemaining}</span> free sessions left
            </div>
            <Link
              href="/pricing"
              className="flex items-center gap-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <Zap className="w-4 h-4" />
              Upgrade
            </Link>
          </div>
        )}
        {isPremium && (
          <div className="flex items-center gap-2 text-sm bg-emerald-100 text-emerald-700 font-medium px-3 py-1.5 rounded-full">
            <Zap className="w-4 h-4" />
            Premium Active
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          {
            icon: Target,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            label: 'Sessions Done',
            value: p.sessions_used.toString(),
          },
          {
            icon: Trophy,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            label: 'Subjects',
            value: p.subjects?.length.toString() ?? '0',
          },
          {
            icon: Clock,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            label: isPremium ? 'Premium Plan' : 'Sessions Left',
            value: isPremium ? 'Unlimited' : sessionsRemaining.toString(),
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-sm text-slate-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Subjects */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Subjects</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {(p.subjects || []).map((sub) => {
            const info = getSubjectInfo(p.class, sub)
            if (!info) return null
            const colors = SUBJECT_COLORS[sub] || { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', icon: '📚' }
            return (
              <div key={sub} className={`bg-white rounded-2xl border ${colors.border} shadow-sm overflow-hidden`}>
                <div className={`px-5 py-4 ${colors.bg} flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{colors.icon}</span>
                    <div>
                      <div className={`font-semibold ${colors.text}`}>{info.name}</div>
                      <div className="text-xs text-slate-500">{info.chapters.length} chapters</div>
                    </div>
                  </div>
                </div>
                <div className="px-5 py-3 divide-y divide-slate-100 max-h-64 overflow-y-auto">
                  {info.chapters.map((chapter) => (
                    <Link
                      key={chapter.id}
                      href={`/practice/${sub}/${chapter.id}`}
                      className="flex items-center justify-between py-2.5 group hover:pl-2 transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 text-xs font-medium flex items-center justify-center flex-shrink-0">
                          {chapter.id}
                        </span>
                        <span className="text-sm text-slate-700 group-hover:text-indigo-600 transition-colors leading-tight">
                          {chapter.name}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent sessions */}
      {recentSessions && recentSessions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Sessions</h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {recentSessions.map((session, i) => {
              const pct = session.total_marks > 0
                ? Math.round((session.score / session.total_marks) * 100)
                : 0
              return (
                <div
                  key={session.id}
                  className={`flex items-center justify-between px-5 py-3.5 ${i < recentSessions.length - 1 ? 'border-b border-slate-100' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{SUBJECT_COLORS[session.subject]?.icon || '📚'}</span>
                    <div>
                      <div className="text-sm font-medium text-slate-900 capitalize">{session.subject}</div>
                      <div className="text-xs text-slate-500">Ch. {session.chapter}</div>
                    </div>
                  </div>
                  {session.completed && (
                    <div className={`text-sm font-semibold ${pct >= 70 ? 'text-emerald-600' : pct >= 40 ? 'text-amber-600' : 'text-red-600'}`}>
                      {pct}%
                    </div>
                  )}
                  {!session.completed && (
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">In progress</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/papers"
          className="flex items-center gap-4 bg-white rounded-xl border border-slate-200 p-4 hover:border-indigo-300 hover:shadow-sm transition-all group"
        >
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">Sample Papers & PYQs</div>
            <div className="text-xs text-slate-500">Full papers in CBSE format</div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
        </Link>
        <Link
          href="/profile"
          className="flex items-center gap-4 bg-white rounded-xl border border-slate-200 p-4 hover:border-indigo-300 hover:shadow-sm transition-all group"
        >
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Trophy className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">View Progress</div>
            <div className="text-xs text-slate-500">Track your improvement</div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
        </Link>
      </div>
    </div>
  )
}
