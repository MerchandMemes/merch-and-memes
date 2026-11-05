import { createClient } from '@supabase/supabase-js'
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
  return NextResponse.json(data, { headers: cors })
}
