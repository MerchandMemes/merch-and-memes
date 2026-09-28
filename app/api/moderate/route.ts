import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3'

// Env vars needed (in .env.local and Vercel):
//   FILEBASE_ACCESS_KEY_ID
//   FILEBASE_SECRET_ACCESS_KEY
//   FILEBASE_BUCKET_NAME
//
// Filebase exposes an S3-compatible API. When the target bucket is configured
// as an IPFS-network bucket, each PutObject is automatically pinned to IPFS,
// and the resulting CID is attached as object metadata ("cid"), retrievable
// via HeadObject.
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

const FILEBASE_BUCKET = process.env.FILEBASE_BUCKET_NAME!

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { submissionId, artefactId, action, note } = await request.json()

    if (!submissionId || !artefactId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // All image records for this artefact (one row per uploaded image)
    const { data: mediaAssets } = await supabase
      .from('media_assets')
      .select('id, staging_path, ipfs_cid')
      .eq('artefact_id', artefactId)

    if (action === 'approve') {
      for (const asset of mediaAssets || []) {
        // Skip images already pinned on an earlier attempt, or without a staged file
        if (asset.ipfs_cid || !asset.staging_path) continue

        const { data: fileData } = await supabase.storage
          .from('staging')
          .download(asset.staging_path)

        if (!fileData) {
          return NextResponse.json(
            { error: 'A staged image file is missing. Approval aborted; submission remains pending.' },
            { status: 500 }
          )
        }

        // The Filebase object key equals the staging path (kept on the row for later deletion)
        const key = asset.staging_path
        const buffer = Buffer.from(await fileData.arrayBuffer())

        try {
          // Upload to Filebase, which pins to IPFS on IPFS-network buckets
          await filebase.send(
            new PutObjectCommand({
              Bucket: FILEBASE_BUCKET,
              Key: key,
              Body: buffer,
              ContentType: fileData.type || 'application/octet-stream',
            })
          )

          // Retrieve the CID Filebase assigned to the pinned object
          const head = await filebase.send(
            new HeadObjectCommand({
              Bucket: FILEBASE_BUCKET,
              Key: key,
            })
          )
          const cid = head.Metadata?.cid

          if (!cid) {
            throw new Error('Filebase did not return a CID for the uploaded object')
          }

          console.log('IPFS CID:', cid, 'for media asset:', asset.id)

          // Store the raw CID on this specific image row
          const { error: updateError } = await supabase
            .from('media_assets')
            .update({ ipfs_cid: cid })
            .eq('id', asset.id)

          if (updateError) {
            throw updateError
          }

          // Remove from staging only once the upload and CID are confirmed
          await supabase.storage.from('staging').remove([asset.staging_path])
        } catch (filebaseError) {
          // Abort the approval rather than publish with a broken or missing image.
          // Images already pinned keep their CID and are skipped on retry.
          console.error('Filebase upload failed:', filebaseError)
          return NextResponse.json(
            { error: 'Filebase upload failed. Approval aborted; submission remains pending.' },
            { status: 502 }
          )
        }
      }

      // Publish the artefact
      await supabase
        .from('artefacts')
        .update({ published_at: new Date().toISOString() })
        .eq('id', artefactId)

      // Update submission status
      await supabase
        .from('submissions')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          moderator_note: note || null,
        })
        .eq('id', submissionId)

      // Log action
      await supabase.from('audit_log').insert({
        action: 'submission_approved',
        entity_type: 'submission',
        entity_id: submissionId,
        note: note || 'Approved',
      })

    } else if (action === 'reject') {
      // Collect every staged file belonging to this submission
      const stagingPaths = new Set<string>()
      for (const asset of mediaAssets || []) {
        if (asset.staging_path) stagingPaths.add(asset.staging_path)
      }

      const { data: submission } = await supabase
        .from('submissions')
        .select('staging_path')
        .eq('id', submissionId)
        .single()

      if (submission?.staging_path) stagingPaths.add(submission.staging_path)

      // Delete from staging bucket
      if (stagingPaths.size > 0) {
        await supabase.storage
          .from('staging')
          .remove(Array.from(stagingPaths))
      }

      // Update submission status
      await supabase
        .from('submissions')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          moderator_note: note,
        })
        .eq('id', submissionId)

      // Log action
      await supabase.from('audit_log').insert({
        action: 'submission_rejected',
        entity_type: 'submission',
        entity_id: submissionId,
        note: note,
      })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Moderation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}