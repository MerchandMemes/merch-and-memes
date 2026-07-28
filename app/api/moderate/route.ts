import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3'

// Requires: npm install @aws-sdk/client-s3
//
// Env vars needed (add to .env.local and Vercel):
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

    if (action === 'approve') {
      // Get staging path
      const { data: submission } = await supabase
        .from('submissions')
        .select('staging_path')
        .eq('id', submissionId)
        .single()

      if (submission?.staging_path) {
        // Download from staging
        const { data: fileData } = await supabase.storage
          .from('staging')
          .download(submission.staging_path)

        if (fileData) {
          const key = submission.staging_path
          const buffer = Buffer.from(await fileData.arrayBuffer())

          try {
            // Upload to Filebase — auto-pins to IPFS on IPFS-network buckets
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

            console.log('IPFS CID:', cid)
            console.log('Artefact ID:', artefactId)

            // Store the raw CID (not a full URL) on the media asset
            const { error: updateError } = await supabase
              .from('media_assets')
              .update({ ipfs_cid: cid })
              .eq('artefact_id', artefactId)

            if (updateError) {
              throw updateError
            }

            // Only remove from staging once the Filebase upload + CID are confirmed
            await supabase.storage.from('staging').remove([submission.staging_path])
          } catch (filebaseError) {
            // Abort the approval entirely rather than publishing with a broken
            // or missing image. Submission stays 'pending' for retry.
            console.error('Filebase upload failed:', filebaseError)
            return NextResponse.json(
              { error: 'Filebase upload failed. Approval aborted; submission remains pending.' },
              { status: 502 }
            )
          }
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
      // Get staging path to delete file
      const { data: submission } = await supabase
        .from('submissions')
        .select('staging_path')
        .eq('id', submissionId)
        .single()

      // Delete from staging bucket
      if (submission?.staging_path) {
        await supabase.storage
          .from('staging')
          .remove([submission.staging_path])
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