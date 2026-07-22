'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ModerationActions({
  submissionId,
  artefactId,
}: {
  submissionId: string
  artefactId: string
}) {
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)
  const router = useRouter()

  const handleAction = async (action: 'approve' | 'reject') => {
    if (action === 'reject' && !note.trim()) {
      alert('Please provide a reason for rejection.')
      return
    }
    setLoading(action)
    try {
      const res = await fetch('/api/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId, artefactId, action, note }),
      })
      if (!res.ok) throw new Error('Failed')
      router.refresh()
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="mt-4 space-y-3">
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Moderation note (required for rejection, optional for approval)"
        rows={2}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
      />
      <div className="flex gap-3">
        <button
          onClick={() => handleAction('approve')}
          disabled={loading !== null}
          className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-40"
        >
          {loading === 'approve' ? 'Approving...' : '✓ Approve'}
        </button>
        <button
          onClick={() => handleAction('reject')}
          disabled={loading !== null}
          className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-40"
        >
          {loading === 'reject' ? 'Rejecting...' : '✗ Reject'}
        </button>
      </div>
    </div>
  )
}