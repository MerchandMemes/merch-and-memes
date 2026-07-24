import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const formData = await request.formData()
    const commentId = formData.get('commentId') as string
    const action = formData.get('action') as string

    if (action === 'hide') {
      await supabase
        .from('comments')
        .update({ is_visible: false })
        .eq('id', commentId)

      await supabase.from('audit_log').insert({
        action: 'comment_hidden',
        entity_type: 'comment',
        entity_id: commentId,
        note: 'Hidden by moderator due to flags',
      })
    } else if (action === 'keep') {
      await supabase
        .from('comments')
        .update({ flag_count: 0 })
        .eq('id', commentId)
    }

    return NextResponse.redirect(new URL('/admin/moderation', request.url))

  } catch (error) {
    console.error('Comment moderation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}