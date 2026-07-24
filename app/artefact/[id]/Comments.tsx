'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

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
      .insert({
        artefact_id: artefactId,
        display_name: name.trim() || null,
        content: content.trim(),
      })

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
    <div className="mt-8 border-t border-gray-200 pt-8">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
        Comments {comments.length > 0 && `· ${comments.length}`}
      </h2>

      {comments.length > 0 && (
        <div className="space-y-4 mb-8">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                    {comment.display_name ? comment.display_name[0].toUpperCase() : '?'}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {comment.display_name || 'Anonymous'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <button
  onClick={() => handleFlag(comment.id)}
  disabled={flagged.has(comment.id)}
  title={
    flagged.has(comment.id)
      ? 'You have already flagged this comment'
      : 'Flag this comment for moderation — we encourage open exchange and only moderate illegal or abusive content'
  }
  className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
    flagged.has(comment.id)
      ? 'text-gray-300 cursor-default'
      : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
  }`}
>
  {flagged.has(comment.id) ? (
    <span className="text-gray-300">✓ flagged</span>
  ) : (
    <>
      <span className="text-base leading-none">⚑</span>
      <span>flag</span>
    </>
  )}
</button>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
            </div>
          ))}
        </div>
      )}

      {submitted ? (
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-600 mb-2">Comment posted.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-sm text-gray-500 underline hover:text-gray-700"
          >
            Add another comment
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name or handle (optional)"
            maxLength={50}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gray-400"
          />
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Share a memory, ask a question, or add context..."
            rows={3}
            maxLength={500}
            required
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gray-400 resize-none"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">
              {content.length}/500
            </p>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-40"
            >
              {submitting ? 'Posting...' : 'Post comment'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}