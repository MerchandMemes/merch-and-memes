import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
export const dynamic = 'force-static'
const BASE = 'https://merchandmemes.eth.limo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data } = await supabase
    .from('artefacts')
    .select('id, published_at')
    .not('published_at', 'is', null)

  const statics: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, priority: 1, changeFrequency: 'weekly' },
    { url: `${BASE}/browse`, priority: 0.9, changeFrequency: 'daily' },
    { url: `${BASE}/submit`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${BASE}/about`, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${BASE}/wanted`, priority: 0.5, changeFrequency: 'daily' },
    { url: `${BASE}/status`, priority: 0.4, changeFrequency: 'monthly' },
    { url: `${BASE}/terms`, priority: 0.3, changeFrequency: 'yearly' },
  ]

  const artefacts: MetadataRoute.Sitemap = (data ?? []).map((a) => ({
    url: `${BASE}/artefact/${a.id}`,
    lastModified: a.published_at ?? undefined,
    priority: 0.8,
    changeFrequency: 'monthly',
  }))

  return [...statics, ...artefacts]
}
