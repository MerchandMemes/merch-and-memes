import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders, preflight } from '@/lib/lib/cors'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function OPTIONS(request: NextRequest) {
  return preflight(request)
}

export async function POST(request: NextRequest) {
  const cors = corsHeaders(request)
  const { artefactId, content, creditAs } = await request.json()

  const cleanContent = typeof content === 'string' ? content.trim() : ''
  const cleanCredit = typeof creditAs === 'string' ? creditAs.trim() : ''

  if (!artefactId) {
    return NextResponse.json({ error: 'Missing artefact id' }, { status: 400, headers: cors })
  }
  if (!cleanContent) {
    return NextResponse.json({ error: 'A correction is required' }, { status: 400, headers: cors })
  }
  if (cleanContent.length > 1000) {
    return NextResponse.json({ error: 'Correction is too long, 1000 characters max' }, { status: 400, headers: cors })
  }
  if (cleanCredit.length > 60) {
    return NextResponse.json({ error: 'Credit name is too long, 60 characters max' }, { status: 400, headers: cors })
  }

  const { data, error } = await supabase
    .from('corrections')
    .insert({
      artefact_id: artefactId,
      content: cleanContent,
      credit_as: cleanCredit || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: cors })
  // Notify the moderator. A failed send must not fail the correction.
  try {
    const { data: artefact } = await supabase
      .from('artefacts')
      .select('title')
      .eq('id', artefactId)
      .single()

    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'resend.fifth231@passmail.net',
      subject: `Correction: ${artefact?.title ?? 'artefact'}`,
      html: `
        <p>A correction was submitted and is waiting to be applied.</p>
        <p><strong>Artefact:</strong> ${artefact?.title ?? artefactId}</p>
        <p><strong>Correction:</strong></p>
        <p>${cleanContent}</p>
        ${cleanCredit ? `<p><strong>From:</strong> ${cleanCredit}</p>` : ''}
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/artefact/${artefactId}">Open the artefact →</a></p>
      `,
    })
  } catch (emailError) {
    console.error('Failed to send correction notification:', emailError)
  }
  return NextResponse.json(data, { headers: cors })
}
