'use client'

import { useState } from 'react'
import Link from 'next/link'

const CATEGORIES = [
  { name: 'Hoodies & Sweatshirts', slug: 'hoodies-sweatshirts', licence: 'CC0' },
  { name: 'T-Shirts', slug: 't-shirts', licence: 'CC0' },
  { name: 'Caps & Hats', slug: 'caps-hats', licence: 'CC0' },
  { name: 'Stickers', slug: 'stickers', licence: 'CC0' },
  { name: 'Badges & Pins', slug: 'badges-pins', licence: 'CC0' },
  { name: 'Posters & Flyers', slug: 'posters-flyers', licence: 'CC0' },
  { name: 'Hardware', slug: 'hardware', licence: 'CC0' },
  { name: 'Other Merchandise', slug: 'other-merchandise', licence: 'CC0' },
  { name: 'Memes', slug: 'memes', licence: 'CC BY 4.0' },
  { name: 'Photography', slug: 'photography', licence: 'CC BY 4.0' },
  { name: 'Artwork & Illustrations', slug: 'artwork-illustrations', licence: 'CC BY 4.0' },
  { name: 'Publications', slug: 'publications', licence: 'CC BY 4.0' },
  { name: 'Screenshots', slug: 'screenshots', licence: 'CC BY 4.0' },
  { name: 'POAPs', slug: 'poaps', licence: 'CC BY 4.0' },
]

const inputStyle = {
  width: '100%',
  background: '#1A1A1A',
  border: '1px solid #2A2A2A',
  borderRadius: '10px',
  padding: '12px 16px',
  fontSize: '0.95rem',
  color: '#F5F5F5',
  outline: 'none',
  boxSizing: 'border-box' as const,
}

const labelStyle = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: 600,
  color: '#888',
  marginBottom: '6px',
}

const submitResponsiveStyle = `
  @media (max-width: 420px) {
    .submit-category-grid { grid-template-columns: 1fr !important; }
  }
`

