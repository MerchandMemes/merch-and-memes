'use client'

import { useState } from 'react'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const res = await fetch('/api/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      const next = new URLSearchParams(window.location.search).get('next')
      window.location.href = next && next.startsWith('/') ? next : '/admin/moderation'
    } else {
      setError(res.status === 500 ? 'ADMIN_PASSWORD is not set on the server.' : 'Wrong password.')
      setBusy(false)
    }
  }

  return (
    <main style={{ background: '#0D0D0D', minHeight: '100vh', color: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <form onSubmit={submit} style={{ width: '100%', maxWidth: '340px' }}>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px', fontFamily: 'Space Grotesk, sans-serif' }}>
          Moderation
        </h1>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          style={{ width: '100%', background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '12px 14px', fontSize: '0.95rem', color: '#F5F5F5', outline: 'none', boxSizing: 'border-box', marginBottom: '12px' }}
        />
        <button
          type="submit"
          disabled={busy || !password}
          style={{ width: '100%', background: 'linear-gradient(135deg, #627EEA, #DC1FFF)', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, cursor: busy || !password ? 'not-allowed' : 'pointer', opacity: busy || !password ? 0.5 : 1 }}
        >
          {busy ? 'Checking...' : 'Enter'}
        </button>
        {error && <p style={{ color: '#FF4444', fontSize: '0.85rem', marginTop: '12px' }}>{error}</p>}
      </form>
    </main>
  )
}
