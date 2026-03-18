'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Eye, EyeOff, Loader2, LogIn, AlertCircle } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0F0E0C]">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #C9963A22 0%, transparent 60%),
                              radial-gradient(circle at 80% 20%, #B85C3815 0%, transparent 50%)`
          }}
        />

        {/* Kente-inspired geometric pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="kente" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="30" height="30" fill="#C9963A"/>
                <rect x="30" y="30" width="30" height="30" fill="#C9963A"/>
                <rect x="10" y="10" width="10" height="10" fill="#FAF7F2"/>
                <rect x="40" y="40" width="10" height="10" fill="#FAF7F2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#kente)"/>
          </svg>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          {/* Logo */}
          <div>
            <span className="font-display text-2xl text-white tracking-wide">Ghana Trails</span>
            <div className="w-8 h-px bg-[#C9963A] mt-2" />
          </div>

          {/* Tagline */}
          <div className="space-y-6">
            <h1 className="font-display text-5xl xl:text-6xl text-white leading-tight">
              Manage your <br />
              <span className="text-[#C9963A]">stories.</span>
            </h1>
            <p className="font-body text-white/40 text-sm leading-relaxed max-w-sm">
              The Ghana Trails content management system. Create and publish articles, itineraries, and recipes that inspire West Africa travel.
            </p>
          </div>

          {/* Bottom badge */}
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-body text-white/30 text-xs uppercase tracking-widest">System operational</span>
          </div>
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex items-center justify-center bg-[#FAF7F2] px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-12 text-center">
            <span className="font-display text-3xl text-[#1C1C1C]">Ghana Trails</span>
            <div className="w-8 h-px bg-[#C9963A] mx-auto mt-2" />
          </div>

          <div className="space-y-2 mb-10">
            <h2 className="font-display text-4xl text-[#1C1C1C]">Sign in</h2>
            <p className="font-body text-sm text-[#7A7162]">Admin access only. Authorised contributors sign in below.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="font-body text-[10px] uppercase tracking-[0.2em] font-bold text-[#7A7162]">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white border border-[#E8E2D9] px-4 py-3.5 font-body text-sm text-[#1C1C1C] placeholder:text-[#C4BDB4] focus:outline-none focus:border-[#C9963A] transition-colors duration-200"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="font-body text-[10px] uppercase tracking-[0.2em] font-bold text-[#7A7162]">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-[#E8E2D9] px-4 py-3.5 pr-12 font-body text-sm text-[#1C1C1C] placeholder:text-[#C4BDB4] focus:outline-none focus:border-[#C9963A] transition-colors duration-200"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7A7162] hover:text-[#1C1C1C] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 text-red-700">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <p className="font-body text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-[#1C1C1C] text-white font-body text-sm font-bold uppercase tracking-[0.2em] px-6 py-4 hover:bg-[#C9963A] transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  <span>Sign in</span>
                </>
              )}
            </button>
          </form>

          <p className="mt-8 font-body text-xs text-[#7A7162]/60 text-center leading-relaxed">
            Restricted access. If you need an account, contact the site administrator.
          </p>
        </div>
      </div>
    </div>
  )
}
