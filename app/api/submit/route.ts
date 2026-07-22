import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Use service role key for server-side operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const story = formData.get('story') as string
    const categorySlug = formData.get('category') as string
    const year = formData.get('year') as string
    const source = formData.get('source') as string

    if (!file || !title || !categorySlug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get category from database
    const { data: category, error: catError } = await supabase
      .from('categories')
      .select('id, licence_type')
      .eq('slug', categorySlug)
      .single()

    if (catError || !category) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    // Upload file to staging bucket
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const fileBuffer = await file.arrayBuffer()

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('staging')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      )
    }

    // Create artefact record
    const { data: artefact, error: artefactError } = await supabase
      .from('artefacts')
      .insert({
        title,
        description: description || null,
        category_id: category.id,
        licence_type: category.licence_type,
        year_approx: year ? parseInt(year) : null,
      })
      .select('id')
      .single()

    if (artefactError || !artefact) {
      return NextResponse.json(
        { error: 'Failed to create artefact record' },
        { status: 500 }
      )
    }

    // Create media asset record
    await supabase.from('media_assets').insert({
      artefact_id: artefact.id,
      staging_path: uploadData.path,
      mime_type: file.type,
      file_size_bytes: file.size,
      is_primary: true,
    })

    // Create story if provided
    if (story) {
      await supabase.from('stories').insert({
        artefact_id: artefact.id,
        content: story,
      })
    }

    // Create submission record
    await supabase.from('submissions').insert({
      artefact_id: artefact.id,
      status: 'pending',
      rights_declared: true,
      staging_path: uploadData.path,
    })

    // Log to audit log
    await supabase.from('audit_log').insert({
      action: 'submission_created',
      entity_type: 'submission',
      entity_id: artefact.id,
      note: `New submission: ${title} (category: ${categorySlug})`,
    })

    return NextResponse.json({ success: true, id: artefact.id })

  } catch (error) {
    console.error('Submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}