import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60
export const dynamic = 'force-static'

const PINATA = 'https://api.pinata.cloud/pinning/pinByHash'

async function pin(jwt: string, cid: string) {
  const res = await fetch(PINATA, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      hashToPin: cid,
      pinataMetadata: { name: `merchmemes-${cid}` },
    }),
  })
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 120)}`)
}

export async function GET(request: NextRequest) {
  const jwt = process.env.PINATA_JWT
  if (!jwt) {
    return NextResponse.json({ error: 'PINATA_JWT is not set' }, { status: 500 })
  }

  const limit = Math.min(Number(request.nextUrl.searchParams.get('limit') || '20'), 40)
  const offset = Number(request.nextUrl.searchParams.get('offset') || '0')

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: rows, error } = await supabase
    .from('media_assets')
    .select('id, ipfs_cid, thumb_cid')
    .not('ipfs_cid', 'is', null)
    .order('id', { ascending: true })
    .range(offset, offset + limit - 1)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  let pinned = 0
  const failed: string[] = []

  for (const row of rows || []) {
    for (const cid of [row.ipfs_cid, row.thumb_cid]) {
      if (!cid) continue
      try {
        await pin(jwt, cid)
        pinned++
      } catch (e) {
        failed.push(`${cid}: ${e instanceof Error ? e.message : 'unknown'}`)
      }
    }
  }

  return NextResponse.json({
    pinned,
    failed,
    nextOffset: offset + (rows?.length ?? 0),
    done: (rows?.length ?? 0) < limit,
  })
}
