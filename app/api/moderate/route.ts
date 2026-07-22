import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

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

      let publicPath = null

      if (submission?.staging_path) {
        // Download from staging
        const { data: fileData } = await supabase.storage
          .from('staging')
          .download(submission.staging_path)

        if (fileData) {
          // Upload to public artefacts bucket
          const { data: uploadData } = await supabase.storage
            .from('artefacts')
            .upload(submission.staging_path, fileData, {
              upsert: true,
            })

          if (uploadData) {
  publicPath = uploadData.path

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('artefacts')
    .getPublicUrl(publicPath)

  console.log('Public URL:', urlData.publicUrl)
  console.log('Artefact ID:', artefactId)

  // Update media asset with public URL
  const { error: updateError } = await supabase
    .from('media_assets')
    .update({ ipfs_cid: urlData.publicUrl })
    .eq('artefact_id', artefactId)

  console.log('Update error:', updateError)

  // Delete from staging
  await supabase.storage
    .from('staging')
    .remove([submission.staging_path])
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