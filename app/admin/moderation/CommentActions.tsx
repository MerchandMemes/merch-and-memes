'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CommentActions({ commentId }: { commentId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleAction = async (action: 'hide' | 'keep') => {
    setLoading(action)
    const formData = new FormData()
    formData.append('commentId', commentId)
    formData.append('action', action)

    await fetch('/api/moderate-comment', {
      method: 'POST',
      body: formData,
    })

    router.refresh()
    setLoading(null)
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={() => handleAction('hide')}
        disabled={loading !== null}
        className="text-sm bg-red-600 text-white px-4 py-1.5 rounded-lg hover:bg-red-700 disabled:opacity-40"
      >
        {loading === 'hide' ? 'Hiding...' : 'Hide comment'}
      </button>
      <button
        onClick={() => handleAction('keep')}
        disabled={loading !== null}
        className="text-sm border border-gray-300 text-gray-600 px-4 py-1.5 rounded-lg hover:bg-gray-50 disabled:opacity-40"
      >
        {loading === 'keep' ? 'Saving...' : 'Keep (dismiss flags)'}
      </button>
    </div>
  )
}