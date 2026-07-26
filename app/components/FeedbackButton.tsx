'use client'

import { useState } from 'react'

export default function FeedbackButton() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, email }),
      })
      if (!res.ok) throw new Error('Failed')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
  onClick={() => { setOpen(true); setSubmitted(false); setMessage(''); setEmail(''); setError('') }}
  style={{
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    background: 'linear-gradient(135deg, #627EEA, #DC1FFF)',
    color: 'white',
    border: 'none',
    padding: '14px 24px',
    borderRadius: '999px',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 0 30px rgba(98,126,234,0.4)',
  }}
  aria-label="Send feedback"
>
  <span style={{ fontSize: '1.2rem' }}>💬</span>
  <span>Feedback</span>
</button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-6">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-20"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 mb-14">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg"
            >
              ✕
            </button>

            {submitted ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">🙏</div>
                <h3 className="font-bold text-gray-900 mb-2">Thank you</h3>
                <p className="text-sm text-gray-500">Your feedback helps shape the archive. We read everything.</p>
                <button
                  onClick={() => setOpen(false)}
                  className="mt-4 text-sm text-gray-400 underline hover:text-gray-600"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-gray-900 mb-1">Share your thoughts</h3>
                <p className="text-xs text-gray-400 mb-4">
                  Ideas, bugs, suggestions — anything goes. This goes directly to the team.
                </p>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="What's on your mind?"
                    rows={4}
                    required
                    maxLength={1000}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400 resize-none"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Your email (optional — if you want a reply)"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                  />
                  {error && <p className="text-xs text-red-500">{error}</p>}
                  <button
                    type="submit"
                    disabled={submitting || !message.trim()}
                    className="w-full bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-40"
                  >
                    {submitting ? 'Sending...' : 'Send feedback'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}