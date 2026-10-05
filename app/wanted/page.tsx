'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function WantedPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <nav style={{
        borderBottom: '1px solid #2A2A2A', background: 'rgba(13,13,13,0.95)',
        padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(8px)',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img src="/logo_nofold.png" alt="Merch&Memes" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
          <span style={{ fontWeight: 700, color: 'white', fontFamily: 'Space Grotesk, sans-serif' }}>Merch&Memes</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/browse" style={{ fontSize: '0.9rem', color: '#888', textDecoration: 'none' }}>Browse</Link>
          <Link href="/wanted" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white', textDecoration: 'none' }}>Anyone has...?</Link>
          <Link href="/about" style={{ fontSize: '0.9rem', color: '#888', textDecoration: 'none' }}>About</Link>
          <Link href="/submit" style={{
            fontSize: '0.9rem', fontWeight: 700, padding: '8px 18px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #627EEA, #DC1FFF)', color: 'white', textDecoration: 'none',
          }}>Contribute</Link>
        </div>
      </nav>

      <main style={{ background: '#0D0D0D', minHeight: '100vh', padding: '40px 24px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'white', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '8px' }}>
            Anyone has...?
          </h1>
          <p style={{ color: '#888', fontSize: '0.95rem', marginBottom: '32px', lineHeight: 1.6 }}>
            Looking for a specific piece of Web3 merch or memorabilia? Post your request here and check back to see if someone responds. Since we don't have accounts yet, responses will appear directly below each request.
          </p>

          {submitted ? (
            <div style={{ background: '#1A1A1A', borderRadius: '12px', padding: '24px', marginBottom: '32px', border: '1px solid #2A2A2A', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>✅</div>
              <p style={{ color: 'white', fontWeight: 600, marginBottom: '8px' }}>Request posted!</p>
              <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '16px' }}>Check back here to see if someone responds.</p>
              <button onClick={() => { setTitle(''); setDescription(''); setImage(null); setSubmitted(false) }}
                style={{ background: '#2A2A2A', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                Post another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: '#1A1A1A', borderRadius: '12px', padding: '24px', marginBottom: '40px', border: '1px solid #2A2A2A' }}>
              <h2 style={{ color: 'white', fontWeight: 600, fontSize: '1.1rem', marginBottom: '20px' }}>Post a request</h2>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#999', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>What are you looking for?</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Devcon 2 hoodie"
                  required
                  style={{ width: '100%', background: '#0D0D0D', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '10px 14px', color: 'white', fontSize: '0.95rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#999', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Tell us more</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Any details about the item, size, colour, year, or why you're looking for it..."
                  rows={4}
                  style={{ width: '100%', background: '#0D0D0D', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '10px 14px', color: 'white', fontSize: '0.95rem', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ color: '#999', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Upload a picture of what you're looking for (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setImage(e.target.files?.[0] || null)}
                  style={{ color: '#888', fontSize: '0.85rem' }}
                />
              </div>

              <button type="submit"
                style={{ background: 'linear-gradient(135deg, #627EEA, #DC1FFF)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>
                Post request
              </button>
            </form>
          )}

          <div style={{ color: '#555', textAlign: 'center', fontSize: '0.9rem' }}>
            No requests yet. Be the first to post one.
          </div>
        </div>
      </main>
    </>
  )
}