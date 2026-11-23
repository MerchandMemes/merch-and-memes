import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import sharp from 'sharp'

export const runtime = 'nodejs'
export const maxDuration = 60

const filebase = new S3Client({
  region: 'auto',
  endpoint: 'https://s3.filebase.io',
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.FILEBASE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.FILEBASE_SECRET_ACCESS_KEY!,
  },
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
})

const BUCKET = process.env.FILEBASE_BUCKET_NAME!
const GATEWAY = 'https://ipfs.filebase.io/ipfs/'

export async function GET(request: NextRequest) {
  if (!BUCKET) {
    return NextResponse.json({ error: 'FILEBASE_BUCKET_NAME is not set' }, { status: 500 })
  }

  const limit = Math.min(Number(request.nextUrl.searchParams.get('limit') || '8'), 25)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: rows, error } = await supabase
    .from('media_assets')
    .select('id, ipfs_cid')
    .is('thumb_cid', null)
    .not('ipfs_cid', 'is', null)
    .or('mime_type.like.image/%,mime_type.is.null')
    .limit(limit)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  let done = 0
  const failed: string[] = []

  for (const row of rows || []) {
    try {
      const res = await fetch(GATEWAY + row.ipfs_cid, {
        signal: AbortSignal.timeout(20000),
      })
      if (!res.ok) throw new Error(`gateway ${res.status}`)

      const buffer = Buffer.from(await res.arrayBuffer())
      const thumb = await sharp(buffer)
        .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 72 })
        .toBuffer()

      const key = `thumbs/${row.ipfs_cid}.webp`
      await filebase.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: thumb,
          ContentType: 'image/webp',
        })
      )
      const head = await filebase.send(
        new HeadObjectCommand({ Bucket: BUCKET, Key: key })
      )
      const cid = head.Metadata?.cid
      if (!cid) throw new Error('no cid returned')

      const { error: updateError } = await supabase
        .from('media_assets')
        .update({ thumb_cid: cid })
        .eq('id', row.id)
      if (updateError) throw updateError

      done++
    } catch (e) {
      failed.push(`${row.ipfs_cid}: ${e instanceof Error ? e.message : 'unknown'}`)
    }
  }

  const { count: remaining } = await supabase
    .from('media_assets')
    .select('*', { count: 'exact', head: true })
    .is('thumb_cid', null)
    .not('ipfs_cid', 'is', null)
    .or('mime_type.like.image/%,mime_type.is.null')

  return NextResponse.json({ done, failed, remaining: remaining ?? 0 })
}
