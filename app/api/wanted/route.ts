import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const { data, error } = await supabase
    .from('wanted_posts')
    .select('*, wanted_responses(*)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json([], { status: 200 })
  }
  return NextResponse.json(data ?? [])
}

export async function POST(request: Request) {
  const { title, description } = await request.json()

  const { data, error } = await supabase
    .from('wanted_posts')
    .insert({ title, description })
    .select()
    .single()

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}