import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { corsHeaders, preflight } from '@/lib/lib/cors'

export async function OPTIONS(request: NextRequest) {
  return preflight(request)
}

export async function POST(request: NextRequest) {
  const cors = corsHeaders(request)
  try {
    const { commentId } = await request.json()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: comment } = await supabase
      .from('comments')
      .select('content, display_name, flag_count, artefact_id, artefacts(title)')
      .eq('id', commentId)
      .single()

    if (!comment) return NextResponse.json({ success: true }, { headers: cors })

    if (comment.flag_count !== 1) return NextResponse.json({ success: true }, { headers: cors })

    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'resend.fifth231@passmail.net',
      subject: 'Comment flagged — Merch&Memes',
      html: `
        <p>A comment has been flagged for review.</p>
        <p><strong>Comment:</strong> ${comment.content}</p>
        <p><strong>By:</strong> ${comment.display_name || 'Anonymous'}</p>
        <p><strong>On artefact:</strong> ${(comment.artefacts as any)?.title}</p>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/moderation">Review in moderation queue →</a></p>
      `,
    })

    return NextResponse.json({ success: true }, { headers: cors })

  } catch (error) {
    console.error('Flag notification error:', error)
    return NextResponse.json({ success: true }, { headers: cors })
  }
}
