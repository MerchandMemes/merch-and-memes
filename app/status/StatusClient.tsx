'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Result = {
  status: string
  submitted_at: string | null
  reviewed_at: string | null
  note: string | null
  title: string | null
  artefact_id: string | null
}

const card = {
  background: '#1A1A1A',
  border: '1px solid #2A2A2A',
  borderRadius: '12px',
  padding: '20px',
}

export default function StatusClient() {
  const params = useSearchParams()
  const code = (params.get('code') || '').toUpperCase()
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (code.length !== 10) {
      setResult(null)
      setError('')
      return
    }
    let cancelled = false
    setLoading(true)
    setError('')
    setResult(null)
    Promise.resolve(supabase.rpc('get_submission_status', { p_code: code }))
      .then(({ data, error: rpcError }) => {
        if (cancelled) return
        if (rpcError) {
          setError('Could not reach the server. Try again.')
          return
        }
        const row = Array.isArray(data) ? data[0] : data
        if (!row) setError('No submission found for that code')
        else setResult(row as Result)
      })
      .catch(() => {
        if (!cancelled) setError('Could not reach the server. Try again.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [code])

  return (
    <main style={{ background: '#0D0D0D', minHeight: '100vh', color: '#F5F5F5' }}>

      <nav style={{
        borderBottom: '1px solid #2A2A2A', background: 'rgba(13,13,13,0.95)',
        padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(8px)',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img src="/logo_nofold.webp" alt="Merch&Memes" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
          <span style={{ fontWeight: 700, color: 'white', fontFamily: 'Space Grotesk, sans-serif' }}>Merch&Memes</span>
        </Link>
        <Link href="/browse" style={{ fontSize: '0.9rem', color: '#888', textDecoration: 'none' }}>Browse</Link>
      </nav>

      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '64px 24px' }}>

        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: 'white', marginBottom: '12px' }}>
          Submission status
        </h1>
        <p style={{ color: '#888', lineHeight: 1.7, marginBottom: '32px' }}>
          Enter the ten-character code you were given when you submitted. It looks like <code style={{ color: '#A78BFA' }}>K7M2QPX9RT</code> and is shown on the confirmation screen and in your notification email.
        </p>

        <form method="GET" action="/status" style={{ display: 'flex', gap: '8px', marginBottom: '40px' }}>
          <input
            name="code"
            defaultValue={code}
            maxLength={10}
            placeholder="Your code"
            style={{
              flex: 1, border: '1px solid #2A2A2A', borderRadius: '10px', padding: '12px 16px',
              fontSize: '1rem', background: '#1A1A1A', color: '#F5F5F5', outline: 'none',
              letterSpacing: '0.12em', textTransform: 'uppercase',
            }}
          />
          <button type="submit" style={{
            padding: '12px 22px', borderRadius: '10px', border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #627EEA, #DC1FFF)', color: 'white',
            fontSize: '0.95rem', fontWeight: 700,
          }}>Check</button>
        </form>

        {loading && <p style={{ color: '#888' }}>Checking…</p>}

        {error && (
          <div style={{ ...card, borderColor: '#3a2a2a' }}>
            <p style={{ color: '#FF8A8A' }}>{error}</p>
          </div>
        )}

        {result && result.status === 'pending' && (
          <div style={{ ...card, borderLeft: '3px solid #F7931A' }}>
            <p style={{ fontWeight: 700, color: 'white', marginBottom: '8px' }}>Still in the queue</p>
            <p style={{ color: '#999', lineHeight: 1.7 }}>
              Submitted{result.submitted_at ? ` on ${new Date(result.submitted_at).toLocaleDateString()}` : ''}. A human reviews every submission, usually during daytime European hours. Check back with the same code.
            </p>
          </div>
        )}

        {result && result.status === 'approved' && (
          <div style={{ ...card, borderLeft: '3px solid #00FFA3' }}>
            <p style={{ fontWeight: 700, color: 'white', marginBottom: '8px' }}>Published</p>
            <p style={{ color: '#999', lineHeight: 1.7, marginBottom: '16px' }}>
              {result.title ? `"${result.title}" is now in the archive.` : 'Your artefact is now in the archive.'}
            </p>
            {result.artefact_id && (
              <Link href={`/artefact/${result.artefact_id}`} style={{
                display: 'inline-block', padding: '10px 20px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #00FFA3, #627EEA)', color: '#0D0D0D',
                fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem',
              }}>View it</Link>
            )}
          </div>
        )}

        {result && result.status === 'rejected' && (
          <div style={{ ...card, borderLeft: '3px solid #DC1FFF' }}>
            <p style={{ fontWeight: 700, color: 'white', marginBottom: '8px' }}>Not accepted</p>
            <p style={{ color: '#999', lineHeight: 1.7, marginBottom: result.note ? '16px' : 0 }}>
              This submission was declined and won&apos;t appear in the archive. You are welcome to submit again.
            </p>
            {result.note && (
              <p style={{ color: '#ccc', lineHeight: 1.7, background: '#111', borderRadius: '8px', padding: '12px 14px', margin: 0 }}>
                {result.note}
              </p>
            )}
          </div>
        )}

        <p style={{ color: '#555', fontSize: '0.85rem', marginTop: '40px' }}>
          Lost your code? <Link href="/submit" style={{ color: '#627EEA' }}>Submit again</Link> or use the feedback button.
        </p>

      </div>
    </main>
  )
}
