'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type WantedResponse = {
  id: string
  content: string
  created_at: string
}

type WantedPost = {
  id: string
  title: string
  description: string
  image_url: string | null
  created_at: string
  wanted_responses: WantedResponse[]
}

export default function WantedPage() {
  const [posts, setPosts] = useState<WantedPost[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [responseText, setResponseText] = useState<{ [key: string]: string }>({})

  const fetchPosts = async () => {
    const res = await fetch('/api/wanted')
    const data = await res.json()
    setPosts(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/wanted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      })
      const data = await res.json()
      console.log('Response:', data)
      setSubmitted(true)
      fetchPosts()
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const handleRespond = async (postId: string) => {
    const content = responseText[postId]
    if (!content) return
    await fetch('/api/wanted/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post_id: postId, content })
    })
    setResponseText(prev => ({ ...prev, [postId]: '' }))
    fetchPosts()
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
        <div className="wanted-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
  <Link href="/browse" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#A78BFA', textDecoration: 'none' }}>Browse</Link>
  <Link href="/wanted" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#A78BFA', textDecoration: 'none' }}>Anyone has...?</Link>
  <Link href="/about" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#A78BFA', textDecoration: 'none' }}>About</Link>
  <Link href="/submit" style={{
    fontSize: '0.9rem', fontWeight: 700, padding: '8px 18px', borderRadius: '10px',
    background: 'linear-gradient(135deg, #627EEA, #DC1FFF)', color: 'white', textDecoration: 'none',
  }}>Contribute</Link>
</div>
      </nav>

      <main style={{ background: '#0D0D0D', minHeight: '100vh', padding: '40px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'white', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '8px' }}>
            Anyone has...?
          </h1>
          <p style={{ color: '#888', fontSize: '0.95rem', marginBottom: '32px', lineHeight: 1.6 }}>
            Looking for a specific piece of Web3 merch or memorabilia? Post your request here and check back to see if someone responds. Since we don't have accounts yet, responses will appear directly below each request.
          </p>

          <div style={{
            display: 'flex',
            gap: '40px',
            alignItems: 'flex-start',
            flexDirection: 'column',
          }}
            className="wanted-layout"
          >
            {/* Left: Form */}
            <div style={{ width: '100%' }} className="wanted-form-col">
              {submitted ? (
                <div style={{ background: '#1A1A1A', borderRadius: '12px', padding: '24px', border: '1px solid #2A2A2A', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '12px' }}>✅</div>
                  <p style={{ color: 'white', fontWeight: 600, marginBottom: '8px' }}>Request posted!</p>
                  <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '16px' }}>Check back here to see if someone responds.</p>
                  <button onClick={() => { setTitle(''); setDescription(''); setSubmitted(false) }}
                    style={{ background: '#2A2A2A', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                    Post another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ background: '#1A1A1A', borderRadius: '12px', padding: '24px', border: '1px solid #2A2A2A' }}>
                  <h2 style={{ color: 'white', fontWeight: 600, fontSize: '1.1rem', marginBottom: '20px' }}>Post a request</h2>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ color: '#999', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>What are you looking for?</label>
                    <input
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="e.g. Devcon 2 hoodie"
                      required
                      style={{ width: '100%', background: '#ffffff', border: '1px solid #ddd', borderRadius: '8px', padding: '10px 14px', color: '#111', fontSize: '0.95rem', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ color: '#999', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Tell us more</label>
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Any details about the item, size, colour, year, or why you're looking for it..."
                      rows={4}
                      style={{ width: '100%', background: '#ffffff', border: '1px solid #ddd', borderRadius: '8px', padding: '10px 14px', color: '#111', fontSize: '0.95rem', resize: 'vertical', boxSizing: 'border-box' }}
                    />
                  </div>

                  <button type="submit"
                    style={{ background: 'linear-gradient(135deg, #627EEA, #DC1FFF)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>
                    Post request
                  </button>
                </form>
              )}
            </div>

            {/* Right: Posts list */}
            <div style={{ width: '100%' }} className="wanted-posts-col">
              <h2 style={{ color: 'white', fontWeight: 700, fontSize: '1.3rem', marginBottom: '20px', fontFamily: 'Space Grotesk, sans-serif', borderBottom: '1px solid #2A2A2A', paddingBottom: '12px' }}>
                🔍 Artefacts being looked for
              </h2>

              {loading ? (
                <p style={{ color: '#555', textAlign: 'center' }}>Loading requests...</p>
              ) : posts.length === 0 ? (
                <p style={{ color: '#555', textAlign: 'center' }}>No requests yet. Be the first to post one.</p>
              ) : (
                posts.map(post => (
                  <div key={post.id} style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
                    <p style={{ color: '#999', fontSize: '0.8rem', marginBottom: '8px' }}>{new Date(post.created_at).toLocaleDateString()}</p>
                    <h3 style={{ color: '#111', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>{post.title}</h3>
                    {post.description && <p style={{ color: '#333', fontSize: '0.9rem', marginBottom: '16px', lineHeight: 1.6 }}>{post.description}</p>}

                    {post.wanted_responses.length > 0 && (
                      <div style={{ borderTop: '1px solid #eee', paddingTop: '16px', marginBottom: '16px' }}>
                        <p style={{ color: '#999', fontSize: '0.8rem', marginBottom: '12px' }}>Responses:</p>
                        {post.wanted_responses.map(response => (
                          <div key={response.id} style={{ background: '#f5f5f5', borderRadius: '8px', padding: '12px', marginBottom: '8px' }}>
                            <p style={{ color: '#222', fontSize: '0.9rem' }}>{response.content}</p>
                            <p style={{ color: '#999', fontSize: '0.75rem', marginTop: '6px' }}>{new Date(response.created_at).toLocaleDateString()}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="Write a response..."
                        value={responseText[post.id] || ''}
                        onChange={e => setResponseText(prev => ({ ...prev, [post.id]: e.target.value }))}
                        style={{ flex: 1, background: '#ffffff', border: '1px solid #ddd', borderRadius: '8px', padding: '8px 12px', color: '#111', fontSize: '0.9rem' }}
                      />
                      <button onClick={() => handleRespond(post.id)}
                        style={{ background: '#111', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                        Reply
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @media (min-width: 768px) {
          .wanted-layout {
            flex-direction: row !important;
          }
          .wanted-form-col {
            width: 360px !important;
            flex-shrink: 0;
            position: sticky;
            top: 80px;
          }
          .wanted-posts-col {
            flex: 1;
          }
        }
      `}</style>
    <style>{`
  @media (max-width: 720px) {
    .wanted-nav-links a:not(:last-child) { display: none !important; }
  }
`}</style>
    </>
  )
}