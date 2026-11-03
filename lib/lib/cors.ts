// Which origins may call the API from a browser.
//
// The public shell runs on IPFS behind an ENS gateway, so its origin is not the
// Vercel origin. Only these get an Access-Control-Allow-Origin back.
const ALLOWED_ORIGINS = [
  'https://merchandmemes.eth.limo',
  'https://merchandmemes.eth',
  'https://merch-and-memes.vercel.app',
  'http://localhost:3000',
]

export function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') ?? ''
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

export function preflight(req: Request): Response {
  return new Response(null, { status: 204, headers: corsHeaders(req) })
}
