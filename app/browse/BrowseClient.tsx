'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export type BrowseArtefact = {
  id: string
  title: string
  description: string | null
  year_approx: string | null
  published_at: string | null
  category_slug: string | null
  category_name: string | null
  cid: string | null
  extra_images: number
  reactions: Record<string, number>
  comments: number
}

const EMOJIS = ['🔥', '💎', '🚀', '😂', '❤️']

const styles = `
  .browse-category-dropdown { display: none !important; }
  @media (max-width: 720px) {
    .browse-layout { flex-direction: column !important; }
    .browse-sidebar { display: none !important; }
    .browse-category-dropdown { display: flex !important; }
    .browse-nav { padding-left: 12px !important; padding-right: 12px !important; }
    .browse-wordmark { display: none !important; }
    .browse-nav-links { gap: 6px !important; }
    .browse-nav-links a { padding-left: 8px !important; padding-right: 8px !important; font-size: 0.78rem !important; }
    .browse-nav-links a:not(:last-child) { display: none !important; }
  }
`

export default function BrowseClient({
  categories,
  artefacts,
}: {
  categories: { id: string; name: string; slug: string }[]
  artefacts: BrowseArtefact[]
}) {
  const params = useSearchParams()
  const category = params.get('category') || ''
  const q = params.get('q') || ''
  const sort = params.get('sort') || 'newest'

  const needle = q.trim().toLowerCase()

  let visible = artefacts.filter((a) => {
    if (category && a.category_slug !== category) return false
    if (needle) {
      const haystack = `${a.title} ${a.description || ''}`.toLowerCase()
      if (!haystack.includes(needle)) return false
    }
    return true
  })

  const totalReactions = (a: BrowseArtefact) =>
    Object.values(a.reactions).reduce((s, n) => s + n, 0)

  if (sort === 'oldest') {
    visible = [...visible].sort(
      (a, b) => new Date(a.published_at || 0).getTime() - new Date(b.published_at || 0).getTime()
    )
  } else if (sort === 'reactions') {
    visible = [...visible].sort((a, b) => totalReactions(b) - totalReactions(a))
  } else if (EMOJIS.includes(sort)) {
    visible = [...visible].sort((a, b) => (b.reactions[sort] || 0) - (a.reactions[sort] || 0))
  }

  const sortSuffix = sort !== 'newest' ? `&sort=${sort}` : ''
  const qSuffix = q ? `&q=${encodeURIComponent(q)}` : ''

  return (
    <>
      <style>{styles}</style>
      <main style={{ background: '#0D0D0D', minHeight: '100vh', color: '#F5F5F5' }}>

        <nav className="browse-nav" style={{
          borderBottom: '1px solid #2A2A2A', background: 'rgba(13,13,13,0.95)',
          padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(8px)',
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img src="/logo_nofold.png" alt="Merch&Memes" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
            <span className="browse-wordmark" style={{ fontWeight: 700, color: 'white', fontFamily: 'Space Grotesk, sans-serif' }}>Merch&Memes</span>
          </Link>
          <div className="browse-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/browse" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#A78BFA', textDecoration: 'none' }}>Browse</Link>
            <Link href="/wanted" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#A78BFA', textDecoration: 'none' }}>Anyone has...?</Link>
            <Link href="/about" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#A78BFA', textDecoration: 'none' }}>About</Link>
            <Link href="/submit" style={{
              fontSize: '0.9rem', fontWeight: 700, padding: '8px 18px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #627EEA, #DC1FFF)', color: 'white', textDecoration: 'none',
            }}>Contribute</Link>
          </div>
        </nav>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>

          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '24px', fontFamily: 'Space Grotesk, sans-serif', color: 'white' }}>
            Browse the archive
          </h1>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
            <form method="GET" action="/browse" style={{ flex: 1, display: 'flex', gap: '8px', minWidth: '200px' }}>
              <input
                name="q"
                defaultValue={q}
                placeholder="Search by title, project, event..."
                style={{
                  flex: 1, border: '1px solid #2A2A2A', borderRadius: '10px', padding: '10px 16px',
                  fontSize: '0.9rem', background: '#1A1A1A', color: '#F5F5F5', outline: 'none',
                }}
              />
              {category && <input type="hidden" name="category" value={category} />}
              {sort && <input type="hidden" name="sort" value={sort} />}
              <button type="submit" style={{
                padding: '10px 20px', borderRadius: '10px', background: '#111', color: 'white',
                border: 'none', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
              }}>Search</button>
            </form>
            <form method="GET" action="/browse" style={{ display: 'flex', gap: '8px' }}>
              {q && <input type="hidden" name="q" value={q} />}
              {category && <input type="hidden" name="category" value={category} />}
              <select name="sort" defaultValue={sort} style={{
                border: '1px solid #E5E5E5', borderRadius: '10px',
                padding: '10px 16px', fontSize: '0.9rem', background: '#1A1A1A', color: '#F5F5F5', outline: 'none',
                WebkitAppearance: 'none', appearance: 'none',
              }}>
                <option value="newest">Most recent</option>
                <option value="oldest">Oldest first</option>
                <option value="reactions">Most reacted</option>
                <option value="fire">Most 🔥</option>
                <option value="diamond">Most 💎</option>
                <option value="rocket">Most 🚀</option>
                <option value="laugh">Most 😂</option>
                <option value="heart">Most ❤️</option>
              </select>
              <button type="submit" style={{
                padding: '10px 16px', borderRadius: '10px', background: '#111', color: 'white',
                border: 'none', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
              }}>Sort</button>
            </form>
          </div>

          <div className="browse-layout" style={{ display: 'flex', gap: '32px' }}>

            <form method="GET" action="/browse" className="browse-category-dropdown" style={{ gap: '8px', marginBottom: '20px' }}>
              {sort && <input type="hidden" name="sort" value={sort} />}
              <select name="category" defaultValue={category} style={{
                flex: 1, border: '1px solid #2A2A2A', borderRadius: '10px', padding: '12px 16px',
                fontSize: '0.9rem', background: '#1A1A1A', color: '#F5F5F5', outline: 'none',
                WebkitAppearance: 'none', appearance: 'none',
              }}>
                <option value="">All artefacts</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
              <button type="submit" style={{
                padding: '10px 16px', borderRadius: '10px', background: '#111', color: 'white',
                border: 'none', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
              }}>Go</button>
            </form>

            <aside className="browse-sidebar" style={{ width: '200px', flexShrink: 0 }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#999', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
                Categories
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '4px' }}>
                  <Link href={`/browse${sort !== 'newest' ? `?sort=${sort}` : ''}`} style={{
                    display: 'block', padding: '8px 12px', borderRadius: '8px', fontSize: '0.9rem',
                    textDecoration: 'none', fontWeight: !category ? 600 : 400,
                    background: !category ? 'linear-gradient(135deg, #627EEA, #DC1FFF)' : 'transparent',
                    color: !category ? 'white' : '#888',
                  }}>
                    All artefacts
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id} style={{ marginBottom: '4px' }}>
                    <Link href={`/browse?category=${cat.slug}${sortSuffix}${qSuffix}`} style={{
                      display: 'block', padding: '8px 12px', borderRadius: '8px', fontSize: '0.9rem',
                      textDecoration: 'none', fontWeight: category === cat.slug ? 600 : 400,
                      background: category === cat.slug ? 'linear-gradient(135deg, #627EEA, #DC1FFF)' : 'transparent',
                      color: category === cat.slug ? 'white' : '#888',
                    }}>
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>

            <div style={{ flex: 1 }}>
              {visible.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
                  {visible.map((artefact) => (
                    <Link key={artefact.id} href={`/artefact/${artefact.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{ background: 'transparent' }}>
                        <div style={{ aspectRatio: '1', position: 'relative', overflow: 'hidden', borderRadius: '10px' }}>
                          {artefact.cid ? (
                            <img src={`https://ipfs.filebase.io/ipfs/${artefact.cid}`} alt={artefact.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: '2.5rem' }}>🏷️</span>
                          )}
                          {artefact.extra_images > 0 && (
                            <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>
                              +{artefact.extra_images}
                            </div>
                          )}
                        </div>
                        <div style={{ padding: '6px 4px' }}>
                          <div style={{ fontSize: '0.7rem', color: '#999', marginBottom: '2px' }}>
                            {artefact.category_name} · {artefact.year_approx || 'Year unknown'}
                          </div>
                          <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.85rem', lineHeight: 1.3, marginBottom: '4px' }}>
                            {artefact.title}
                          </div>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {EMOJIS.map(emoji => artefact.reactions[emoji] ? (
                              <span key={emoji} style={{ fontSize: '0.75rem', color: '#666' }}>
                                {emoji}{artefact.reactions[emoji]}
                              </span>
                            ) : null)}
                            {artefact.comments > 0 && (
                              <span style={{ fontSize: '0.75rem', color: '#666' }}>💬{artefact.comments}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '96px 24px' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📦</div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px' }}>Nothing matches</h3>
                  <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '24px' }}>Try a different search or category.</p>
                  <Link href="/browse" style={{
                    padding: '10px 24px', borderRadius: '10px', background: '#111', color: 'white',
                    textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600,
                  }}>Show everything</Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </>
  )
}
