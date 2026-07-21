import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>
}) {
  const params = await searchParams
  const { category, q } = params

  // Fetch categories
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  // Fetch published artefacts
  const { data: artefacts, error: artError } = await supabase
    .from('artefacts')
    .select(`
      id,
      title,
      description,
      year_approx,
      licence_type,
      published_at,
      category_id,
      categories(name, slug)
    `)
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })

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

        {/* Search */}
        <div className="mb-8">
          <form method="GET" action="/browse">
            <div className="flex gap-3">
              <input
                name="q"
                defaultValue={q}
                placeholder="Search by title, project, event..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gray-500"
              />
              {category && <input type="hidden" name="category" value={category} />}
              <button type="submit" className="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
                Search
              </button>
            </div>
          </form>
        </div>

        <div className="flex gap-8">

          {/* Sidebar */}
          <aside className="w-48 flex-shrink-0">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Categories</h2>
            {catError && <p className="text-xs text-red-500">{catError.message}</p>}
            <ul className="space-y-1">
              <li>
                <Link
                  href="/browse"
                  className={`block text-sm px-3 py-2 rounded-lg ${!category ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  All artefacts
                </Link>
              </li>
              {categories?.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/browse?category=${cat.slug}`}
                    className={`block text-sm px-3 py-2 rounded-lg ${category === cat.slug ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {artError && <p className="text-xs text-red-500 mb-4">{artError.message}</p>}
            {artefacts && artefacts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {artefacts.map((artefact) => (
                  <Link
                    key={artefact.id}
                    href={`/artefact/${artefact.id}`}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-400 transition-colors"
                  >
                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                      <span className="text-4xl">🏷️</span>
                    </div>
                    <div className="p-4">
                      <div className="text-xs text-gray-400 mb-1">
                        {(artefact.categories as { name: string; slug: string } | null)?.name} · {artefact.year_approx || 'Year unknown'}
                      </div>
                      <div className="font-medium text-gray-900 text-sm leading-snug">{artefact.title}</div>
                      {artefact.description && (
                        <div className="text-xs text-gray-500 mt-1 line-clamp-2">{artefact.description}</div>
                      )}
                      <div className="mt-3">
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                          {artefact.licence_type === 'CC0' ? 'CC0' : 'CC BY 4.0'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
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