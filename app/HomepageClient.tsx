'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const CATEGORIES = [
  { name: 'Hoodies & Sweatshirts', emoji: '🧥', slug: 'hoodies-sweatshirts' },
  { name: 'T-Shirts', emoji: '👕', slug: 't-shirts' },
  { name: 'Stickers', emoji: '🏷️', slug: 'stickers' },
  { name: 'Badges & Pins', emoji: '📛', slug: 'badges-pins' },
  { name: 'Caps & Hats', emoji: '🧢', slug: 'caps-hats' },
  { name: 'Posters & Flyers', emoji: '📄', slug: 'posters-flyers' },
  { name: 'POAPs', emoji: '⬡', slug: 'poaps' },
  { name: 'Memes', emoji: '😂', slug: 'memes' },
  { name: 'Photography', emoji: '📷', slug: 'photography' },
  { name: 'Artwork & Illustrations', emoji: '🎨', slug: 'artwork-illustrations' },
  { name: 'Publications', emoji: '📖', slug: 'publications' },
  { name: 'Hardware', emoji: '🔧', slug: 'hardware' },
  { name: 'Screenshots', emoji: '🖥️', slug: 'screenshots' },
  { name: 'Other Merchandise', emoji: '📦', slug: 'other-merchandise' },
]

const PARTICLES = [
  { emoji: '🔥', x: 5, delay: 0, duration: 9 },
  { emoji: '💎', x: 16, delay: 1.8, duration: 11 },
  { emoji: '🚀', x: 28, delay: 3.6, duration: 8.5 },
  { emoji: '😂', x: 40, delay: 5.4, duration: 10 },
  { emoji: '❤️', x: 52, delay: 7.2, duration: 9.5 },
  { emoji: '⚡', x: 64, delay: 2, duration: 8 },
  { emoji: '🎯', x: 76, delay: 4, duration: 11.5 },
  { emoji: '✨', x: 88, delay: 6, duration: 9 },
]

function CountUp({ target }: { target: number }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (target === 0) return
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(current))
    }, 1500 / steps)
    return () => clearInterval(timer)
  }, [target])
  return <span>{count}</span>
}

