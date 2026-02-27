'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Zap, LogOut, User, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { UserProfile } from '@/types'

interface NavbarProps {
  profile: UserProfile | null
}

export default function Navbar({ profile }: NavbarProps) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-40 h-16 bg-white border-b border-slate-200 flex items-center px-4 sm:px-6">
      <div className="flex items-center gap-3 flex-1">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900 hidden sm:block">StudyAce</span>
        </Link>
        {profile?.class && (
          <span className="hidden sm:inline-flex items-center text-xs font-medium bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">
            Class {profile.class}
          </span>
        )}
      </div>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-6">
        <Link href="/dashboard" className="text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium">
          Dashboard
        </Link>
        <Link href="/papers" className="text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium">
          Papers
        </Link>
        <Link href="/profile" className="text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium">
          Profile
        </Link>
      </nav>

      <div className="flex items-center gap-3 ml-4">
        {profile && !profile.is_premium && (
          <Link
            href="/pricing"
            className="hidden sm:flex items-center gap-1.5 text-xs bg-amber-500 hover:bg-amber-600 text-white font-semibold px-3 py-1.5 rounded-full transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            Upgrade
          </Link>
        )}
        {profile?.is_premium && (
          <span className="hidden sm:flex items-center gap-1.5 text-xs bg-emerald-100 text-emerald-700 font-semibold px-3 py-1.5 rounded-full">
            <Zap className="w-3.5 h-3.5" />
            Premium
          </span>
        )}
        <button
          onClick={handleLogout}
          className="hidden md:flex items-center gap-1.5 text-sm text-slate-600 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-slate-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-md md:hidden z-50">
          <nav className="flex flex-col py-2">
            {[
              { href: '/dashboard', label: 'Dashboard' },
              { href: '/papers', label: 'Papers' },
              { href: '/profile', label: 'Profile' },
              { href: '/pricing', label: 'Upgrade' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-3"
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 text-left"
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
