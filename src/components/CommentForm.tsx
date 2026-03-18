'use client'

import { useState, useRef } from 'react'
import { submitComment } from '@/lib/actions/comments'
import { Send, Loader2, CheckCircle2, Info } from 'lucide-react'

interface CommentFormProps {
  articleId: string
  articleSlug: string
}

const MAX_CHARS = 2000
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function CommentForm({ articleId, articleSlug }: CommentFormProps) {
  const [isPending, setIsPending]       = useState(false)
  const [success, setSuccess]           = useState(false)
  const [formError, setFormError]       = useState<string | null>(null)
  const [emailError, setEmailError]     = useState<string | null>(null)
  const [nameError, setNameError]       = useState<string | null>(null)
  const [bodyError, setBodyError]       = useState<string | null>(null)
  const [charCount, setCharCount]       = useState(0)
  const formRef = useRef<HTMLFormElement>(null)

  // ── Live email validation ──────────────────────────────────────────────────
  function handleEmailBlur(e: React.FocusEvent<HTMLInputElement>) {
    const val = e.target.value.trim()
    if (val && !EMAIL_RE.test(val)) {
      setEmailError('Please enter a valid email address (e.g. you@example.com).')
    } else {
      setEmailError(null)
    }
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Clear error as soon as the user starts correcting
    if (emailError && EMAIL_RE.test(e.target.value.trim())) setEmailError(null)
  }

  // ── Client-side pre-flight ─────────────────────────────────────────────────
  function validate(fd: FormData): boolean {
    const name  = (fd.get('guest_name') as string).trim()
    const email = (fd.get('guest_email') as string).trim()
    const body  = (fd.get('body') as string).trim()
    let ok = true

    setNameError(name ? null : 'Name is required.')
    if (!name) ok = false

    if (email && !EMAIL_RE.test(email)) {
      setEmailError('Please enter a valid email address (e.g. you@example.com).')
      ok = false
    } else {
      setEmailError(null)
    }

    if (!body) {
      setBodyError('Comment cannot be empty.')
      ok = false
    } else if (body.length < 5) {
      setBodyError('Comment is too short — please write at least 5 characters.')
      ok = false
    } else if (body.length > MAX_CHARS) {
      setBodyError(`Comment is too long (max ${MAX_CHARS} characters).`)
      ok = false
    } else {
      setBodyError(null)
    }

    return ok
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError(null)

    const fd = new FormData(e.currentTarget)
    if (!validate(fd)) return        // stop if client-side validation fails

    setIsPending(true)
    const result = await submitComment({
      article_id:   articleId,
      article_slug: articleSlug,
      guest_name:   fd.get('guest_name') as string,
      guest_email:  fd.get('guest_email') as string,
      body:         fd.get('body') as string,
    })
    setIsPending(false)

    if (result.success) {
      setSuccess(true)
      formRef.current?.reset()
      setCharCount(0)
    } else {
      setFormError(result.error ?? 'Something went wrong. Please try again.')
    }
  }

  // ── Success state ─────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 border border-[#E8E2D9] bg-[#FAFAF9] px-8">
        <CheckCircle2 size={32} className="text-accent" />
        <div>
          <p className="font-display text-xl text-text mb-2">Thank you for your comment!</p>
          <p className="font-body text-sm text-muted">
            Your comment is now awaiting review. Once our team approves it, it will appear below the article.
          </p>
        </div>
        <button
          onClick={() => setSuccess(false)}
          className="font-body text-[10px] uppercase tracking-[0.2em] text-accent border border-accent/30 px-6 py-2 hover:bg-accent hover:text-white transition-colors mt-2"
        >
          Write another
        </button>
      </div>
    )
  }

  // ── Field styles ──────────────────────────────────────────────────────────
  const inputBase = `
    w-full font-body text-sm text-text bg-white border
    px-4 py-3 outline-none transition-colors placeholder:text-[#C4BDB4]
  `
  const inputOk  = 'border-[#E8E2D9] focus:border-accent'
  const inputErr = 'border-red-300 focus:border-red-400 bg-red-50/30'

  return (
    <>
      {/* ── Moderation notice ────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 bg-[#FAFAF9] border border-[#E8E2D9] px-5 py-4 mb-6">
        <Info size={14} className="text-accent mt-0.5 flex-shrink-0" />
        <p className="font-body text-xs text-muted leading-relaxed">
          <span className="font-bold text-text">Comments are reviewed before publishing.</span>{' '}
          Your comment won&apos;t appear right away — our team reads every submission and approves
          it before it goes live. This keeps the conversation respectful and on-topic.
        </p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block font-body text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
              Name <span className="text-accent">*</span>
            </label>
            <input
              name="guest_name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              onChange={() => nameError && setNameError(null)}
              className={`${inputBase} ${nameError ? inputErr : inputOk}`}
            />
            {nameError && (
              <p className="font-body text-[10px] text-red-500 mt-1">{nameError}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block font-body text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
              Email{' '}
              <span className="text-[#C4BDB4] normal-case tracking-normal">
                (optional — never published)
              </span>
            </label>
            <input
              name="guest_email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              onBlur={handleEmailBlur}
              onChange={handleEmailChange}
              className={`${inputBase} ${emailError ? inputErr : inputOk}`}
            />
            {emailError && (
              <p className="font-body text-[10px] text-red-500 mt-1">{emailError}</p>
            )}
          </div>
        </div>

        {/* Comment body */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <label className="block font-body text-[10px] uppercase tracking-[0.2em] text-muted">
              Comment <span className="text-accent">*</span>
            </label>
            <span className={`font-body text-[10px] ${charCount > MAX_CHARS ? 'text-red-500' : 'text-[#C4BDB4]'}`}>
              {charCount}/{MAX_CHARS}
            </span>
          </div>
          <textarea
            name="body"
            rows={5}
            placeholder="Share your thoughts, questions, or experience…"
            onChange={(e) => {
              setCharCount(e.target.value.length)
              if (bodyError) setBodyError(null)
            }}
            className={`${inputBase} resize-none ${bodyError ? inputErr : inputOk}`}
          />
          {bodyError && (
            <p className="font-body text-[10px] text-red-500 mt-1">{bodyError}</p>
          )}
        </div>

        {/* Server-level error */}
        {formError && (
          <p className="font-body text-xs text-red-600 bg-red-50 border border-red-100 px-4 py-3">
            {formError}
          </p>
        )}

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending || charCount > MAX_CHARS}
            className="inline-flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.2em] font-bold
              bg-accent text-white px-8 py-3 hover:bg-accent/90 disabled:opacity-60 transition-colors"
          >
            {isPending ? (
              <><Loader2 size={12} className="animate-spin" /> Submitting…</>
            ) : (
              <><Send size={12} /> Submit Comment</>
            )}
          </button>
        </div>
      </form>
    </>
  )
}
