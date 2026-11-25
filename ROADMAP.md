# Roadmap — deferred work

Items deliberately parked. None block launch. The product phase plan lives in the
project specification, Section 16; this file does not restate it.

The specification itself should be committed to this repo under `docs/` so the
plan is preserved with the code rather than on one machine.

## Open appendix items (from spec A1–A10)

- A1: move the serverless function region to eu-west-1 when Vercel Pro allows,
  to co-locate with the Supabase database.
- A2: rename the Mac system account and hostname.
- A9: delete the two legacy test artefacts ("ETH bottle from ECC", "test") —
  they store old Supabase URLs and render broken.
- A10: remove `/sentry-example-page` and `/api/sentry-example-api`.
- Legal review of the liability clause before meaningful scale.

## Later phase — discoverability

**Serve the site on a normal domain as well, keeping the ENS name canonical.**

eth.limo answers `/robots.txt` itself for every ENS site, so the build's own
robots file — with its `Sitemap:` line — is never read, and `.eth.limo` pages
index poorly. Discovery rests entirely on people already knowing the ENS name.

A conventional domain pointing at the same bundle gives search engines a normal
front door: real robots.txt, submittable sitemap, Search Console, backlinks that
carry weight. The ENS name stays canonical via `rel=canonical` and remains the
address the archive is about; the domain is only a way in.

Not urgent at 18 artefacts. Revisit when being unfindable starts to cost.

## Later phase — wallets and exchange

Neither is in the spec yet; both need a design pass first.

**Wallet authentication** is already scoped: FR1.8, Phase 3, Sign-In With
Ethereum. `wallet_address` is a nullable field on Contributor. Section 18.2
additionally wants roles assignable to wallet addresses from Phase 2 so
moderator authority can migrate to on-chain governance without a permission
model change.

**Exchange of artefacts** is unscoped and needs its own pass: a listing
board, a swap match, or a full escrow flow, and whether the platform takes
custody or stays a noticeboard. Leaning noticeboard only — custody drags in
disputes, shipping and liability.

## Post-launch polish

- Replace the default Next 404 with a styled, on-brand page.
- Reconcile terms section 8: it describes registered contributors providing an
  email and username, but there is no registration.
- Delete unused scaffold files from `public/`: `logo.png`, `file.svg`,
  `globe.svg`, `next.svg`, `window.svg`.
- Recompress `public/og.png` (630 KB, a quarter of the site bundle) to JPEG.
- Set a Sentry auth token so uploaded stack traces are not minified.
- Backfill reference codes onto pre-feature submissions (low value — submitters
  were never told codes exist).
- Submit `sitemap.xml` to Search Console / Bing once a non-eth.limo host exists.
