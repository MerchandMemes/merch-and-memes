# Recovery procedure

How to preserve or rebuild this archive without the project's cooperation.

Two different jobs. **Preserving** what already exists needs nothing private and
takes minutes. **Rebuilding** it from source needs database access. Do the first
one first; it is the one that matters.

## 1. Preserve the published bundle

Every version of this site is addressed by a CID. The current one is the
`contenthash` on the ENS name `merchandmemes.eth`. Read it:

```bash
cast call 0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e \
  "resolver(bytes32)(address)" $(cast namehash merchandmemes.eth) \
  --rpc-url https://ethereum-rpc.publicnode.com
