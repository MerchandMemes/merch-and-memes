import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders, preflight } from '@/lib/lib/cors'

export const dynamic = 'force-dynamic'

export async function OPTIONS(request: NextRequest) {
  return preflight(request)
}

export async function GET(request: NextRequest) {
  const cors = corsHeaders(request)

  const raw = request.nextUrl.searchParams.get('code') || ''
  const code = raw.trim().toUpperCase().replace(/[^0-9A-Z]/g, '')

  if (code.length !== 10) {
    return NextResponse.json(
      { error: 'Enter the 10-character code from your submission' },
      { status: 400, headers: cors }
    )
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase
    .from('submissions')
    .select('status, submitted_at, reviewed_at, moderator_note, artefact_id, artefacts(title, published_at)')
    .eq('reference_code', code)
    .single()

  if (error || !data) {
    return NextResponse.json(
      { error: 'No submission found for that code' },
      { status: 404, headers: cors }
    )
  }

  const artefact = data.artefacts as any
  const approved = data.status === 'approved' && artefact?.published_at

  return NextResponse.json(
    {
      status: data.status,
      submitted_at: data.submitted_at,
      reviewed_at: data.reviewed_at,
      note: data.status === 'rejected' ? data.moderator_note : null,
      title: artefact?.title ?? null,
      artefact_id: approved ? data.artefact_id : null,
    },
    { headers: cors }
  )
}
