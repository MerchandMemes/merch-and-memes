'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const EMOJIS = ['🔥', '💎', '🚀', '😂', '❤️']

function getSessionId() {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem('session_id')
  if (!id) {
    id = Math.random().toString(36).substring(2) + Date.now().toString(36)
    localStorage.setItem('session_id', id)
  }
  return id
}

export default function Reactions({ artefactId }: { artefactId: string }) {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [userReactions, setUserReactions] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState<string | null>(null)
  const sessionId = typeof window !== 'undefined' ? getSessionId() : ''

  useEffect(() => {
    fetchReactions()
  }, [artefactId])

  const fetchReactions = async () => {
    const { data } = await supabase
      .from('reactions')
      .select('emoji, session_id')
      .eq('artefact_id', artefactId)

    if (!data) return

    const newCounts: Record<string, number> = {}
    const myReactions = new Set<string>()
    const sid = getSessionId()

    data.forEach(r => {
      newCounts[r.emoji] = (newCounts[r.emoji] || 0) + 1
      if (r.session_id === sid) myReactions.add(r.emoji)
    })

    setCounts(newCounts)
    setUserReactions(myReactions)
  }

  const handleReaction = async (emoji: string) => {
    if (loading) return
    setLoading(emoji)
    const sid = getSessionId()

    if (userReactions.has(emoji)) {
      // Remove reaction
      await supabase
        .from('reactions')
        .delete()
        .eq('artefact_id', artefactId)
        .eq('emoji', emoji)
        .eq('session_id', sid)

      setUserReactions(prev => {
        const next = new Set(prev)
        next.delete(emoji)
        return next
      })
      setCounts(prev => ({ ...prev, [emoji]: Math.max(0, (prev[emoji] || 1) - 1) }))
    } else {
      // Add reaction
      await supabase
        .from('reactions')
        .insert({ artefact_id: artefactId, emoji, session_id: sid })

      setUserReactions(prev => new Set([...prev, emoji]))
      setCounts(prev => ({ ...prev, [emoji]: (prev[emoji] || 0) + 1 }))
    }

    setLoading(null)
  }

  return (
    <div className="mt-6">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        React to this artefact
      </p>
      <div className="flex gap-2 flex-wrap">
        {EMOJIS.map(emoji => (
          <button
            key={emoji}
            onClick={() => handleReaction(emoji)}
            disabled={loading === emoji}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full border text-sm font-medium transition-all ${
              userReactions.has(emoji)
                ? 'bg-gray-900 border-gray-900 text-white'
                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'
            }`}
          >
            <span>{emoji}</span>
            {counts[emoji] ? (
              <span className={userReactions.has(emoji) ? 'text-gray-300' : 'text-gray-400'}>
                {counts[emoji]}
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  )
}