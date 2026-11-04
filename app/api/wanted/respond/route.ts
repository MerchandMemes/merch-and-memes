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

  const cleanContent = typeof content === 'string' ? content.trim() : ''

  if (!post_id) {
    return NextResponse.json({ error: 'Missing post id' }, { status: 400, headers: cors })
  }
  if (!cleanContent) {
    return NextResponse.json({ error: 'A response is required' }, { status: 400, headers: cors })
  }
  if (cleanContent.length > 1000) {
    return NextResponse.json({ error: 'Response is too long, 1000 characters max' }, { status: 400, headers: cors })
  }

  const { data, error } = await supabase
    .from('wanted_responses')
    .insert({ post_id, content: cleanContent })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: cors })
  return NextResponse.json(data, { headers: cors })
}
