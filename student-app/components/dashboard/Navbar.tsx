'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Zap, LogOut, Menu, X, LayoutDashboard, FileText, User } from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { UserProfile } from '@/types'

interface NavbarProps {
  profile: UserProfile | null
}

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/papers', label: 'Papers', icon: FileText },
  { href: '/profile', label: 'Profile', icon: User },
]

export default function Navbar({ profile }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-40 glass">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-linear-to-br from-violet-600 to-indigo-500 rounded-lg flex items-center justify-center shadow-md shadow-violet-200/60">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900 hidden sm:block">StudyAce</span>
        </Link>

        {profile?.class && (
          <span className="hidden sm:inline-flex items-center text-xs font-semibold bg-violet-100 text-violet-700 px-2.5 py-1 rounded-full border border-violet-200/60">
            Class {profile.class}
          </span>
        )}

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 ml-4 flex-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-violet-100 text-violet-700'
                    : 'text-slate-500 hover:text-violet-600 hover:bg-violet-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          {profile && !profile.is_premium && (
            <Link
              href="/pricing"
              className="hidden sm:flex items-center gap-1.5 text-xs btn-primary px-3 py-1.5 rounded-full"
            >
              <Zap className="w-3.5 h-3.5" />
              Upgrade
            </Link>
          )}
          {profile?.is_premium && (
            <span className="hidden sm:flex items-center gap-1.5 text-xs bg-emerald-100 text-emerald-700 font-semibold px-3 py-1.5 rounded-full border border-emerald-200/60">
              <Zap className="w-3.5 h-3.5" />
              Premium
            </span>
          )}
          <button
            onClick={handleLogout}
            className="hidden md:flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-slate-500 hover:text-violet-600 p-2 rounded-lg hover:bg-violet-50 transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-violet-100 shadow-xl shadow-violet-100/20 md:hidden z-50 animate-slide-down">
          <nav className="flex flex-col p-3 gap-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-violet-100 text-violet-700'
                      : 'text-slate-600 hover:bg-violet-50 hover:text-violet-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              )
            })}
            {profile && !profile.is_premium && (
              <Link
                href="/pricing"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 transition-all"
              >
                <Zap className="w-4 h-4" />
                Upgrade to Premium
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all text-left"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
