import Comments from './Comments'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Reactions from './Reactions'
export const dynamic = 'force-dynamic'

export default async function ArtefactPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: artefact } = await supabase
    .from('artefacts')
    .select(`
      id,
      title,
      description,
      year_approx,
      licence_type,
      published_at,
      categories(name, slug),
      media_assets(ipfs_cid, is_primary, mime_type),
      stories(content, created_at)
    `)
    .eq('id', id)
    .not('published_at', 'is', null)
    .single()

  if (!artefact) notFound()

  const image = (artefact.media_assets as any[])?.[0]
  const story = (artefact.stories as any[])?.[0]
  const category = artefact.categories as any

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
        <Link href="/browse" className="text-sm text-gray-600 hover:text-gray-900">
          ← Back to archive
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Image */}
          <div>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden aspect-square flex items-center justify-center">
              {image?.ipfs_cid ? (
                <img
                  src={image.ipfs_cid}
                  alt={artefact.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-6xl">🏷️</span>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Link
                href={`/browse?category=${category?.slug}`}
                className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full hover:bg-gray-200"
              >
                {category?.name}
              </Link>
              <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                {artefact.licence_type === 'CC0' ? 'CC0' : 'CC BY 4.0'}
              </span>
            </div>

            <h1 className="text-3xl font-black text-gray-900 mb-2">{artefact.title}</h1>

            {artefact.year_approx && (
              <p className="text-gray-400 text-sm mb-4">{artefact.year_approx}</p>
            )}

            {artefact.description && (
              <p className="text-gray-600 mb-6">{artefact.description}</p>
            )}

            {story && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Contributor story
                </p>
                <p className="text-gray-700 leading-relaxed">{story.content}</p>
              </div>
            )}
<Reactions artefactId={artefact.id} />
            {/* Licence info */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <p className="text-xs text-gray-400">
                {artefact.licence_type === 'CC0'
                  ? 'This artefact has been dedicated to the public domain under CC0. No rights reserved — free for anyone to use, share, or build upon without restriction.'
                  : 'This artefact is shared under CC BY 4.0. You may use, share, or adapt it provided you give appropriate credit to the contributor.'}
              </p>
            </div>

            <div className="mt-6">
              <Link
                href="/submit"
                className="text-sm text-gray-500 hover:text-gray-900 underline"
              >
                Have something similar? Contribute it →
              </Link>
            </div>
            <Comments artefactId={artefact.id} />
          </div>

        </div>
      </div>

      <footer className="border-t border-gray-200 px-6 py-8 text-center text-sm text-gray-400 mt-16">
        <p>Merch&Memes — the web3 archive · merchandmemes.eth · CC0 &amp; CC BY 4.0</p>
      </footer>

    </main>
  )
}