import { createPublicClient, createWalletClient, http, namehash } from 'viem'
import { mainnet } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

const CID = process.env.CID
const NAME = process.env.ENS_NAME
const RPC = process.env.ENS_RPC_URL
const KEY = process.env.ENS_UPDATER_PRIVATE_KEY

if (!CID || !NAME || !RPC || !KEY) {
  console.error('Missing CID, ENS_NAME, ENS_RPC_URL or ENS_UPDATER_PRIVATE_KEY')
  process.exit(1)
}

const REGISTRY = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'

const registryAbi = [
  {
    name: 'resolver',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'node', type: 'bytes32' }],
    outputs: [{ name: '', type: 'address' }],
  },
]

const resolverAbi = [
  {
    name: 'setContenthash',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'node', type: 'bytes32' },
      { name: 'hash', type: 'bytes' },
    ],
    outputs: [],
  },
]

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz234567'

function base32Decode(input) {
  let bits = 0
  let value = 0
  const out = []
  for (const ch of input.toLowerCase()) {
    const idx = ALPHABET.indexOf(ch)
    if (idx === -1) throw new Error(`Invalid base32 character: ${ch}`)
    value = (value << 5) | idx
    bits += 5
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff)
      bits -= 8
    }
  }
  return Buffer.from(out)
}

// CIDv1 base32 to multihash bytes. EIP-1577 prefix for IPFS is 0xe301.
const multihash = base32Decode(CID)
if (multihash[0] !== 0x12 || multihash[1] !== 0x20) {
  throw new Error('Unexpected multihash prefix, expected sha2-256 (0x12 0x20)')
}
const contenthash = `0xe301${multihash.toString('hex')}`

const account = privateKeyToAccount(KEY.startsWith('0x') ? KEY : `0x${KEY}`)
const transport = http(RPC)
const publicClient = createPublicClient({ chain: mainnet, transport })
const walletClient = createWalletClient({ account, chain: mainnet, transport })

const node = namehash(NAME)
const resolver = await publicClient.readContract({
  address: REGISTRY,
  abi: registryAbi,
  functionName: 'resolver',
  args: [node],
})

if (resolver === '0x0000000000000000000000000000000000000000') {
  throw new Error(`No resolver set for ${NAME}`)
}

console.log(`Setting content hash on ${NAME} via resolver ${resolver}`)

const hash = await walletClient.writeContract({
  address: resolver,
  abi: resolverAbi,
  functionName: 'setContenthash',
  args: [node, contenthash],
})
console.log(`Transaction sent: ${hash}`)

const receipt = await publicClient.waitForTransactionReceipt({ hash })
console.log(`Mined in block ${receipt.blockNumber}, status ${receipt.status}`)
if (receipt.status !== 'success') process.exit(1)
