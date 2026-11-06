import { createClient } from '@supabase/supabase-js'
import { Suspense } from 'react'
import BrowseClient, { type BrowseArtefact } from './BrowseClient'

export const revalidate = 60

export default async function BrowsePage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name')

  const { data: rows } = await supabase
    .from('artefacts')
    .select(`
      id,
      title,
      description,
      year_approx,
      published_at,
      categories(name, slug),
      media_assets(ipfs_cid, thumb_cid, is_primary)
    `)
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })

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

  const artefacts: BrowseArtefact[] = (rows ?? []).map((a: any) => {
    const media = ((a.media_assets as any[]) || [])
      .slice()
      .sort((x, y) => (y.is_primary ? 1 : 0) - (x.is_primary ? 1 : 0))
    return {
      id: a.id,
      title: a.title,
      description: a.description,
      year_approx: a.year_approx,
      published_at: a.published_at,
      category_slug: (a.categories as any)?.slug ?? null,
      category_name: (a.categories as any)?.name ?? null,
      cid: media[0]?.ipfs_cid ?? null,
      thumb: media[0]?.thumb_cid ?? null,
      extra_images: Math.max(0, ((a.media_assets as any[]) || []).length - 1),
      reactions: reactionMap[a.id] || {},
      comments: commentMap[a.id] || 0,
    }
  })

  return (
    <Suspense fallback={null}>
      <BrowseClient categories={categories ?? []} artefacts={artefacts} />
    </Suspense>
  )
}
