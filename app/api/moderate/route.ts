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
      // Update submission status
      await supabase
        .from('submissions')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          moderator_note: note,
        })
        .eq('id', submissionId)

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