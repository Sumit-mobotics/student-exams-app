import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CURRICULUM, getSubjectInfo } from '@/lib/curriculum'
import { UserProfile, FREE_SESSION_LIMIT } from '@/types'
import { BookOpen, ChevronRight, Zap, Trophy, Target, Clock, Sparkles } from 'lucide-react'

const SUBJECT_COLORS: Record<string, {
  bg: string; text: string; border: string; icon: string;
  gradient: string; shadow: string;
}> = {
  science:   { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: '🔬', gradient: 'from-emerald-500 to-teal-500',   shadow: 'shadow-emerald-200' },
  maths:     { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',    icon: '📐', gradient: 'from-blue-500 to-indigo-500',     shadow: 'shadow-blue-200'   },
  physics:   { bg: 'bg-violet-50',  text: 'text-violet-700',  border: 'border-violet-200',  icon: '⚡', gradient: 'from-violet-500 to-purple-500',   shadow: 'shadow-violet-200' },
  chemistry: { bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-200',  icon: '⚗️', gradient: 'from-orange-500 to-amber-500',    shadow: 'shadow-orange-200' },
  biology:   { bg: 'bg-teal-50',    text: 'text-teal-700',    border: 'border-teal-200',    icon: '🧬', gradient: 'from-teal-500 to-emerald-500',    shadow: 'shadow-teal-200'   },
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

  const { data: recentSessions } = await supabase
    .from('practice_sessions')
    .select('id, subject, chapter, score, total_marks, completed, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const sessionsRemaining = Math.max(0, FREE_SESSION_LIMIT - p.sessions_used)
  const isPremium = p.is_premium

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Hey, {p.full_name?.split(' ')[0] || 'Student'} 👋
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Class {p.class} · CBSE Board · Ready to practise?
          </p>
        </div>
        {!isPremium && (
          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-500">
              <span className="font-bold text-slate-800">{sessionsRemaining}</span> free sessions left
            </div>
            <Link
              href="/pricing"
              className="flex items-center gap-1.5 text-sm btn-primary px-4 py-2 rounded-lg"
            >
              <Zap className="w-4 h-4" />
              Upgrade
            </Link>
          </div>
        )}
        {isPremium && (
          <div className="flex items-center gap-2 text-sm bg-emerald-100 text-emerald-700 font-semibold px-3 py-1.5 rounded-full border border-emerald-200/60">
            <Sparkles className="w-4 h-4" />
            Premium Active
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          {
            icon: Target,
            gradient: 'from-violet-500 to-indigo-500',
            shadow: 'shadow-violet-100',
            label: 'Sessions Done',
            value: p.sessions_used.toString(),
          },
          {
            icon: Trophy,
            gradient: 'from-amber-500 to-orange-500',
            shadow: 'shadow-amber-100',
            label: 'Subjects',
            value: p.subjects?.length.toString() ?? '0',
          },
          {
            icon: Clock,
            gradient: 'from-emerald-500 to-teal-500',
            shadow: 'shadow-emerald-100',
            label: isPremium ? 'Premium Plan' : 'Sessions Left',
            value: isPremium ? '∞' : sessionsRemaining.toString(),
          },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-5 border border-violet-100/60 shadow-sm card-hover animate-fade-in"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-linear-to-br ${stat.gradient} shadow-lg ${stat.shadow}`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-xs text-slate-400 mt-0.5 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Subjects */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Your Subjects</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {(p.subjects || []).map((sub) => {
            const info = getSubjectInfo(p.class, sub)
            if (!info) return null
            const colors = SUBJECT_COLORS[sub] || {
              bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', icon: '📚',
              gradient: 'from-slate-400 to-slate-500', shadow: 'shadow-slate-200',
            }
            return (
              <div key={sub} className="bg-white rounded-2xl border border-violet-100/60 shadow-sm overflow-hidden card-hover">
                {/* Subject header */}
                <div className="px-5 py-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-linear-to-br ${colors.gradient} shadow-md ${colors.shadow} shrink-0`}>
                    <span className="text-lg">{colors.icon}</span>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{info.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{info.chapters.length} chapters</div>
                  </div>
                </div>

                {/* Chapter list */}
                <div className="border-t border-slate-100 px-2 py-1 max-h-60 overflow-y-auto">
                  {info.chapters.map((chapter) => (
                    <Link
                      key={chapter.id}
                      href={`/practice/${sub}/${chapter.id}`}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl group hover:bg-violet-50 transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center shrink-0 group-hover:bg-violet-100 group-hover:text-violet-600 transition-colors">
                          {chapter.id}
                        </span>
                        <span className="text-sm text-slate-600 group-hover:text-violet-700 transition-colors leading-tight">
                          {chapter.name}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-violet-400 shrink-0 group-hover:translate-x-0.5 transition-all" />
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
          <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Sessions</h2>
          <div className="bg-white rounded-2xl border border-violet-100/60 shadow-sm overflow-hidden">
            {recentSessions.map((session, i) => {
              const pct = session.total_marks > 0
                ? Math.round((session.score / session.total_marks) * 100)
                : 0
              const scoreColor = pct >= 70 ? 'text-emerald-600 bg-emerald-50' : pct >= 40 ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50'
              return (
                <div
                  key={session.id}
                  className={`flex items-center justify-between px-5 py-3.5 ${i < recentSessions.length - 1 ? 'border-b border-slate-50' : ''} hover:bg-violet-50/40 transition-colors`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-lg shrink-0">
                      {SUBJECT_COLORS[session.subject]?.icon || '📚'}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800 capitalize">{session.subject}</div>
                      <div className="text-xs text-slate-400">Chapter {session.chapter}</div>
                    </div>
                  </div>
                  {session.completed ? (
                    <div className={`text-sm font-bold px-3 py-1 rounded-full ${scoreColor}`}>
                      {pct}%
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">In progress</span>
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
          className="flex items-center gap-4 bg-white rounded-2xl border border-violet-100/60 p-5 hover:border-violet-300 hover:shadow-md hover:shadow-violet-100/50 transition-all group"
        >
          <div className="w-11 h-11 bg-linear-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-amber-200 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-slate-900 group-hover:text-violet-700 transition-colors">Sample Papers & PYQs</div>
            <div className="text-xs text-slate-400 mt-0.5">Full papers in CBSE format</div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
        </Link>
        <Link
          href="/profile"
          className="flex items-center gap-4 bg-white rounded-2xl border border-violet-100/60 p-5 hover:border-violet-300 hover:shadow-md hover:shadow-violet-100/50 transition-all group"
        >
          <div className="w-11 h-11 bg-linear-to-br from-violet-500 to-indigo-500 rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-violet-200 group-hover:scale-105 transition-transform">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-slate-900 group-hover:text-violet-700 transition-colors">View Progress</div>
            <div className="text-xs text-slate-400 mt-0.5">Track your improvement</div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>
    </div>
  )
}
