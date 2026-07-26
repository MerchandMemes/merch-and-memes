import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import HomepageClient from './HomepageClient'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const { count: artefactCount } = await supabase
    .from('artefacts')
    .select('*', { count: 'exact', head: true })
    .not('published_at', 'is', null)

  const { data: recentArtefacts } = await supabase
    .from('artefacts')
    .select(`
      id,
      title,
      year_approx,
      categories(name, slug),
      media_assets(ipfs_cid)
    `)
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .limit(6)

  return <HomepageClient artefactCount={artefactCount || 0} recentArtefacts={recentArtefacts || []} />
}