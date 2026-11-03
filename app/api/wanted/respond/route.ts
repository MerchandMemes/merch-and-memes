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
  const { post_id, content } = await request.json()

  const { data, error } = await supabase
    .from('wanted_responses')
    .insert({ post_id, content })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: cors })
  return NextResponse.json(data, { headers: cors })
}
