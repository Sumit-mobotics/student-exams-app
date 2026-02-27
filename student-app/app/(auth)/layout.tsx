import Link from 'next/link'
import { Zap } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen mesh-bg flex flex-col">
      <header className="h-16 flex items-center px-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-linear-to-br from-violet-600 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-violet-200/60 group-hover:shadow-violet-300/60 transition-shadow">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 group-hover:text-violet-700 transition-colors">StudyAce</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>
    </div>
  )
}
