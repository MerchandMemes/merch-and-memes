import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

function sessionId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem('session_id')
  if (!id) {
    id = Math.random().toString(36).substring(2) + Date.now().toString(36)
    localStorage.setItem('session_id', id)
  }
  return id
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (input, init = {}) => {
      const headers = new Headers(init.headers)
      const sid = sessionId()
      if (sid) headers.set('x-session-id', sid)
      return fetch(input, { ...init, headers })
    },
  },
})
