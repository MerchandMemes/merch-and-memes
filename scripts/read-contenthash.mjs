// Prints the CID currently set as the ENS contenthash, plus gateway URLs.
// Usage: node scripts/read-contenthash.mjs merchandmemes.eth

import { createPublicClient, http, namehash } from 'viem'
import { mainnet } from 'viem/chains'

const NAME = process.argv[2]
if (!NAME) {
  console.error('Usage: node scripts/read-contenthash.mjs <ens-name>')
  process.exit(1)
}

const RPC = process.env.ENS_RPC_URL || 'https://ethereum-rpc.publicnode.com'
const REGISTRY = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'

const registryAbi = [
  { name: 'resolver', type: 'function', stateMutability: 'view', inputs: [{ name: 'node', type: 'bytes32' }], outputs: [{ name: '', type: 'address' }] },
]
const resolverAbi = [
  { name: 'contenthash', type: 'function', stateMutability: 'view', inputs: [{ name: 'node', type: 'bytes32' }], outputs: [{ name: '', type: 'bytes' }] },
]

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz234567'
function base32(buf) {
  let bits = 0
  let val = 0
  let out = ''
  for (const b of buf) {
    val = (val << 8) | b
    bits += 8
    while (bits >= 5) {
      out += ALPHABET[(val >>> (bits - 5)) & 31]
      bits -= 5
    }
  }
  if (bits > 0) out += ALPHABET[(val << (5 - bits)) & 31]
  return out
}

const client = createPublicClient({ chain: mainnet, transport: http(RPC) })
const node = namehash(NAME)

const resolver = await client.readContract({ address: REGISTRY, abi: registryAbi, functionName: 'resolver', args: [node] })
if (resolver === '0x0000000000000000000000000000000000000000') {
  console.error(`${NAME} has no resolver set`)
  process.exit(1)
}

const contenthash = await client.readContract({ address: resolver, abi: resolverAbi, functionName: 'contenthash', args: [node] })
const hex = contenthash.replace(/^0x/, '')
if (!hex.startsWith('e301')) {
  console.error(`Not an IPFS contenthash: 0x${hex.slice(0, 8)}`)
  process.exit(1)
}

const multihash = Buffer.from(hex.slice(4), 'hex')
const cid = 'b' + base32(Buffer.concat([Buffer.from([0x01, 0x71]), multihash]))

console.log(`CID: ${cid}`)
console.log('')
for (const gw of ['https://dweb.link/ipfs', 'https://ipfs.io/ipfs', 'https://trustless-gateway.link/ipfs']) {
  console.log(`${gw}/${cid}/`)
}
