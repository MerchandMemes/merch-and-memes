// Pins the shell root CID so it is announced to the public IPFS network,
// then waits until the network reports a provider for it.
// Exits non-zero if the CID never becomes announced.

const CID = process.env.CID
const TOKEN = process.env.FILEBASE_IPFS_TOKEN

const API = 'https://api.filebase.io/v1/ipfs/pins'
const ROUTING = 'https://delegated-ipfs.dev/routing/v1/providers'
const GATEWAYS = [
  (cid) => `https://dweb.link/ipfs/${cid}/`,
  (cid) => `https://ipfs.io/ipfs/${cid}/`,
  (cid) => `https://trustless.filebase.io/ipfs/${cid}?format=raw`,
]

if (!CID) {
  console.error('CID is required')
  process.exit(1)
}
if (!TOKEN) {
  console.error('FILEBASE_IPFS_TOKEN is required')
  process.exit(1)
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function createPin() {
  const res = await fetch(API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cid: CID,
      name: `shell-root-${Date.now()}`,
      meta: { project: 'merchandmemes' },
    }),
  })
  const body = await res.text()

  // A CID that is already pinned is a pass, not a failure. This happens on a
  // re-run of the same build.
  if (!res.ok) {
    if (/already/i.test(body)) {
      console.log(`already pinned: ${body.slice(0, 200)}`)
      return null
    }
    throw new Error(`Pin request failed: ${res.status} ${body}`)
  }
  return JSON.parse(body).requestid
}

// Large DAGs sit in Filebase's queue for a long time before the worker picks
// them up, so the wait is generous and backs off rather than polling flat out.
async function waitForPin(requestid) {
  let delay = 3000
  let waited = 0
  const LIMIT = 15 * 60 * 1000

  while (waited < LIMIT) {
    const res = await fetch(`${API}/${requestid}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    })
    const body = await res.json()
    const status = body?.status
    console.log(`pin status: ${status} (${Math.round(waited / 1000)}s)`)

    if (status === 'pinned') return
    if (status === 'failed') {
      throw new Error(`Pin failed: ${JSON.stringify(body.info ?? body)}`)
    }

    await sleep(delay)
    waited += delay
    if (delay < 10000) delay += 1000
  }
  throw new Error('Pin did not complete in 15 minutes')
}

// The delegated routing endpoint is what a gateway asks when it needs to find
// peers for a CID. A bitswap provider record means the content is announced.
async function hasProviders() {
  try {
    const res = await fetch(`${ROUTING}/${CID}`, {
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) {
      console.log(`routing lookup -> ${res.status}`)
      return false
    }
    const body = await res.json()
    const providers = (body?.Providers ?? []).filter((p) => p?.ID)
    console.log(`routing lookup -> ${providers.length} provider(s)`)
    return providers.length > 0
  } catch (err) {
    console.log(`routing lookup -> ${err.message}`)
    return false
  }
}

async function anyGatewayServes() {
  for (const build of GATEWAYS) {
    const url = build(CID)
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
      console.log(`${url} -> ${res.status}`)
      if (res.ok) return true
    } catch (err) {
      console.log(`${url} -> ${err.message}`)
    }
  }
  return false
}

const requestid = await createPin()
if (requestid) {
  console.log(`pin queued: ${requestid}`)
  await waitForPin(requestid)
}

for (let round = 0; round < 20; round++) {
  if (await hasProviders()) {
    console.log(`CID ${CID} is pinned and announced to the network`)
    process.exit(0)
  }
  if (await anyGatewayServes()) {
    console.log(`CID ${CID} is pinned and served by a public gateway`)
    process.exit(0)
  }
  await sleep(10000)
}

throw new Error('CID was pinned but never became announced or reachable')
