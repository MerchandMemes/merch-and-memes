import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const cardHoverStyle = `
  .browse-category-dropdown { display: none !important; }
  @media (max-width: 720px) {
    .browse-layout { flex-direction: column !important; }
    .browse-sidebar { display: none !important; }
    .browse-category-dropdown { display: flex !important; }
    .browse-nav { padding-left: 12px !important; padding-right: 12px !important; }
    .browse-wordmark { display: none !important; }
    .browse-nav-links { gap: 6px !important; }
    .browse-nav-links a { padding-left: 8px !important; padding-right: 8px !important; font-size: 0.78rem !important; }
  }
  .artefact-card {
    background: white; 
    border-radius: 4px; 
    overflow: hidden; 
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 12px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05);
    padding-bottom: 40px;
  }
  .artefact-card:hover { 
    transform: translateY(-6px) rotate(1deg);
    box-shadow: 0 12px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1);
  }
  .artefact-card .card-title { color: #111 !important; }
  .artefact-card .card-meta { color: #666 !important; }
`
export const dynamic = 'force-dynamic'

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>
}) {
  const params = await searchParams
  const { category, q, sort } = params

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  let query = supabase
    .from('artefacts')
    .select(`
      id,
      title,
      description,
      year_approx,
      licence_type,
      published_at,
      category_id,
      categories(name, slug),
      media_assets(ipfs_cid, is_primary)
    `)
    .not('published_at', 'is', null)

  if (category) {
    const { data: catData } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single()
    if (catData) query = query.eq('category_id', catData.id)
  }

  if (q) query = query.textSearch('fts', q, { type: 'websearch', config: 'english' })

  if (sort === 'oldest') {
    query = query.order('published_at', { ascending: true })
  } else {
    query = query.order('published_at', { ascending: false })
  }

  let { data: artefacts } = await query

  if (q) {
    const { data: storyMatches } = await supabase
      .from('stories')
      .select('artefact_id')
      .textSearch('fts', q, { type: 'websearch', config: 'english' })

    if (storyMatches && storyMatches.length > 0) {
      const storyArtefactIds = storyMatches.map(s => s.artefact_id)
      const { data: storyArtefacts } = await supabase
        .from('artefacts')
        .select(`id, title, description, year_approx, licence_type, published_at, category_id, categories(name, slug), media_assets(ipfs_cid, is_primary)`)
        .not('published_at', 'is', null)
        .in('id', storyArtefactIds)
      if (storyArtefacts) {
        const existingIds = new Set(artefacts?.map(a => a.id) || [])
        const newArtefacts = storyArtefacts.filter(a => !existingIds.has(a.id))
        artefacts = [...(artefacts || []), ...newArtefacts]
      }
    }
  }

  const { data: reactionData } = await supabase
    .from('artefact_reaction_counts')
    .select('artefact_id, emoji, count')

  const { data: commentData } = await supabase
    .from('artefact_comment_counts')
    .select('artefact_id, count')

  const reactionMap: Record<string, Record<string, number>> = {}
  reactionData?.forEach((r: any) => {
    if (!reactionMap[r.artefact_id]) reactionMap[r.artefact_id] = {}
    reactionMap[r.artefact_id][r.emoji] = parseInt(r.count)
  })

  const commentMap: Record<string, number> = {}
  commentData?.forEach((c: any) => {
    commentMap[c.artefact_id] = parseInt(c.count)
  })

  const EMOJI_SORT_MAP: Record<string, string> = {
    fire: '🔥', diamond: '💎', rocket: '🚀', laugh: '😂', heart: '❤️',
  }

  let sortedArtefacts = artefacts || []
  if (sort === 'reactions') {
    sortedArtefacts = [...sortedArtefacts].sort((a, b) => {
      const aTotal = Object.values(reactionMap[a.id] || {}).reduce((s: number, n: any) => s + n, 0)
      const bTotal = Object.values(reactionMap[b.id] || {}).reduce((s: number, n: any) => s + n, 0)
      return bTotal - aTotal
    })
  } else if (EMOJI_SORT_MAP[sort || '']) {
    const emoji = EMOJI_SORT_MAP[sort || '']
    sortedArtefacts = [...sortedArtefacts].sort((a, b) => {
      const aCount = reactionMap[a.id]?.[emoji] || 0
      const bCount = reactionMap[b.id]?.[emoji] || 0
      return bCount - aCount
    })
  }

  const EMOJIS = ['🔥', '💎', '🚀', '😂', '❤️']

  return (
  <>
    <style>{cardHoverStyle}</style>
    <main style={{ background: '#0D0D0D', minHeight: '100vh', color: '#F5F5F5' }}>

      {/* Navigation */}
      
        <div className="browse-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/browse" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white', textDecoration: 'none' }}>Browse</Link>
          <Link href="/about" style={{ fontSize: '0.9rem', color: '#888', textDecoration: 'none' }}>About</Link>
          <Link href="/submit" style={{
            fontSize: '0.9rem', fontWeight: 700, padding: '8px 18px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #627EEA, #DC1FFF)', color: 'white', textDecoration: 'none',
          }}>Contribute</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>

        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '24px', fontFamily: 'Space Grotesk, sans-serif', color: 'white'}}>
          Browse the archive
        </h1>

        {/* Search and sort */}
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
            <select name="sort" defaultValue={sort || 'newest'} style={{
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

          {/* Mobile category dropdown */}
          <form method="GET" action="/browse" className="browse-category-dropdown" style={{ gap: '8px', marginBottom: '20px' }}>
            {sort && <input type="hidden" name="sort" value={sort} />}
            <select name="category" defaultValue={category || ''} style={{
              flex: 1, border: '1px solid #2A2A2A', borderRadius: '10px', padding: '12px 16px',
              fontSize: '0.9rem', background: '#1A1A1A', color: '#F5F5F5', outline: 'none',
              WebkitAppearance: 'none', appearance: 'none',
            }}>
              <option value="">All artefacts</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
            <button type="submit" style={{
              padding: '10px 16px', borderRadius: '10px', background: '#111', color: 'white',
              border: 'none', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
            }}>Go</button>
          </form>

          {/* Sidebar */}
          <aside className="browse-sidebar" style={{ width: '200px', flexShrink: 0 }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#999', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Categories
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '4px' }}>
                <Link href={`/browse${sort ? `?sort=${sort}` : ''}`} style={{
                  display: 'block', padding: '8px 12px', borderRadius: '8px', fontSize: '0.9rem',
                  textDecoration: 'none', fontWeight: !category ? 600 : 400,
                  background: !category ? 'linear-gradient(135deg, #627EEA, #DC1FFF)' : 'transparent',
color: !category ? 'white' : '#888',
                }}>
                  All artefacts
                </Link>
              </li>
              {categories?.map((cat) => (
                <li key={cat.id} style={{ marginBottom: '4px' }}>
                  <Link href={`/browse?category=${cat.slug}${sort ? `&sort=${sort}` : ''}`} style={{
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

          {/* Main content */}
          <div style={{ flex: 1 }}>
            {sortedArtefacts.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                {sortedArtefacts.map((artefact) => {
                  const reactions = reactionMap[artefact.id] || {}
                  const hasReactions = Object.values(reactions).some((n: any) => n > 0)
                  return (
                    <Link key={artefact.id} href={`/artefact/${artefact.id}`} style={{ textDecoration: 'none' }}>
                      <div className="artefact-card">
                        <div style={{ aspectRatio: '1', background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          {(artefact.media_assets as any)?.[0]?.ipfs_cid ? (
  <img src={`https://ipfs.filebase.io/ipfs/${(artefact.media_assets as any)[0].ipfs_cid}`} alt={artefact.title}
    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: '2.5rem' }}>🏷️</span>
                          )}
                        </div>
                        <div style={{ padding: '14px' }}>
                          <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '4px' }}>
                            {(artefact.categories as any)?.name} · {artefact.year_approx || 'Year unknown'}
                          </div>
                          <div style={{ fontWeight: 600, color: '#111', fontSize: '0.9rem', lineHeight: 1.4, marginBottom: '10px' }}>
                            {artefact.title}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{
                              fontSize: '0.7rem', padding: '3px 8px', borderRadius: '6px',
                              background: artefact.licence_type === 'CC0' ? '#F0FDF4' : '#EFF6FF',
                              color: artefact.licence_type === 'CC0' ? '#15803D' : '#1D4ED8',
                              fontWeight: 600,
                            }}>
                              {artefact.licence_type === 'CC0' ? 'CC0' : 'CC BY 4.0'}
                            </span>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              {hasReactions && (
                                <div style={{ display: 'flex', gap: '4px' }}>
                                  {EMOJIS.map(emoji => reactions[emoji] ? (
                                    <span key={emoji} style={{ fontSize: '0.75rem', color: '#666' }}>
                                      {emoji}{reactions[emoji]}
                                    </span>
                                  ) : null)}
                                </div>
                              )}
                              {commentMap[artefact.id] > 0 && (
                                <span style={{ fontSize: '0.75rem', color: '#666' }}>💬{commentMap[artefact.id]}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '96px 24px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📦</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px' }}>No artefacts yet</h3>
                <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '24px' }}>Be the first to contribute to the archive.</p>
                <Link href="/submit" style={{
                  padding: '10px 24px', borderRadius: '10px', background: '#111', color: 'white',
                  textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600,
                }}>Contribute an artefact</Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  </>
  )
}