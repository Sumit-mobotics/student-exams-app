import Link from 'next/link'
import { Brain, BookOpen, FileText, TrendingUp, CheckCircle, ArrowRight, Zap, Users, Award, Sparkles } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-linear-to-br from-violet-600 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-violet-200/60">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">StudyAce</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-500 hover:text-violet-600 transition-colors font-medium">Features</a>
            <a href="#how-it-works" className="text-sm text-slate-500 hover:text-violet-600 transition-colors font-medium">How it Works</a>
            <a href="#pricing" className="text-sm text-slate-500 hover:text-violet-600 transition-colors font-medium">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-600 hover:text-violet-600 font-medium transition-colors">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm btn-primary px-4 py-2 rounded-lg"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-24 pb-28 px-4 sm:px-6 overflow-hidden mesh-bg">
        {/* Decorative blur orbs */}
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-violet-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-300/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-48 h-48 bg-fuchsia-300/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/80 border border-violet-200 text-violet-700 text-sm font-medium px-4 py-1.5 rounded-full mb-8 animate-fade-in shadow-sm shadow-violet-100">
            <Sparkles className="w-4 h-4" />
            AI-Powered CBSE Preparation
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6 animate-slide-up delay-100">
            Ace Your CBSE Exams{' '}
            <br className="hidden sm:block" />
            with{' '}
            <span className="gradient-text">AI-Powered</span> Practice
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up delay-200">
            Personalised practice sessions, previous year style questions, and sample papers for
            Class 9–12 Science & Maths — all powered by AI. Study smarter, not harder.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-300">
            <Link
              href="/signup"
              className="flex items-center gap-2 btn-primary px-7 py-3.5 rounded-xl text-base animate-pulse-glow"
            >
              Start Practising Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#how-it-works"
              className="flex items-center gap-2 bg-white border border-slate-200 hover:border-violet-300 hover:text-violet-700 text-slate-600 font-medium px-7 py-3.5 rounded-xl transition-all text-base shadow-sm hover:shadow-md"
            >
              See How It Works
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-400 animate-fade-in delay-500">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-violet-400" />
              <span>Built for CBSE students</span>
            </div>
            <div className="w-px h-4 bg-slate-200" />
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-violet-400" />
              <span>Class 9–12 covered</span>
            </div>
            <div className="w-px h-4 bg-slate-200" />
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-violet-400" />
              <span>Powered by Groq AI</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 bg-violet-50 text-violet-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 border border-violet-100">
              Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Score High
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              From chapter-wise practice to full sample papers — we cover your entire CBSE syllabus.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Brain,
                gradient: 'from-violet-500 to-indigo-500',
                glow: 'shadow-violet-200',
                title: 'AI-Generated Questions',
                desc: 'Fresh, unique questions generated by Groq AI for every practice session — no repetition.',
              },
              {
                icon: BookOpen,
                gradient: 'from-emerald-500 to-teal-500',
                glow: 'shadow-emerald-200',
                title: 'Complete CBSE Syllabus',
                desc: 'All chapters for Science & Maths, Class 9–12. Biology, Physics, Chemistry — fully covered.',
              },
              {
                icon: FileText,
                gradient: 'from-amber-500 to-orange-500',
                glow: 'shadow-amber-200',
                title: 'Previous Year Style Papers',
                desc: 'Practice with questions modelled after CBSE board exam patterns from recent years.',
              },
              {
                icon: TrendingUp,
                gradient: 'from-rose-500 to-pink-500',
                glow: 'shadow-rose-200',
                title: 'Track Your Progress',
                desc: 'See your scores, time taken, and improvement across chapters and subjects.',
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm card-hover animate-fade-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-linear-to-br ${feature.gradient} shadow-lg ${feature.glow}`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 bg-linear-to-b from-violet-50/60 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 border border-indigo-100">
              How It Works
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Get Started in 3 Simple Steps</h2>
            <p className="text-slate-500 text-lg">No setup required. Just sign up and start practising.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-10 relative">
            {/* Connecting line */}
            <div className="hidden sm:block absolute top-9 left-[calc(33%_+_28px)] right-[calc(33%_+_28px)] h-px bg-linear-to-r from-violet-300 via-indigo-300 to-violet-300" />
            {[
              {
                step: '01',
                title: 'Sign Up & Choose Your Class',
                desc: 'Create a free account and select your class (9–12) and subjects.',
              },
              {
                step: '02',
                title: 'Select a Chapter & Mode',
                desc: 'Pick any chapter from your syllabus. Choose Quick Practice, Chapter Test, or PYQ style.',
              },
              {
                step: '03',
                title: 'Practice & Improve',
                desc: 'Answer AI-generated questions, get instant feedback, and track your progress.',
              },
            ].map((item, i) => (
              <div key={item.step} className="text-center relative z-10 animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="w-16 h-16 bg-linear-to-br from-violet-600 to-indigo-500 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-5 shadow-xl shadow-violet-200 animate-float" style={{ animationDelay: `${i * 300}ms` }}>
                  {item.step}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-white px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 border border-emerald-100">
              Pricing
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Simple, Affordable Pricing</h2>
            <p className="text-slate-500 text-lg">
              Start free — no credit card required. Upgrade when you&apos;re ready.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 items-start">
            {/* Free */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 card-hover shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Free</div>
              <div className="text-4xl font-bold text-slate-900 mb-1">₹0</div>
              <p className="text-sm text-slate-400 mb-6">Get started today</p>
              <ul className="space-y-3 mb-8">
                {['3 practice sessions', 'All subjects & chapters', 'AI-generated questions', 'Score & feedback'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-4 h-4 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3 h-3 text-slate-500" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block w-full text-center border-2 border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300 font-semibold py-3 rounded-xl transition-all text-sm">
                Get Started Free
              </Link>
            </div>

            {/* Monthly - Featured */}
            <div className="relative">
              <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
                <div className="bg-linear-to-r from-amber-400 to-orange-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-amber-200">
                  ⭐ MOST POPULAR
                </div>
              </div>
              <div className="rounded-2xl p-0.5 bg-linear-to-br from-violet-500 via-indigo-500 to-purple-600 shadow-2xl shadow-violet-200">
                <div className="bg-linear-to-br from-violet-600 to-indigo-600 rounded-[13px] p-6 pt-8">
                  <div className="text-xs font-bold text-violet-300 uppercase tracking-wider mb-3">Premium Monthly</div>
                  <div className="text-4xl font-bold text-white mb-1">₹99<span className="text-lg font-normal text-violet-300">/mo</span></div>
                  <p className="text-sm text-violet-300 mb-6">Billed monthly</p>
                  <ul className="space-y-3 mb-8">
                    {['Unlimited practice sessions', 'All subjects & chapters', 'Previous year questions', 'Sample papers', 'Progress tracking', 'Priority AI generation'].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-violet-100">
                        <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup" className="block w-full text-center bg-white text-violet-700 hover:bg-violet-50 font-bold py-3 rounded-xl transition-all text-sm shadow-xl hover:shadow-2xl">
                    Start for ₹99/month
                  </Link>
                </div>
              </div>
            </div>

            {/* Annual */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 card-hover shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Annual</div>
              <div className="text-4xl font-bold text-slate-900 mb-1">₹799<span className="text-lg font-normal text-slate-400">/yr</span></div>
              <p className="text-sm text-emerald-600 font-semibold mb-6 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Save 33% vs monthly
              </p>
              <ul className="space-y-3 mb-8">
                {['Everything in Monthly', 'Detailed analytics', 'Performance reports', 'Exam strategy guides', 'Priority support'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-4 h-4 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block w-full text-center border-2 border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300 font-semibold py-3 rounded-xl transition-all text-sm">
                Get Annual Plan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-linear-to-br from-violet-600 via-indigo-600 to-purple-700 rounded-3xl p-10 sm:p-14 text-center overflow-hidden animate-gradient">
            {/* Inner glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.12),transparent_65%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.3),transparent_60%)] pointer-events-none" />
            <div className="relative z-10">
              <Award className="w-14 h-14 text-violet-200 mx-auto mb-6 animate-float" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Score Higher in Your CBSE Exams?
              </h2>
              <p className="text-violet-200 text-lg mb-8 max-w-xl mx-auto">
                Join students who are already practising smarter with StudyAce.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-white text-violet-700 hover:bg-violet-50 font-bold px-8 py-4 rounded-xl transition-all text-base shadow-2xl hover:shadow-3xl hover:-translate-y-0.5 transform"
              >
                Start Practising Free — No Card Required
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-linear-to-br from-violet-600 to-indigo-500 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">StudyAce</span>
          </div>
          <p className="text-sm text-slate-400">© 2025 StudyAce. CBSE Class 9-12 AI Practice Platform.</p>
          <div className="flex gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-violet-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-violet-600 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
