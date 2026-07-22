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

export default function SubmitPage() {
  const [step, setStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [story, setStory] = useState('')
  const [year, setYear] = useState('')
  const [source, setSource] = useState('')
  const [rightsConfirmed, setRightsConfirmed] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const selectedCat = CATEGORIES.find(c => c.slug === selectedCategory)
  const isMeme = selectedCategory === 'memes' || selectedCategory === 'photography' || 
                  selectedCategory === 'artwork-illustrations' || selectedCategory === 'screenshots'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rightsConfirmed) {
      setError('Please confirm you have the rights to submit this content.')
      return
    }
    if (!file) {
      setError('Please select an image to upload.')
      return
    }
    setSubmitting(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', title)
      formData.append('description', description)
      formData.append('story', story)
      formData.append('category', selectedCategory)
      formData.append('year', year)
      formData.append('source', source)

      const res = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Submission failed')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="text-5xl mb-6">🎉</div>
          <h1 className="text-2xl font-black text-gray-900 mb-4">Submission received</h1>
          <p className="text-gray-500 mb-8">
            Your artefact is now in the moderation queue. We will review it shortly and publish it to the archive.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/browse" className="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
              Browse the archive
            </Link>
            <button
              onClick={() => { setSubmitted(false); setStep(1); setSelectedCategory(''); setTitle(''); setDescription(''); setStory(''); setYear(''); setSource(''); setRightsConfirmed(false); setFile(null) }}
              className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Submit another
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">M&M</span>
          </div>
          <span className="font-semibold text-gray-900">Merch&Memes</span>
          <span className="text-gray-400 text-sm">the web3 archive</span>
        </Link>
        <Link href="/browse" className="text-sm text-gray-600 hover:text-gray-900">Browse</Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">

        <h1 className="text-3xl font-black text-gray-900 mb-2">Contribute an artefact</h1>
        <p className="text-gray-500 mb-8">Share a piece of Web3 history with the community.</p>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-black text-white' : 'bg-gray-200 text-gray-400'}`}>
                {s}
              </div>
              {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-black' : 'bg-gray-200'}`} />}
            </div>
          ))}
          <span className="text-sm text-gray-500 ml-2">
            {step === 1 ? 'Choose category' : step === 2 ? 'Add details' : 'Confirm & submit'}
          </span>
        </div>

        {/* Step 1 — Category */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">What are you contributing?</h2>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`text-left p-4 rounded-xl border-2 transition-colors ${selectedCategory === cat.slug ? 'border-black bg-black text-white' : 'border-gray-200 bg-white hover:border-gray-400'}`}
                >
                  <div className="font-medium text-sm">{cat.name}</div>
                  <div className={`text-xs mt-1 ${selectedCategory === cat.slug ? 'text-gray-300' : 'text-gray-400'}`}>{cat.licence}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => selectedCategory && setStep(2)}
              disabled={!selectedCategory}
              className="mt-6 w-full bg-black text-white py-3 rounded-lg font-medium disabled:opacity-40 hover:bg-gray-800"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2 — Details */}
        {step === 2 && (
          <form onSubmit={(e) => { e.preventDefault(); setStep(3) }}>
            <div className="space-y-5">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                <input
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Devcon IV Hoodie — Berlin 2018"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Brief description of the artefact"
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your story</label>
                <textarea
                  value={story}
                  onChange={e => setStory(e.target.value)}
                  placeholder="Tell us the story behind this artefact. Where did you get it? What does it mean to you?"
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Approximate year</label>
                <input
                  type="number"
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  placeholder="e.g. 2018"
                  min="2008"
                  max="2030"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gray-500"
                />
              </div>

              {isMeme && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source <span className="text-red-500">*</span></label>
                  <input
                    required={isMeme}
                    value={source}
                    onChange={e => setSource(e.target.value)}
                    placeholder="Where did this originate? URL, platform, community..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gray-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image <span className="text-red-500">*</span></label>
                <input
                  type="file"
                  accept="image/*,.heic,.heif,application/pdf"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gray-500"
                />
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF, WebP, HEIC or PDF. Max 50MB.</p>
              </div>

            </div>

            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setStep(1)} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50">
                Back
              </button>
              <button type="submit" className="flex-1 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800">
                Continue
              </button>
            </div>
          </form>
        )}

        {/* Step 3 — Confirm */}
        {step === 3 && (
          <form onSubmit={handleSubmit}>
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 space-y-3">
              <h2 className="font-semibold text-gray-900">Review your submission</h2>
              <div className="text-sm space-y-2">
                <div><span className="text-gray-500">Category:</span> <span className="font-medium">{selectedCat?.name}</span></div>
                <div><span className="text-gray-500">Licence:</span> <span className="font-medium">{selectedCat?.licence}</span></div>
                <div><span className="text-gray-500">Title:</span> <span className="font-medium">{title}</span></div>
                {year && <div><span className="text-gray-500">Year:</span> <span className="font-medium">{year}</span></div>}
                {file && <div><span className="text-gray-500">Image:</span> <span className="font-medium">{file.name}</span></div>}
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 space-y-3">
  <p className="text-sm text-gray-700">
    By submitting you confirm that you have the right to share this content and agree to the{' '}
    <a href="/terms" className="underline hover:text-black">Terms of Service</a>.
    This artefact will be published under{' '}
    <span className="font-medium">{selectedCat?.licence}</span>
    {selectedCat?.licence === 'CC0' ? (
      <span className="text-gray-500"> — no rights reserved, free for anyone to use</span>
    ) : (
      <span className="text-gray-500"> — free to share with attribution to you</span>
    )}
    .
  </p>
  <p className="text-xs text-gray-400">
    Once approved, your artefact will be stored on IPFS and may remain accessible even if later removed from this site. This is a feature, not a bug — it is how the archive ensures long-term preservation.
  </p>
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="checkbox"
      checked={rightsConfirmed}
      onChange={e => setRightsConfirmed(e.target.checked)}
      className="mt-0.5"
    />
    <span className="text-sm text-gray-700">I understand and agree</span>
  </label>
</div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50">
                Back
              </button>
              <button
                type="submit"
                disabled={submitting || !rightsConfirmed}
                className="flex-1 bg-black text-white py-3 rounded-lg font-medium disabled:opacity-40 hover:bg-gray-800"
              >
                {submitting ? 'Submitting...' : 'Submit to archive'}
              </button>
            </div>
          </form>
        )}

      </div>

      <footer className="border-t border-gray-200 px-6 py-8 text-center text-sm text-gray-400 mt-16">
        <p>Merch&Memes — the web3 archive · merchandmemes.eth · CC0 &amp; CC BY 4.0</p>
      </footer>

    </main>
  )
}