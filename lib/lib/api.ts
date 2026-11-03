// Single source of truth for the API origin.
//
// The public site is served from IPFS at merchandmemes.eth, where there is no
// server. Anything that needs one (submission, wanted posts, feedback, comment
// flags, moderation) is called on the Vercel deployment instead.
//
// Set NEXT_PUBLIC_API_BASE in Vercel when the API moves off the default.
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? 'https://merch-and-memes.vercel.app'

export function apiUrl(path: string): string {
  return `${API_BASE.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`
}
