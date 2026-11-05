// Pins the shell root CID so it is announced to the public IPFS network,
// then waits until a third-party gateway can actually serve it.
// Exits non-zero if the CID never becomes publicly reachable.

const CID = process.env.CID
const TOKEN = process.env.FILEBASE_IPFS_TOKEN

const API = 'https://api.filebase.io/v1/ipfs/pins'
const GATEWAYS = ['https://dweb.link/ipfs', 'https://ipfs.io/ipfs']

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
  if (!res.ok) throw new Error(`Pin request failed: ${res.status} ${body}`)
  return JSON.parse(body).requestid
}

async function waitForPin(requestid) {
  for (let i = 0; i < 40; i++) {
    const res = await fetch(`${API}/${requestid}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    })
    const body = await res.json()
    const status = body?.status
    console.log(`pin status: ${status}`)
    if (status === 'pinned') return
    if (status === 'failed') {
      throw new Error(`Pin failed: ${JSON.stringify(body.info ?? body)}`)
    }
    await sleep(3000)
  }
  throw new Error('Pin did not complete in time')
}

async function waitForGateway() {
  for (let round = 0; round < 20; round++) {
    for (const gw of GATEWAYS) {
      const url = `${gw}/${CID}/`
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
        console.log(`${url} -> ${res.status}`)
        if (res.ok) return
      } catch (err) {
        console.log(`${url} -> ${err.message}`)
      }
    }
    await sleep(10000)
  }
  throw new Error('CID never became reachable on a public gateway')
}

const requestid = await createPin()
console.log(`pin queued: ${requestid}`)
await waitForPin(requestid)
await waitForGateway()
console.log(`CID ${CID} is pinned and publicly reachable`)
