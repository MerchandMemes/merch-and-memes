Recovery procedure
How to preserve or rebuild this archive without the project's cooperation.

Two different jobs. Preserving what already exists needs nothing private and
takes minutes. Rebuilding it from source needs database access. Do the first
one first; it is the one that matters.

1. Preserve the published bundle
Get the CID
Route A — no terminal. Open the name in the ENS Explorer:

Go to https://explorer.ens.domains/
Search merchandmemes.eth
Open the Records tab
Find the row labelled Contenthash — it reads ipfs://bafy...
Copy everything after ipfs://
That string is the CID. It is also the address of the archive, so it is the one
thing you must not mistype.

Route B — terminal. The same value, without decoding anything by hand:

bash
git clone https://github.com/MerchandMemes/merch-and-memes
cd merch-and-memes
npm ci
node scripts/read-contenthash.mjs merchandmemes.eth
It prints the CID and three ready-made gateway URLs.

Download it
Route A. Open https://dweb.link/ipfs/<CID>/ with the CID substituted. To
take a copy rather than browse it, from a terminal:

bash
CID=<paste CID here>
wget --recursive --no-parent --no-host-directories "https://dweb.link/ipfs/$CID/"
--no-parent keeps the download inside the bundle; --no-host-directories drops
the dweb.link/ipfs/<CID> wrapper so the files land in the current directory.

Route B. With a local IPFS node, which also proves you now hold every object:

bash
ipfs get $CID --output archive
ipfs refs -r $CID | wc -l      # how many objects you have
ipfs add -r --pin archive       # re-pin under your own root
Every artefact image CID is also visible in the downloaded HTML, so the whole
archive is recoverable from the bundle alone — no database, no credentials.

Keep it
Pin it somewhere you control. Any of these take a bare CID:

Pinata — POST https://api.pinata.cloud/pinning/pinByHash
Filebase — POST https://api.filebase.io/v1/ipfs/pins
A local node, kept online, with --pin
Announce it so the network can find you:

bash
ipfs routing provide $CID
2. Rebuild from source
Needs the repository and a database connection.

bash
git clone https://github.com/MerchandMemes/merch-and-memes
cd merch-and-memes
npm ci
Environment for the build:

NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...     # only if building the artefact pages
NEXT_PUBLIC_API_BASE=https://merch-and-memes.vercel.app
NEXT_PUBLIC_SITE_URL=https://merchandmemes.eth.limo
STATIC_EXPORT=1
The two public values are recoverable from the bundle: search the JavaScript for
supabase.co. The service-role key is not public and must come from whoever
holds the project.

If you only have the anon key, edit these three files to use
NEXT_PUBLIC_SUPABASE_ANON_KEY instead of SUPABASE_SERVICE_ROLE_KEY and the
build will run against the RLS-scoped reads:

app/artefact/[id]/page.tsx
app/page.tsx
app/browse/page.tsx
Then:

bash
npm run build:ipfs
Output lands in out/. Pin it, and point the name at your CID.

3. Repoint the name
Only the owner wallet, or an address the resolver has approved, can do this.
scripts/set-contenthash.mjs does it:

bash
CID=bafy... ENS_NAME=merchandmemes.eth ENS_RPC_URL=... \
ENS_UPDATER_PRIVATE_KEY=... node scripts/set-contenthash.mjs
Without the owner's key the ENS name cannot be moved — but the content remains
reachable at any gateway by CID, and can be served under a domain you control.

4. Gateway fallback
eth.limo is a convenience gateway, not the archive. If it fails, the same CID
works at:

https://dweb.link/ipfs/`<CID>`/
https://ipfs.io/ipfs/`<CID>`/
https://trustless-gateway.link/ipfs/`<CID>`/
Brave, Opera and Freedom resolve .eth natively without any gateway.

What cannot be recovered
The database. Submissions, comments, reactions, corrections and the moderation
log live in Supabase and are not in the bundle. The pages render the data they
were built with, so the archive survives — but new contributions do not.