export default function SubmitPage() {
  const [step, setStep] = useState(1)

  const goToStep = (n: number) => {
    setStep(n)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  const [selectedCategory, setSelectedCategory] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [story, setStory] = useState('')
  const [year, setYear] = useState('')
  const [source, setSource] = useState('')
  const [notificationEmail, setNotificationEmail] = useState('')
  const [rightsConfirmed, setRightsConfirmed] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const selectedCat = CATEGORIES.find(c => c.slug === selectedCategory)
  const isMeme = ['memes', 'photography', 'artwork-illustrations', 'screenshots'].includes(selectedCategory)

  const resetForm = () => {
    setSubmitted(false); setStep(1); setSelectedCategory(''); setTitle('')
    setDescription(''); setStory(''); setYear(''); setSource('')
    setRightsConfirmed(false); setFile(null); setNotificationEmail('')
  }

  const compressImage = (input: File): Promise<File> => {
    return new Promise((resolve) => {
      if (input.type === 'application/pdf') { resolve(input); return }
      const img = new window.Image()
      const reader = new FileReader()
      reader.onload = () => {
        img.onload = () => {
          const maxDimension = 1920
          let { width, height } = img
          if (width > maxDimension || height > maxDimension) {
            if (width > height) { height = Math.round((height * maxDimension) / width); width = maxDimension }
            else { width = Math.round((width * maxDimension) / height); height = maxDimension }
          }
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          if (!ctx) { resolve(input); return }
          ctx.drawImage(img, 0, 0, width, height)
          canvas.toBlob((blob) => {
            if (!blob) { resolve(input); return }
            resolve(new File([blob], input.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }))
          }, 'image/jpeg', 0.82)
        }
        img.onerror = () => resolve(input)
        img.src = reader.result as string
      }
      reader.onerror = () => resolve(input)
      reader.readAsDataURL(input)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rightsConfirmed) { setError('Please confirm you have the rights to submit this content.'); return }
    if (!file) { setError('Please select an image to upload.'); return }
    setSubmitting(true); setError('')
    try {
      const uploadFile = await compressImage(file)
      const formData = new FormData()
      formData.append('file', uploadFile)
      formData.append('title', title)
      formData.append('description', description)
      formData.append('story', story)
      formData.append('category', selectedCategory)
      formData.append('year', year)
      formData.append('source', source)
      formData.append('notificationEmail', notificationEmail)
      const res = await fetch('/api/submit', { method: 'POST', body: formData })
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || 'Submission failed') }
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <main style={{ background: '#0D0D0D', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5F5F5' }}>
        <div style={{ textAlign: 'center', maxWidth: '480px', padding: '0 24px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '24px' }}>🎉</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', marginBottom: '16px', color: 'white' }}>
            Submission received
          </h1>
          <p style={{ color: '#999', marginBottom: '16px', lineHeight: 1.7 }}>
            Your artefact is now in the moderation queue and will be reviewed before publication.
          </p>
          <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '12px', padding: '16px', marginBottom: '32px', textAlign: 'left' }}>
            <p style={{ fontSize: '0.9rem', color: '#888', lineHeight: 1.7 }}>
              <span style={{ fontWeight: 600, color: '#F5F5F5' }}>When will it appear?</span><br />
              Moderation happens during daytime European hours (CET/CEST). If you are submitting
              from the US or Asia, your artefact will typically be reviewed the following morning
              European time. We appreciate your patience, every submission is reviewed by a human.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link href="/browse" style={{
              padding: '12px 24px', borderRadius: '12px', fontWeight: 700, textDecoration: 'none',
              background: 'linear-gradient(135deg, #627EEA, #DC1FFF)', color: 'white', fontSize: '0.95rem',
            }}>Browse the archive</Link>
            <button onClick={resetForm} style={{
              padding: '12px 24px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer',
              border: '1px solid #2A2A2A', background: 'transparent', color: '#F5F5F5', fontSize: '0.95rem',
            }}>Submit another</button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main style={{ background: '#0D0D0D', minHeight: '100vh', color: '#F5F5F5' }}>

      {/* Navigation */}
      <nav style={{
        borderBottom: '1px solid #2A2A2A', background: 'rgba(13,13,13,0.95)',
        padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(8px)',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img src="/logo_nofold.png" alt="Merch&Memes" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
          <span style={{ fontWeight: 700, color: 'white', fontFamily: 'Space Grotesk, sans-serif' }}>Merch&Memes</span>
        </Link>
        <Link href="/browse" style={{ fontSize: '0.9rem', color: '#888', textDecoration: 'none' }}>Browse</Link>
      </nav>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '48px 24px' }}>

        <h1 style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: 'white', marginBottom: '8px' }}>
          Contribute an artefact
        </h1>
        <p style={{ color: '#666', marginBottom: '40px' }}>Share a piece of Web3 history with the community.</p>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          {[1, 2, 3].map((s) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700,
                background: step >= s ? 'linear-gradient(135deg, #627EEA, #DC1FFF)' : '#1A1A1A',
                color: step >= s ? 'white' : '#444',
                border: step >= s ? 'none' : '1px solid #2A2A2A',
              }}>{s}</div>
              {s < 3 && <div style={{ width: '48px', height: '1px', background: step > s ? '#627EEA' : '#2A2A2A' }} />}
            </div>
          ))}
          <span style={{ fontSize: '0.85rem', color:'#999', marginLeft: '8px' }}>
            {step === 1 ? 'Choose category' : step === 2 ? 'Add details' : 'Confirm & submit'}
          </span>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', marginBottom: '20px' }}>
              What are you contributing?
            </h2>
                        <style>{submitResponsiveStyle}</style>
            <div className="submit-category-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
                            {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => { setSelectedCategory(cat.slug); goToStep(2) }}
                  style={{
                    textAlign: 'left', padding: '14px 16px', borderRadius: '12px', cursor: 'pointer',
                    border: selectedCategory === cat.slug ? '2px solid #627EEA' : '1px solid #2A2A2A',
                    background: selectedCategory === cat.slug ? 'rgba(98,126,234,0.15)' : '#1A1A1A',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: selectedCategory === cat.slug ? '#627EEA' : '#F5F5F5', marginBottom: '2px' }}>
                    {cat.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: selectedCategory === cat.slug ? '#627EEA' : '#555' }}>
                    {cat.licence}
                  </div>
                </button>
              ))}
            </div>
                      </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <form onSubmit={(e) => { e.preventDefault(); goToStep(3) }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              <div>
                <label style={labelStyle}>Title <span style={{ color: '#DC1FFF' }}>*</span></label>
                <input required value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Devcon IV Hoodie, Berlin 2018" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="Brief description of the artefact" rows={3}
                  style={{ ...inputStyle, resize: 'none' }} />
              </div>

              <div>
                <label style={labelStyle}>Your story</label>
                <textarea value={story} onChange={e => setStory(e.target.value)}
                  placeholder="Tell us the story behind this artefact. Where did you get it? What does it mean to you?"
                  rows={4} style={{ ...inputStyle, resize: 'none' }} />
              </div>

              <div>
                <label style={labelStyle}>Approximate year</label>
                <input type="number" value={year} onChange={e => setYear(e.target.value)}
                  placeholder="e.g. 2018" min="2008" max="2030" style={inputStyle} />
              </div>

              {isMeme && (
                <div>
                  <label style={labelStyle}>Source <span style={{ color: '#DC1FFF' }}>*</span></label>
                  <input required={isMeme} value={source} onChange={e => setSource(e.target.value)}
                    placeholder="Where did this originate? URL, platform, community..." style={inputStyle} />
                </div>
              )}

              <div>
                <label style={labelStyle}>Image <span style={{ color: '#DC1FFF' }}>*</span></label>
                <input type="file" accept="image/*,.heic,.heif,application/pdf"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                  style={{ ...inputStyle, padding: '10px 16px' }} />
                <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '6px' }}>
                  JPG, PNG, GIF, WebP, HEIC or PDF. Max 50MB.
                </p>
              </div>

              <div style={{ borderTop: '1px solid #2A2A2A', paddingTop: '20px' }}>
                <label style={labelStyle}>
                  Notification email <span style={{ color: '#555', fontWeight: 400 }}>(optional)</span>
                </label>
                <input type="email" value={notificationEmail} onChange={e => setNotificationEmail(e.target.value)}
                  placeholder="Reaction notifications coming soon, leave your email to be first"
                  style={inputStyle} />
                <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '6px' }}>
                  Only used for reaction notifications. Never shared or used for anything else.
                </p>
              </div>

            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
              <button type="button" onClick={() => goToStep(1)} style={{
                flex: 1, padding: '14px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer',
                border: '1px solid #2A2A2A', background: 'transparent', color: '#F5F5F5', fontSize: '0.95rem',
              }}>Back</button>
              <button type="submit" style={{
                flex: 1, padding: '14px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer',
                border: 'none', background: 'linear-gradient(135deg, #627EEA, #DC1FFF)', color: 'white', fontSize: '0.95rem',
              }}>Continue</button>
            </div>
          </form>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <form onSubmit={handleSubmit}>
            <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
              <h2 style={{ fontWeight: 700, color: 'white', marginBottom: '16px', fontSize: '1rem' }}>Review your submission</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { label: 'Category', value: selectedCat?.name },
                  { label: 'Licence', value: selectedCat?.licence },
                  { label: 'Title', value: title },
                  year ? { label: 'Year', value: year } : null,
                  file ? { label: 'Image', value: file.name } : null,
                ].filter(Boolean).map((item: any) => (
                  <div key={item.label} style={{ display: 'flex', gap: '8px', fontSize: '0.9rem' }}>
                    <span style={{ color: '#999', minWidth: '80px' }}>{item.label}:</span>
                    <span style={{ color: '#F5F5F5', fontWeight: 500 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
              <p style={{ fontSize: '0.9rem', color: '#999', lineHeight: 1.7, marginBottom: '12px' }}>
                By submitting you confirm that you have the right to share this content and agree to the{' '}
                <Link href="/terms" style={{ color: '#627EEA' }}>Terms of Service</Link>.
                This artefact will be published under{' '}
                <span style={{ fontWeight: 600, color: '#F5F5F5' }}>{selectedCat?.licence}</span>
                {selectedCat?.licence === 'CC0'
                  ? <span style={{ color: '#666' }}> — no rights reserved, free for anyone to use</span>
                  : <span style={{ color: '#666' }}> — free to share with attribution to you</span>}.
              </p>
              <p style={{ fontSize: '0.8rem', color: '#999', lineHeight: 1.6, marginBottom: '16px' }}>
                Once approved, your artefact will be stored on IPFS and may remain accessible even if later removed from this site. This is a feature, not a bug — it is how the archive ensures long-term preservation.
              </p>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={rightsConfirmed} onChange={e => setRightsConfirmed(e.target.checked)} />
                <span style={{ fontSize: '0.9rem', color: '#ccc' }}>I understand and agree</span>
              </label>
            </div>

            {error && <p style={{ color: '#FF4444', fontSize: '0.9rem', marginBottom: '16px' }}>{error}</p>}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={() => goToStep(2)} style={{
                flex: 1, padding: '14px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer',
                border: '1px solid #2A2A2A', background: 'transparent', color: '#F5F5F5', fontSize: '0.95rem',
              }}>Back</button>
              <button type="submit" disabled={submitting || !rightsConfirmed} style={{
                flex: 1, padding: '14px', borderRadius: '12px', fontWeight: 700,
                border: 'none', fontSize: '0.95rem', color: 'white',
                background: 'linear-gradient(135deg, #627EEA, #DC1FFF)',
                cursor: submitting || !rightsConfirmed ? 'not-allowed' : 'pointer',
                opacity: submitting || !rightsConfirmed ? 0.4 : 1,
              }}>
                {submitting ? 'Submitting...' : 'Submit to archive'}
              </button>
            </div>
          </form>
        )}

      </div>
    </main>
  )
}