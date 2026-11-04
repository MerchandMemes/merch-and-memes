import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders, preflight } from '@/lib/lib/cors'
// A static export needs an explicit caching mode on GET routes.
// revalidate 0 keeps the list fresh on Vercel.
export const dynamic = 'force-static'
export const revalidate = 0

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function OPTIONS(request: NextRequest) {
  return preflight(request)
}

export async function GET(request: NextRequest) {
  const cors = corsHeaders(request)

  const { data, error } = await supabase
    .from('wanted_posts')
    .select('*, wanted_responses(*)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json([], { status: 200, headers: cors })
  }
  return NextResponse.json(data ?? [], { headers: cors })
}

export async function POST(request: NextRequest) {
  const cors = corsHeaders(request)
  const { title, description } = await request.json()

  const cleanTitle = typeof title === 'string' ? title.trim() : ''
  const cleanDescription = typeof description === 'string' ? description.trim() : ''

  if (!cleanTitle) {
    return NextResponse.json({ error: 'A title is required' }, { status: 400, headers: cors })
  }
  if (cleanTitle.length > 120) {
    return NextResponse.json({ error: 'Title is too long, 120 characters max' }, { status: 400, headers: cors })
  }
  if (cleanDescription.length > 2000) {
    return NextResponse.json({ error: 'Description is too long, 2000 characters max' }, { status: 400, headers: cors })
  }

  const { data, error } = await supabase
    .from('wanted_posts')
    .insert({ title: cleanTitle, description: cleanDescription || null })
    .select()
    .single()

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: error.message }, { status: 500, headers: cors })
  }
  return NextResponse.json(data, { headers: cors })
}
