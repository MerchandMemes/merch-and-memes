'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
function CommentReactions({ commentId }: { commentId: string }) {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [mine, setMine] = useState<Set<string>>(new Set())
  const sessionId = typeof window !== 'undefined'
    ? (localStorage.getItem('session_id') || '')
    : ''

  useEffect(() => {
    supabase
      .from('comment_reactions')
      .select('emoji, session_id')
      .eq('comment_id', commentId)
      .then(({ data }) => {
        if (!data) return
        const c: Record<string, number> = {}
        const m = new Set<string>()
        data.forEach(r => {
          c[r.emoji] = (c[r.emoji] || 0) + 1
          if (r.session_id === sessionId) m.add(r.emoji)
        })
        setCounts(c)
        setMine(m)
      })
  }, [commentId])

  const toggle = async (emoji: string) => {
    if (mine.has(emoji)) {
      await supabase.from('comment_reactions').delete()
        .eq('comment_id', commentId).eq('emoji', emoji).eq('session_id', sessionId)
      setMine(prev => { const n = new Set(prev); n.delete(emoji); return n })
      setCounts(prev => ({ ...prev, [emoji]: Math.max(0, (prev[emoji] || 1) - 1) }))
    } else {
      await supabase.from('comment_reactions').insert({ comment_id: commentId, emoji, session_id: sessionId })
      setMine(prev => new Set([...prev, emoji]))
      setCounts(prev => ({ ...prev, [emoji]: (prev[emoji] || 0) + 1 }))
    }
  }

  return (
    <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
      {['👍', '❤️', '😂'].map(emoji => (
        <button
          key={emoji}
          onClick={() => toggle(emoji)}
          style={{
            background: mine.has(emoji) ? 'rgba(98,126,234,0.2)' : 'rgba(255,255,255,0.05)',
            border: mine.has(emoji) ? '1px solid #627EEA' : '1px solid #2A2A2A',
            borderRadius: '999px',
            padding: '4px 10px',
            fontSize: '0.8rem',
            cursor: 'pointer',
            color: mine.has(emoji) ? '#627EEA' : '#888',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.15s',
          }}
        >
          {emoji}{counts[emoji] ? ` ${counts[emoji]}` : ''}
        </button>
      ))}
    </div>
  )
}

interface Comment {
  id: string
  display_name: string | null
  content: string
  created_at: string
  flag_count: number
}

export default function Comments({ artefactId }: { artefactId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [flagged, setFlagged] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchComments()
    const stored = localStorage.getItem('flagged_comments')
    if (stored) setFlagged(new Set(JSON.parse(stored)))
  }, [artefactId])

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('id, display_name, content, created_at, flag_count')
      .eq('artefact_id', artefactId)
      .eq('is_visible', true)
      .order('created_at', { ascending: true })
    if (data) setComments(data)
  }

  const handleFlag = async (commentId: string) => {
    if (flagged.has(commentId)) return
    await supabase.rpc('increment_comment_flag', { comment_id: commentId })
    await fetch('/api/flag-comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commentId }),
    })
    const next = new Set([...flagged, commentId])
    setFlagged(next)
    localStorage.setItem('flagged_comments', JSON.stringify([...next]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    setSubmitting(true)
    setError('')
    const { error: insertError } = await supabase
      .from('comments')
      .insert({ artefact_id: artefactId, display_name: name.trim() || null, content: content.trim() })
    if (insertError) {
      setError('Something went wrong. Please try again.')
    } else {
      setSubmitted(true)
      setContent('')
      setName('')
      await fetchComments()
    }
    setSubmitting(false)
  }

  return (
    <div style={{ marginTop: '32px', borderTop: '1px solid #2A2A2A', paddingTop: '32px' }}>

      <h2 style={{ fontSize: '0.7rem', fontWeight: 700, color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '24px' }}>
        Comments {comments.length > 0 && `· ${comments.length}`}
      </h2>

      {/* Existing comments */}
      {comments.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          {comments.map((comment) => (
            <div key={comment.id} style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #627EEA, #DC1FFF)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, color: 'white',
                  }}>
                    {comment.display_name ? comment.display_name[0].toUpperCase() : '?'}
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#F5F5F5' }}>
                    {comment.display_name || 'Anonymous'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#555' }}>
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={() => handleFlag(comment.id)}
                  disabled={flagged.has(comment.id)}
                  title={flagged.has(comment.id) ? 'You have already flagged this comment' : 'Flag this comment for moderation — we encourage open exchange and only moderate illegal or abusive content'}
                  style={{
                    background: 'none', border: 'none', cursor: flagged.has(comment.id) ? 'default' : 'pointer',
                    color: flagged.has(comment.id) ? '#333' : '#444', fontSize: '0.75rem', padding: '4px 8px',
                    borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px',
                  }}
                >
                  {flagged.has(comment.id) ? '✓ flagged' : '⚑ flag'}
                </button>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#ccc', lineHeight: 1.7 }}>{comment.content}</p>
              <CommentReactions commentId={comment.id} />
            </div>
          ))}
          <div style={{ borderTop: '1px solid #2A2A2A', marginTop: '8px', marginBottom: '24px' }} />
        </div>
      )}

      {/* Comment form */}
      <p style={{ fontSize: '1rem', fontWeight: 600, color: '#627EEA', marginBottom: '16px' }}>
        Leave a comment
      </p>

      {submitted ? (
        <div style={{ background: '#1A1A1A', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '8px' }}>Comment posted.</p>
          <button
            onClick={() => setSubmitted(false)}
            style={{ fontSize: '0.85rem', color: '#627EEA', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Add another comment
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name or handle (optional)"
            maxLength={50}
            style={{ width: '100%', background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '10px 14px', fontSize: '0.9rem', color: '#F5F5F5', outline: 'none', boxSizing: 'border-box' }}
          />
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Share a memory, ask a question, or add context..."
            rows={3}
            maxLength={500}
            required
            style={{ width: '100%', background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '10px 14px', fontSize: '0.9rem', color: '#F5F5F5', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: '0.75rem', color: '#555' }}>{content.length}/500</p>
            {error && <p style={{ fontSize: '0.75rem', color: '#FF4444' }}>{error}</p>}
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              style={{
                background: 'linear-gradient(135deg, #627EEA, #DC1FFF)',
                color: 'white', border: 'none', padding: '10px 20px',
                borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600,
                cursor: submitting || !content.trim() ? 'not-allowed' : 'pointer',
                opacity: submitting || !content.trim() ? 0.4 : 1,
              }}
            >
              {submitting ? 'Posting...' : 'Post comment'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}