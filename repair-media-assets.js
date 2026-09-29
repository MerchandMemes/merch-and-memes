// One-off repair script for artefacts approved before the multi-image fix.
// Re-processes only the images that were never actually uploaded to Filebase
// (their row currently holds a copy of another image's CID). Leaves every
// correctly-pinned image untouched. Run with: node repair-media-assets.js

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const { S3Client, PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const filebase = new S3Client({
  region: 'auto',
  endpoint: 'https://s3.filebase.io',
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.FILEBASE_ACCESS_KEY_ID,
    secretAccessKey: process.env.FILEBASE_SECRET_ACCESS_KEY,
  },
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
})
const FILEBASE_BUCKET = process.env.FILEBASE_BUCKET_NAME

// The four affected artefact IDs from the diagnostic query
const AFFECTED_ARTEFACT_IDS = [
  '2ae68c13-1b59-47ae-82fc-73bdcf336690',
  '6b6fb693-a891-4709-95c0-df1f0a98bd02',
  '6c1f1ffd-48cb-4912-8520-ef5a6f04a78d',
  '6dfda167-de42-4c23-a165-49b427aebcbe',
]

async function main() {
  for (const artefactId of AFFECTED_ARTEFACT_IDS) {
    console.log(`\n=== Artefact ${artefactId} ===`)
    const { data: assets } = await supabase
      .from('media_assets')
      .select('id, staging_path, ipfs_cid, is_primary')
      .eq('artefact_id', artefactId)

    if (!assets || assets.length === 0) {
      console.log('  No media_assets rows found, skipping.')
      continue
    }

    // The primary row's CID is the one genuinely correct value; every other
    // row currently holds a copy of it and needs its own real upload.
    const correctCid = assets.find(a => a.is_primary)?.ipfs_cid
    const toFix = assets.filter(a => !a.is_primary)

    for (const asset of toFix) {
      if (!asset.staging_path) {
        console.log(`  Row ${asset.id}: no staging_path on record, cannot repair automatically.`)
        continue
      }

      const { data: fileData, error: downloadError } = await supabase.storage
        .from('staging')
        .download(asset.staging_path)

      if (downloadError || !fileData) {
        console.log(`  Row ${asset.id}: staging file "${asset.staging_path}" not found. Cannot repair automatically.`)
        continue
      }

      try {
        const buffer = Buffer.from(await fileData.arrayBuffer())
        await filebase.send(new PutObjectCommand({
          Bucket: FILEBASE_BUCKET,
          Key: asset.staging_path,
          Body: buffer,
          ContentType: fileData.type || 'application/octet-stream',
        }))
        const head = await filebase.send(new HeadObjectCommand({
          Bucket: FILEBASE_BUCKET,
          Key: asset.staging_path,
        }))
        const cid = head.Metadata?.cid
        if (!cid) throw new Error('No CID returned from Filebase')

        await supabase.from('media_assets').update({ ipfs_cid: cid }).eq('id', asset.id)
        await supabase.storage.from('staging').remove([asset.staging_path])
        console.log(`  Row ${asset.id}: repaired. New CID: ${cid}`)
      } catch (err) {
        console.log(`  Row ${asset.id}: FAILED to repair:`, err.message)
      }
    }
    console.log(`  Primary row CID (already correct): ${correctCid}`)
  }
  console.log('\nDone.')
}

main()