export default function HomepageClient({
  artefactCount,
  recentArtefacts,
}: {
  artefactCount: number
  recentArtefacts: any[]
}) {
  return (
    <>
      <style>{`
        body { background: #0D0D0D; }
        .cat-card:hover { border-color: #627EEA !important; background: rgba(98,126,234,0.15) !important; }
        .cat-card:hover span:last-child { color: #F5F5F5 !important; }
        @media (max-width: 720px) {
          .home-nav { padding-left: 12px !important; padding-right: 12px !important; }
          .home-wordmark { display: none !important; }
          .home-nav-links { gap: 6px !important; }
          .home-nav-links a { padding: 8px 12px !important; font-size: 0.85rem !important; }
        }
      `}</style>

      <main style={{ background: '#0D0D0D', color: '#F5F5F5', minHeight: '100vh' }}>

        {/* Navigation */}
        <nav className="home-nav" style={{
          borderBottom: '1px solid #2A2A2A',
          background: 'rgba(13,13,13,0.95)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backdropFilter: 'blur(8px)',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }}>
              <img src="/logo_nofold.png" alt="Merch&Memes" style={{ width: '44px', height: '44px', objectFit: 'contain' }} />
            </motion.div>
            <div className="home-wordmark" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'white', fontSize: '1.2rem', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>Merch&Memes</span>
              <span style={{ color: '#999', fontSize: '0.85rem' }} className="hidden sm:inline">the web3 archive</span>
            </div>
          </Link>
          <div className="home-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/browse" style={{
                fontSize: '0.95rem', fontWeight: 600, padding: '10px 20px', borderRadius: '12px',
                border: '1px solid #2A2A2A', color: '#F5F5F5', background: 'rgba(255,255,255,0.05)',
                textDecoration: 'none', display: 'inline-block'
              }}>Browse</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/about" style={{
                fontSize: '0.95rem', fontWeight: 600, padding: '10px 20px', borderRadius: '12px',
                border: '1px solid #2A2A2A', color: '#F5F5F5', background: 'rgba(255,255,255,0.05)',
                textDecoration: 'none', display: 'inline-block'
              }}>About</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/submit" style={{
                fontSize: '0.95rem', fontWeight: 700, padding: '10px 22px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #627EEA, #DC1FFF)',
                color: 'white', textDecoration: 'none', display: 'inline-block'
              }}>Contribute</Link>
            </motion.div>
          </div>
        </nav>

        {/* Hero */}
        <section style={{
          background: '#0D0D0D',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '64px 24px',
        }}>
          <div className="absolute inset-0 gradient-animate" style={{
            background: 'linear-gradient(135deg, #0D0D0D 0%, #1a0533 25%, #0D0D0D 50%, #001a0d 75%, #0D0D0D 100%)',
          }} />
          <div className="absolute inset-0" style={{
            opacity: 0.04,
            backgroundImage: 'linear-gradient(#627EEA 1px, transparent 1px), linear-gradient(90deg, #627EEA 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }} />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {PARTICLES.map((p, i) => (
              <motion.div
                key={i}
                className="absolute select-none"
                style={{ left: `${p.x}%`, bottom: '-60px', fontSize: '2.5rem' }}
                animate={{ y: [0, -900], rotate: [0, 360], opacity: [0, 0.8, 0.8, 0] }}
                transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
              >
                {p.emoji}
              </motion.div>
            ))}
          </div>

          <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}
            >
              <motion.img
                src="/logo_nofold.png"
                alt="Merch&Memes"
                style={{ width: '200px', height: '200px', objectFit: 'contain', filter: 'drop-shadow(0 0 40px rgba(98,126,234,0.5))' }}
                animate={{ rotate: [0, 3, -3, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '8px 16px', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 500,
                border: '1px solid #627EEA', color: '#627EEA', background: 'rgba(98,126,234,0.1)',
                marginBottom: '24px',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#627EEA', display: 'inline-block' }} className="animate-pulse" />
              ENS-native, IPFS-stored artefacts, open source
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                fontWeight: 700,
                lineHeight: 1,
                color: 'white',
                marginBottom: '8px',
              }}
            >
              The cultural
            </motion.h1>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                fontWeight: 700,
                lineHeight: 1,
                background: 'linear-gradient(135deg, #627EEA, #DC1FFF, #00FFA3)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '24px',
              }}
            >
              archive of Web3
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              style={{ color: '#999', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 32px', lineHeight: 1.6 }}
            >
              Every hoodie, sticker, meme, POAP, and badge tells a piece of the story.
              Contribute yours, or explore the history the community is building together.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Link href="/submit" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '18px 40px', borderRadius: '16px', fontSize: '1.1rem', fontWeight: 700,
                  background: 'linear-gradient(135deg, #F7931A, #DC1FFF)', color: 'white', textDecoration: 'none',
                }}>
                  ✦ Contribute an artefact
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Link href="/browse" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '18px 40px', borderRadius: '16px', fontSize: '1.1rem', fontWeight: 700,
                  background: 'linear-gradient(135deg, #00FFA3, #627EEA)', color: 'white', textDecoration: 'none',
                }}>
                  Explore the archive →
                </Link>
              </motion.div>
            </motion.div>

          </div>
        </section>

        {/* Stats */}
        <section style={{
          background: '#111111',
          borderTop: '1px solid #2A2A2A',
          borderBottom: '1px solid #2A2A2A',
          padding: '40px 24px',
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', textAlign: 'center' }}>
            {[
              { value: artefactCount, label: 'artefacts', color: '#627EEA', isCount: true },
              { value: 14, label: 'categories', color: '#00FFA3', isCount: false },
              { value: 2013, label: 'earliest artefact', color: '#F7931A', isCount: false },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '8px', fontFamily: 'Space Grotesk, sans-serif', color: stat.color }}>
                  {stat.isCount ? <CountUp target={stat.value} /> : stat.value}
                </div>
                <div style={{ color: '#999', fontSize: '1rem' }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recent artefacts */}
        {recentArtefacts.length > 0 && (
          <section style={{ background: '#0D0D0D', padding: '56px 24px' }}>
            <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}
              >
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'white', fontFamily: 'Space Grotesk, sans-serif' }}>
                  Recently added
                </h2>
                <Link href="/browse" style={{ color: '#627EEA', fontSize: '1rem', textDecoration: 'none' }}>View all →</Link>
              </motion.div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
                {recentArtefacts.map((artefact, i) => (
                  <motion.div
                    key={artefact.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -6, scale: 1.03 }}
                  >
                    <Link href={`/artefact/${artefact.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{ borderRadius: '12px', overflow: 'hidden', aspectRatio: '1', marginBottom: '10px', background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
                        {(artefact.media_assets as any[])?.[0]?.ipfs_cid ? (
                          <img src={`https://ipfs.filebase.io/ipfs/${(artefact.media_assets as any[])[0].ipfs_cid}`} alt={artefact.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>🏷️</div>
                        )}
                      </div>
                      <p style={{ color: '#999', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{artefact.title}</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Categories */}
        <section style={{ background: '#0D0D0D', padding: '56px 24px' }}>
          <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ fontSize: '1.8rem', fontWeight: 700, color: 'white', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '32px' }}
            >
              Browse by category
            </motion.h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
              {CATEGORIES.map((cat, i) => (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ y: -6, scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href={`/browse?category=${cat.slug}`}
                    className="cat-card"
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                      padding: '16px 12px', borderRadius: '12px', textAlign: 'center',
                      background: '#1A1A1A', border: '1px solid #2A2A2A', textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}>
                    <span style={{ fontSize: '2rem' }}>{cat.emoji}</span>
                    <span style={{ color: '#888', fontSize: '0.75rem', lineHeight: 1.3, fontWeight: 500 }}>{cat.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Memes section */}
        <section style={{ padding: '96px 24px', position: 'relative', overflow: 'hidden' }}>
          <div className="absolute inset-0 gradient-animate" style={{
            background: 'linear-gradient(135deg, #1a0533, #001a0d, #0d0d1a, #1a0533)',
          }} />
          <div style={{ position: 'relative', zIndex: 10, maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div style={{
                fontSize: '0.85rem', fontWeight: 700, padding: '8px 16px', borderRadius: '999px',
                display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px',
                border: '1px solid #DC1FFF', color: '#DC1FFF', background: 'rgba(220,31,255,0.1)',
              }}>
                <span className="animate-pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#DC1FFF', display: 'inline-block' }} />
                Coming soon
              </div>
              <h2 style={{
                fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700,
                background: 'linear-gradient(135deg, #DC1FFF, #00FFA3)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                marginBottom: '24px',
              }}>
                Memes are history too
              </h2>
              <p style={{ color: '#888', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '32px' }}>
                From &ldquo;This is fine&rdquo; during the 2018 bear market to the Terra collapse meme series of May 2022,
                community humour is how Web3 processed every cycle.
                We are building the meme archive with the community.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/submit?category=memes" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '14px 32px', borderRadius: '12px', fontSize: '1rem', fontWeight: 700,
                  border: '1px solid #DC1FFF', background: 'rgba(220,31,255,0.15)', color: 'white',
                  textDecoration: 'none',
                }}>
                  😂 Submit a meme
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

      </main>
    </>
  )
}