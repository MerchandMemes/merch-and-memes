import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60
export const dynamic = 'force-static'
export const revalidate = 0

const GATEWAY = 'https://ipfs.filebase.io/ipfs/'
const PINATA = 'https://api.pinata.cloud/pinning/pinFileToIPFS'
const NO_STORE = { 'Cache-Control': 'no-store, max-age=0' }

async function pin(jwt: string, cid: string) {
  const src = await fetch(GATEWAY + cid, { signal: AbortSignal.timeout(20000) })
  if (!src.ok) throw new Error(`gateway ${src.status}`)
  const data = await src.arrayBuffer()

  const form = new FormData()
  form.append('file', new Blob([new Uint8Array(data)]), `${cid}.bin`)
  form.append('pinataMetadata', JSON.stringify({ name: `merchmemes-${cid}` }))

  const res = await fetch(PINATA, {
    method: 'POST',
    headers: { Authorization: `Bearer ${jwt}` },
    body: form,
  })
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 120)}`)

  const body = await res.json()
  if (body?.IpfsHash && body.IpfsHash !== cid) {
    throw new Error(`cid mismatch: ${body.IpfsHash}`)
  }
}

export async function GET() {
  const jwt = process.env.PINATA_JWT
  if (!jwt) {
    return NextResponse.json({ error: 'PINATA_JWT is not set' }, { status: 500, headers: NO_STORE })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: rows, error } = await supabase
    .from('media_assets')
    .select('id, ipfs_cid, thumb_cid')
    .not('ipfs_cid', 'is', null)
    .is('pinata_pinned_at', null)
    .order('id', { ascending: true })
    .limit(6)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: NO_STORE })
  }

  let pinned = 0
  const failed: string[] = []

  for (const row of rows || []) {
    let rowFailed = false
    for (const cid of [row.ipfs_cid, row.thumb_cid]) {
      if (!cid) continue
      try {
        await pin(jwt, cid)
        pinned++
      } catch (e) {
        rowFailed = true
        failed.push(`${cid}: ${e instanceof Error ? e.message : 'unknown'}`)
      }
    }
    // Only mark the row done if nothing failed, so failures are retried next call.
    if (!rowFailed) {
      await supabase
        .from('media_assets')
        .update({ pinata_pinned_at: new Date().toISOString() })
        .eq('id', row.id)
    }
  }

  const { count: remaining } = await supabase
    .from('media_assets')
    .select('*', { count: 'exact', head: true })
    .not('ipfs_cid', 'is', null)
    .is('pinata_pinned_at', null)

  return NextResponse.json(
    { pinned, failed, remaining: remaining ?? 0, done: (remaining ?? 0) === 0 },
    { headers: NO_STORE }
  )
}
