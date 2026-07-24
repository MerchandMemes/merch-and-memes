import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>
}) {
  const params = await searchParams
  const { category, q, sort } = params

  const { data: categories, error: catError } = await supabase
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

  if (category) query = query.eq('categories.slug', category)
  if (q) query = query.ilike('title', `%${q}%`)
  if (sort === 'oldest') {
    query = query.order('published_at', { ascending: true })
  } else {
    query = query.order('published_at', { ascending: false })
  }

  const { data: artefacts, error: artError } = await query

  const { data: reactionData } = await supabase
    .from('artefact_reaction_counts')
    .select('artefact_id, emoji, count')

  const reactionMap: Record<string, Record<string, number>> = {}
  reactionData?.forEach((r: any) => {
    if (!reactionMap[r.artefact_id]) reactionMap[r.artefact_id] = {}
    reactionMap[r.artefact_id][r.emoji] = parseInt(r.count)
  })

  const EMOJI_SORT_MAP: Record<string, string> = {
  fire: '🔥',
  diamond: '💎',
  rocket: '🚀',
  laugh: '😂',
  heart: '❤️',
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
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">M&M</span>
          </div>
          <span className="font-semibold text-gray-900">Merch&Memes</span>
          <span className="text-gray-400 text-sm">the web3 archive</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/browse" className="text-sm font-medium text-gray-900">Browse</Link>
          <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">About</Link>
          <Link href="/submit" className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
            Contribute
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-black text-gray-900 mb-6">Browse the archive</h1>

        <div className="mb-8 flex gap-3">
          <form method="GET" action="/browse" className="flex-1 flex gap-3">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search by title, project, event..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gray-500"
            />
            {category && <input type="hidden" name="category" value={category} />}
            {sort && <input type="hidden" name="sort" value={sort} />}
            <button type="submit" className="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
              Search
            </button>
          </form>
          <form method="GET" action="/browse" className="flex gap-2">
            {q && <input type="hidden" name="q" value={q} />}
            {category && <input type="hidden" name="category" value={category} />}
            <select
              name="sort"
              defaultValue={sort || 'newest'}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gray-500 bg-white"
            >
              <option value="newest">Most recent</option>
<option value="oldest">Oldest first</option>
<option value="reactions">Most reacted</option>
<option value="fire">Most 🔥</option>
<option value="diamond">Most 💎</option>
<option value="rocket">Most 🚀</option>
<option value="laugh">Most 😂</option>
<option value="heart">Most ❤️</option>
            </select>
            <button type="submit" className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
              Sort
            </button>
          </form>
        </div>

        <div className="flex gap-8">
          <aside className="w-48 flex-shrink-0">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Categories</h2>
            {catError && <p className="text-xs text-red-500">{catError.message}</p>}
            <ul className="space-y-1">
              <li>
                <Link
                  href={`/browse${sort ? `?sort=${sort}` : ''}`}
                  className={`block text-sm px-3 py-2 rounded-lg ${!category ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  All artefacts
                </Link>
              </li>
              {categories?.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/browse?category=${cat.slug}${sort ? `&sort=${sort}` : ''}`}
                    className={`block text-sm px-3 py-2 rounded-lg ${category === cat.slug ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          <div className="flex-1">
            {artError && <p className="text-xs text-red-500 mb-4">{artError.message}</p>}
            {sortedArtefacts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedArtefacts.map((artefact) => {
                  const reactions = reactionMap[artefact.id] || {}
                  const hasReactions = Object.values(reactions).some((n: any) => n > 0)
                  return (
                    <Link
                      key={artefact.id}
                      href={`/artefact/${artefact.id}`}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-400 transition-colors"
                    >
                      <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                        {(artefact.media_assets as any)?.[0]?.ipfs_cid ? (
                          <img
                            src={(artefact.media_assets as any)[0].ipfs_cid}
                            alt={artefact.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-4xl">🏷️</span>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="text-xs text-gray-400 mb-1">
                          {(artefact.categories as any)?.name} · {artefact.year_approx || 'Year unknown'}
                        </div>
                        <div className="font-medium text-gray-900 text-sm leading-snug">{artefact.title}</div>
                        {artefact.description && (
                          <div className="text-xs text-gray-500 mt-1 line-clamp-2">{artefact.description}</div>
                        )}
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                            {artefact.licence_type === 'CC0' ? 'CC0' : 'CC BY 4.0'}
                          </span>
                          {hasReactions && (
                            <div className="flex gap-1.5">
                              {EMOJIS.map(emoji =>
                                reactions[emoji] ? (
                                  <span key={emoji} className="text-xs text-gray-500 flex items-center gap-0.5">
                                    {emoji}{reactions[emoji]}
                                  </span>
                                ) : null
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No artefacts yet</h3>
                <p className="text-gray-500 text-sm mb-6">Be the first to contribute to the archive.</p>
                <Link href="/submit" className="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
                  Contribute an artefact
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-200 px-6 py-8 text-center text-sm text-gray-400 mt-16">
        <p>Merch&Memes — the web3 archive · merchandmemes.eth · CC0 &amp; CC BY 4.0</p>
      </footer>
    </main>
  )
}