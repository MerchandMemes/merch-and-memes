import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Reactions from './Reactions'
import Comments from './Comments'

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
    <main style={{ background: '#0D0D0D', minHeight: '100vh', color: '#F5F5F5' }}>

      {/* Navigation */}
      <nav style={{
        borderBottom: '1px solid #2A2A2A',
        background: 'rgba(13,13,13,0.95)',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(8px)',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img src="/logo_nofold.png" alt="Merch&Memes" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
          <span style={{ fontWeight: 700, color: 'white', fontFamily: 'Space Grotesk, sans-serif' }}>Merch&Memes</span>
        </Link>
        <Link href="/browse" style={{
          fontSize: '0.9rem', color: '#888', textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          ← Back to archive
        </Link>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>

          {/* Image — polaroid style */}
          <div style={{
            background: 'white',
            padding: '16px 16px 56px 16px',
            borderRadius: '4px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            transform: 'rotate(-1deg)',
          }}>
            <div style={{ aspectRatio: '1', overflow: 'hidden', background: '#f0f0f0' }}>
              {image?.ipfs_cid ? (
  <img
    src={`https://ipfs.filebase.io/ipfs/${image.ipfs_cid}`}
    alt={artefact.title}
    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
  />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>🏷️</div>
              )}
            </div>
            <p style={{ textAlign: 'center', marginTop: '16px', color: '#333', fontSize: '0.85rem', fontFamily: 'Space Grotesk, sans-serif' }}>
              {artefact.title}
            </p>
          </div>

          {/* Details */}
          <div>
            {/* Category and licence */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <Link href={`/browse?category=${category?.slug}`} style={{
                fontSize: '0.75rem', padding: '4px 12px', borderRadius: '999px',
                background: 'rgba(98,126,234,0.2)', color: '#627EEA',
                textDecoration: 'none', fontWeight: 600,
              }}>
                {category?.name}
              </Link>
              <span style={{
                fontSize: '0.75rem', padding: '4px 12px', borderRadius: '999px',
                background: artefact.licence_type === 'CC0' ? 'rgba(0,255,163,0.15)' : 'rgba(98,126,234,0.15)',
                color: artefact.licence_type === 'CC0' ? '#00FFA3' : '#627EEA',
                fontWeight: 600,
              }}>
                {artefact.licence_type === 'CC0' ? 'CC0' : 'CC BY 4.0'}
              </span>
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
              fontWeight: 700,
              color: 'white',
              fontFamily: 'Space Grotesk, sans-serif',
              lineHeight: 1.2,
              marginBottom: '8px',
            }}>
              {artefact.title}
            </h1>

            {/* Year */}
            {artefact.year_approx && (
              <p style={{ color: '#627EEA', fontSize: '1rem', marginBottom: '16px', fontWeight: 500 }}>
                {artefact.year_approx}
              </p>
            )}

            {/* Description */}
            {artefact.description && (
              <p style={{ color: '#999', fontSize: '1rem', lineHeight: 1.7, marginBottom: '24px' }}>
                {artefact.description}
              </p>
            )}

            {/* Story */}
            {story && (
              <div style={{
                background: '#1A1A1A',
                border: '1px solid #2A2A2A',
                borderLeft: '3px solid #627EEA',
                borderRadius: '8px',
                padding: '16px 20px',
                marginBottom: '24px',
              }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#627EEA', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Contributor story
                </p>
                <p style={{ color: '#ccc', lineHeight: 1.7, fontSize: '0.95rem' }}>{story.content}</p>
              </div>
            )}

            {/* Reactions */}
            <Reactions artefactId={artefact.id} />

            {/* Licence info */}
            <div style={{ borderTop: '1px solid #2A2A2A', paddingTop: '16px', marginTop: '24px' }}>
              <p style={{ fontSize: '0.8rem', color: '#555', lineHeight: 1.6 }}>
                {artefact.licence_type === 'CC0'
                  ? 'This artefact has been dedicated to the public domain under CC0. No rights reserved, free for anyone to use, share, or build upon without restriction.'
                  : 'This artefact is shared under CC BY 4.0. You may use, share, or adapt it provided you give appropriate credit to the contributor.'}
              </p>
            </div>

            <div style={{ marginTop: '16px' }}>
              <Link href="/submit" style={{ fontSize: '0.85rem', color: '#627EEA', textDecoration: 'underline' }}>
                Have something similar? Contribute it →
              </Link>
            </div>

            {/* Comments */}
            <Comments artefactId={artefact.id} />
          </div>

        </div>
      </div>

    </main>
  )
}