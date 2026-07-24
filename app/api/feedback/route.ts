import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  try {
    const { message, email } = await request.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Send email notification
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'resend.fifth231@passmail.net',
      subject: 'New feedback — Merch&Memes',
      html: `
        <p><strong>New feedback received:</strong></p>
        <p>${message}</p>
        ${email ? `<p><strong>Reply to:</strong> ${email}</p>` : '<p><em>No email provided</em></p>'}
      `,
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Feedback error:', error)
    return NextResponse.json({ error: 'Failed to send feedback' }, { status: 500 })
  }
}