'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { apiUrl } from '@/lib/lib/api'

interface Correction {
  id: string
  content: string
  credit_as: string | null
  created_at: string
}

export default function Corrections({ artefactId }: { artefactId: string }) {
  const [corrections, setCorrections] = useState<Correction[]>([])
  const [content, setContent] = useState('')
  const [credit, setCredit] = useState('')
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase
      .from('corrections')
      .select('id, content, credit_as, created_at')
      .eq('artefact_id', artefactId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) setCorrections(data)
      })
  }, [artefactId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch(apiUrl('/api/correction'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artefactId, content, creditAs: credit }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setCorrections(prev => [...prev, data])
      setContent('')
      setCredit('')
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ borderTop: '1px solid #2A2A2A', paddingTop: '24px', marginTop: '24px' }}>

      <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
        Corrections {corrections.length > 0 && `· ${corrections.length}`}
      </p>

      <p style={{ fontSize: '0.85rem', color: '#777', lineHeight: 1.6, marginBottom: '16px' }}>
        Something wrong or missing? Corrections are added beneath the entry, never written over it —
        the original stays visible alongside.
      </p>

      {corrections.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          {corrections.map((c) => (
            <div key={c.id} style={{
              background: 'rgba(98,126,234,0.06)',
              borderLeft: '2px solid #627EEA',
              borderRadius: '6px',
              padding: '10px 14px',
              marginBottom: '8px',
            }}>
              <p style={{ fontSize: '0.85rem', color: '#bbb', lineHeight: 1.6, marginBottom: '4px' }}>{c.content}</p>
              <p style={{ fontSize: '0.7rem', color: '#555' }}>
                {c.credit_as || 'Anonymous'} · {new Date(c.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {submitted ? (
        <div style={{ background: '#1A1A1A', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '6px' }}>Correction added.</p>
          <button
            onClick={() => setSubmitted(false)}
            style={{ fontSize: '0.8rem', color: '#627EEA', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Add another
          </button>
        </div>
      ) : open ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="What needs correcting?"
            rows={2}
            maxLength={1000}
            required
            style={{ width: '100%', background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '10px 14px', fontSize: '0.85rem', color: '#F5F5F5', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
          />
          <input
            value={credit}
            onChange={e => setCredit(e.target.value)}
            placeholder="Credit as (optional)"
            maxLength={60}
            style={{ width: '100%', background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '8px 14px', fontSize: '0.85rem', color: '#F5F5F5', outline: 'none', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: '0.7rem', color: '#555' }}>{content.length}/1000</p>
            {error && <p style={{ fontSize: '0.7rem', color: '#FF4444' }}>{error}</p>}
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              style={{
                background: '#627EEA', color: 'white', border: 'none', padding: '8px 16px',
                borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600,
                cursor: submitting || !content.trim() ? 'not-allowed' : 'pointer',
                opacity: submitting || !content.trim() ? 0.4 : 1,
              }}
            >
              {submitting ? 'Adding...' : 'Add correction'}
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setOpen(true)}
          style={{ fontSize: '0.8rem', color: '#627EEA', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
        >
          Add a correction
        </button>
      )}
    </div>
  )
}
