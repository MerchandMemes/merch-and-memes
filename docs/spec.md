# Merch&Memes — Project Specification

**Version:** 3.0
**Date:** 25 November 2026
**Status:** Living document, re-baselined against the deployed system. Edit in
place; bump the version and add a changelog row.
**Supersedes:** `20260902_project-spec-v2.5.docx` (archived, unedited)
**Owner:** Merch&Memes

**Name:** Merch&Memes, final. The ampersand is display-only — ENS, repository slug
and technical identifiers use `merchandmemes`. Do not "correct" either form.

## How to read this document

Every requirement carries a status:

- **Shipped** — live in production.
- **Partial** — partly live, remainder described.
- **Not built** — specified, not started.
- **Deferred** — decided against for now, with the reason.

v3.0 describes the system as it exists. Where v2.5 described an intention that has
since been fulfilled, the section states the outcome rather than the plan.

## Amendment notice — v3.0

Full re-baseline. v2.5 was written pre-build and had drifted far enough that its
architecture no longer matched the running system.

- **Architecture rewritten (§12, §13, §18.3).** The application is exported,
  pinned to IPFS by CI and addressed by ENS contenthash. Omnipin is retired;
  Filebase over the S3 API is the pinning path. The claim that only a static
  redirect page is hosted is gone.
- **§18.3 re-baselined.** Application hosting sits in the decentralised column.
  Database, API surface, moderation state, comments and reactions remain
  centralised, and the section says why and what would change that.
- **Phase 1 closed (§16).** Every item is Shipped. Phases renumbered; nothing
  live sits in a future phase.
- **Delivered features documented as shipped rather than planned:** comments,
  reactions, moderation queue with email notification, thumbnail generation,
  reference codes and status lookup, `/wanted`, social metadata, robots and
  sitemap, ENS contenthash deployment with rollback.
- **Data model extended (§11):** `reference_code`, `thumb_cid`, `mime_type`
  semantics, comment `flagged`.
- **Operational dependencies recorded (§13.4):** dispatch token expiry, CI wallet
  threshold, rollback workflow.
- **Exchange of artefacts added** as Deferred (§16), with the reason.
- **Discoverable-domain decision recorded** as Deferred (§16, §18.3).
- **Rename closed (§19.1).** Merch&Memes is final; the v3.0 rename was retired and
  the version number reassigned to this re-baseline.

## Changelog

| Version | Date | Change |
| --- | --- | --- |
| 3.0 | 2026-11-25 | Re-baseline against deployed system. Architecture, hosting and decentralisation corrected; Phase 1 closed; shipped features documented as shipped; name confirmed final. |
| 2.5 | 2026-09-02 | Pre-build revision. See archived docx for full history. |

## 0. Snapshot at v3.0

| | |
| --- | --- |
| Live at | `merchandmemes.eth.limo`, ENS contenthash → IPFS bundle |
| Content | All published artefacts; fixed category taxonomy |
| Hosting | IPFS, pinned to Filebase; ENS name is the address |
| Data | Supabase Postgres, service-role access server-side only |
| Preview | Vercel, same source, non-authoritative |
| Deploy | GitHub Actions, manual dispatch, pins then repoints ENS |
| Moderation | Admin queue, email notification via Resend, thumbnail at approval |
| Contribution | No account, no wallet, no email, no fee; optional `credit_as` |
| Licence | MIT for code; CC0 or CC BY 4.0 per artefact |

## 1. Vision

Merch&Memes is an open, community-driven archive of Web3 cultural history. It
collects the physical and digital by-products of the ecosystem — hoodies,
stickers, POAPs, badges, keyrings, event flyers, memes, screenshots — and
preserves them as a record rather than as a shop.

The archive is addressed by an ENS name and served from IPFS. That pairing is the
point, not a technical flourish: the address is a name the project holds rather
than a domain it rents, and the content is addressed by hash rather than by
whatever a host decides to serve that day. Anyone can pin the bundle and keep it
reachable. The source is MIT-licensed and the built artefact matches the served
page, so the archive can outlive the people currently running it.

Contributing is deliberately frictionless. There is no account, no wallet, no
email and no fee. A contributor uploads, optionally attaches a credit name, and
is done. Everything published is offered under CC0 or CC BY 4.0, so nothing
enters the archive locked behind permissions.

The archive is not a marketplace, a portfolio or a social network. It is a record
of things that existed, kept because they are evidence of a culture that was
mostly busy throwing them away.

## 2. Problem

Web3 produces a great deal of merchandise and almost none of it survives as
evidence. Runs are small, made for a conference or a launch, handed out, worn,
washed, lost or binned. The objects are cheap and the culture around them is
disposable by design — which is exactly what makes them a record worth keeping.

Three things conspire against the record.

**Nobody archives physical ephemera.** Institutions collect fine art and
manuscripts, slowly and selectively. The Internet Archive captures pages, not the
hoodie photographed on them. Trading platforms index tokens; the sticker beside
the token has no metadata and no owner of record.

**Projects die and take their context with them.** When a project folds, its site
goes first. Screenshots and photos linger on scattered posts with no dates, no
attribution and no way to tell a 2017 conference shirt from a 2023 revival. The
object loses its story and becomes an unbranded rag.

**Archive tooling is heavy.** Most platforms want an account, an email, sometimes
a wallet before they will accept a photo. Friction is the main reason ephemera
never gets contributed at all.

The result is a gap: a decade of ecosystem history that is being thrown out
because no low-friction, permanent, community-driven place exists to put it.

Merch&Memes answers that with hash-addressed storage, a name the project holds
rather than rents, an open licence and a submission form that asks for nothing
but the artefact itself.

## 3. Success Criteria

The archive succeeds if the following hold. Statuses reflect v3.0.

| | Criterion | Status |
| --- | --- | --- |
| SC1 | Every published artefact's media is pinned to IPFS and referenced by CID, never by a host URL. | Shipped |
| SC2 | The served bundle is built by CI from the source at the deployed commit, so the archive matches its own code. | Shipped |
| SC3 | A submission is completable in under two minutes with no account, wallet or email. | Shipped |
| SC4 | The moderation queue is actioned promptly and notifies the admin by email on arrival. | Shipped |
| SC5 | A submitter can check the state of their submission with a reference code and no account. | Shipped |
| SC6 | A third party can rebuild the site from the MIT source and the pinned bundle without the project's cooperation. | Partial — source and spec are public; recovery steps are not yet written down |
| SC7 | Search engines index artefact pages, so the record is findable by people who do not already know the ENS name. | Partial — sitemap published, robots overridden by the gateway, `.eth.limo` indexes poorly; see §16 |
| SC8 | All data is exportable in open formats. | Not built |
| SC9 | Running costs stay within free or low tiers. | Shipped |

SC1 and SC2 are the load-bearing pair. An archive whose images live on a
dashboard URL, or whose served page differs from its published source, is not an
archive — it is a website about one.

## 4. Personas

### P1 — The contributor

Has an object in front of them and a phone. Took a photo before it went in a
drawer, or found it in one. Tolerant of a form, intolerant of a signup, and likely
to abandon if asked for an email. Often does not know the year, and does not want
to be credited.

Needs: a short form, several photos accepted at once, an optional credit field
that can be left blank, and some way to check what happened afterwards without
handing over an address.

*Status: Shipped.* Multi-image upload, optional `credit_as`, and a reference code
with a `/status` lookup.

### P2 — The browser

Arrives from a link, a post, or curiosity. No account, no intention of
contributing today. Wants to look, and to leave without a modal.

Needs: a browsable grid, category filters, artefact pages that load, and enough
context to understand what they are looking at.

*Status: Shipped.* Server-rendered grid, filters, artefact pages with category,
licence, year and any contributor story.

### P3 — The moderator

Currently one person, the owner. Sees a queue, not a feed. Judging an item takes
seconds and the decision is binary.

Needs: an alert on arrival, enough context to judge in one screen, one-click
approve or reject, and automatic handling of the tedious parts.

*Status: Shipped.* Email notification, admin-gated queue, one-click actions,
thumbnail generated at approval. Single-admin dependence is the known weakness —
see §16.

### P4 — The researcher

Journalist, curator, or someone writing a thread. Wants a citable object with a
date and a licence, not a scroll.

Needs: stable URLs that will still resolve, dates, explicit licence terms, and
ideally a ready-made citation.

*Status: Partial.* URLs are stable and per-artefact; licences are stated on every
page. No citation block and no bulk export.

### P5 — The third-party preserver

Has no relationship with the project. Wants the archive to survive the project.

Needs: public source, public CIDs, and written recovery steps.

*Status: Partial.* Source is MIT and the bundle is pinnable, but recovery is not
documented (SC6).

### Not personas

**Sellers.** No prices, no listings, no "for sale". An artefact page is a record,
not a shop window. This is what keeps exchange of artefacts (§16) deferred rather
than assumed.

**Brands.** No analytics dashboard, no campaign reporting. A project that wants
its own merch archived submits it like anyone else.

## 5. Licensing

### 5.1 Code

The repository is MIT-licensed. Anyone may fork, run, rebuild or rehost the
archive. The specification is in the same repository under the same terms.

*Status: Shipped.*

### 5.2 Artefacts

Two licences, chosen per category and inherited automatically at submission:

- **CC0** for merchandise categories — hoodies, t-shirts, stickers, badges, caps,
  posters, keyrings, hardware, other merchandise. The object is a manufactured
  thing; attribution to whoever happened to photograph it adds nothing.
- **CC BY 4.0** for authored and captured work — memes, photography, artwork,
  publications, screenshots, POAPs. A maker is identifiable and credit matters.

The licence is fixed by the category rather than picked by the contributor, so
nobody has to make a legal decision at the form. It is displayed on every artefact
page and in the licence block beneath the details.

*Status: Shipped.*

### 5.3 Rights declaration

Every submission records `rights_declared`. The contributor asserts they have the
right to publish what they are uploading. No proof is required and none is
checked at moderation — a queue that demanded invoices would never clear.

*Status: Shipped.*

### 5.4 Irreversibility

Publishing is permanent in a way that a normal site is not. Once a file is pinned
and its CID served, copies can exist anywhere. Withdrawal removes the artefact
from the database and from subsequent bundles, but does not recall CIDs already
pinned by others.

Contributors are told this on the submit page before uploading. It is the main
reason the form is deliberately blunt about what "publish" means.

*Status: Shipped.*

### 5.5 Third-party content

Logos, characters and wordmarks belong to their owners. The archive claims no
ownership of them; the licence applies to the photograph and its metadata, not to
the trademark depicted. A screenshot of a project's site is CC0 as a screenshot.

*Status: Shipped.*

### 5.6 Takedown

A rights holder can request removal through the correction path on the artefact
page. Removal is manual and immediate once verified. The artefact page then 404s
and the next bundle omits it; pinned copies persist as described in §5.4.

*Status: Shipped.*

## 6. Functional Requirements

Split into access, submission, media, moderation and engagement. Each item carries
a status per §0.

### FR1 — Access and identity

**FR1.1 No contributor identity.** Submitting requires no account, wallet or
email. The artefact belongs to the archive on publication.
*Status: Shipped.*

**FR1.2 Optional credit.** A free-text `credit_as` field is the only identity a
contributor may attach. Blank is normal and renders nothing.
*Status: Shipped.*

**FR1.3 Admin authentication.** A single shared password, hashed with SHA-256 and
compared timing-safely against an `httpOnly`, `secure`, `sameSite=lax` session
cookie. Unauthenticated requests to admin pages redirect to `/admin/login`;
unauthenticated API calls get 401.
*Status: Shipped, Vercel only.* `proxy.ts` is middleware and does not execute in
the static bundle, so moderation happens against the Vercel deployment, not
through the ENS name.

**FR1.4 Session lifetime.** Twelve hours, then re-login.
*Status: Shipped.*

**FR1.5 Password recovery.** The password exists only as the `ADMIN_PASSWORD`
environment variable; nothing stores it in the database, so there is no reset flow
to build. Recovery is to set a new value in Vercel and redeploy. Because the
cookie is the SHA-256 of the current password, rotation also invalidates every
live session — recovery and revocation are one operation.
*Status: Shipped.* The password should also be kept in a password manager, since
it is the only credential to the queue and is not recoverable from anywhere else.

**FR1.6 Missing-password fallback.** If `ADMIN_PASSWORD` is unset, admin routes
are left open to anyone and a warning is logged. This is the dangerous direction:
lost is survivable, unset is a hole.
*Status: Shipped.*

**FR1.7 Wallet authentication.** Sign-In With Ethereum (EIP-4361) so a returning
contributor can prove continuity without an email.
*Status: Deferred.* Adds nothing a first-time contributor needs, and the archive
has no contributor-side state to protect yet.

**FR1.8 Contributor accounts.** Profiles, submission history, edits.
*Status: Deferred.* See FR1.7; accounts exist to serve the account, and there is
nothing yet that requires one.

### FR2 — Submission

**FR2.1 Required fields.** Title and category. Description, story, approximate
year, source and credit are optional.
*Status: Shipped.*

**FR2.2 One or many files.** The form accepts multiple files in a single
submission; the first is marked primary.
*Status: Shipped.*

**FR2.3 Client-side pre-checks.** Type and size limits enforced before upload so
a doomed submission fails fast.
*Status: Shipped.*

**FR2.4 Private staging.** Uploads land in the Supabase `staging` bucket. Nothing
is public before approval.
*Status: Shipped.*

**FR2.5 Rights declaration.** `rights_declared` recorded per submission (§5.3).
*Status: Shipped.*

**FR2.6 Reference code.** A ten-character base32 code, 50 bits, alphabet excluding
I, L, O and U. Generated server-side and retried on collision.
*Status: Shipped.*

**FR2.7 Status URL.** The response returns `code` and a ready-made `/status?code=`
URL, shown on the success screen so the contributor can save or bookmark it.
*Status: Shipped.*

**FR2.8 Moderator notification.** Email via Resend on arrival, carrying the code
and a link to the queue. A failed send does not fail the submission.
*Status: Shipped.*

**FR2.9 Audit entry.** `submission_created` written to `audit_log`.
*Status: Shipped.*

**FR2.10 CORS.** The endpoint answers preflight and sets CORS headers so a
non-browser client can submit.
*Status: Shipped.*

### FR3 — Media

**FR3.1 Accepted types.** `image/*`, plus explicit `.heic` and `.heif`, plus
`application/pdf`.
*Status: Shipped.*

**FR3.2 Limits.** 50 MB per file, five files per submission, at least one
required.
*Status: Shipped.*

**FR3.3 Client compression.** Images are downscaled to 1920px on the long edge and
re-encoded to JPEG at quality 0.82 before upload. PDFs bypass compression.
*Status: Shipped.* Originals above 1920px lose resolution on the way in; below
that, nothing changes.

**FR3.4 Duplicate guard.** Files are keyed on name, size and last-modified and
rejected if already selected.
*Status: Shipped.*

**FR3.5 Thumbnails.** At approval, a 400px WebP at quality 72 is generated per
image and stored as `thumb_cid`. Best-effort: a failure does not block approval,
and grids fall back to the original when `thumb_cid` is null.
*Status: Shipped.*

**FR3.6 Non-image fallback.** Assets with no thumbnail and a PDF mime type render
a document glyph in grids instead of a broken image.
*Status: Shipped.*

**FR3.7 Full-resolution retention.** The compressed upload is the archived copy;
no larger original is retained.
*Status: Shipped, by design.* Keeps pins small and predictable.

**FR3.8 HEIC.** Accepted at the input, but conversion happens in-browser through
canvas, so behaviour depends on the browser's HEIC decoder. Safari handles it;
Chromium historically does not.
*Status: Partial.* Worth confirming on a Chromium browser with a real HEIC file
before promoting HEIC in the helper text.

### FR4 — Moderation

**FR4.1 Queue.** Pending submissions listed for the authenticated admin, newest
first, with thumbnail, metadata and reference code.
*Status: Shipped.*

**FR4.2 Arrival alert.** Email on every new submission (§FR2.8).
*Status: Shipped.*

**FR4.3 Approval.** For each asset: download from staging, upload to the Filebase
IPFS bucket, read the assigned CID from object metadata, store `ipfs_cid`,
generate the thumbnail, delete the staged file. Then set `published_at`, mark the
submission approved, write the audit entry and dispatch a publish.
*Status: Shipped.*

**FR4.4 Rejection.** Delete every staged file, mark the submission rejected with
the moderator note, write the audit entry. The unpublished artefact row is left in
place.
*Status: Shipped.*

**FR4.5 Idempotent retry.** Assets already carrying an `ipfs_cid` are skipped, so a
failed approval can be retried without re-pinning.
*Status: Shipped.*

**FR4.6 Fail-closed.** If a staged file is missing or Filebase errors, approval
aborts and the submission stays pending rather than publishing a broken page.
*Status: Shipped.*

**FR4.7 Publish dispatch.** The GitHub `repository_dispatch` that triggers a
rebuild is swallowed on failure — the approval stands, and the next publish picks
the artefact up.
*Status: Shipped.*

**FR4.8 Comment moderation.** Comments approve or remove individually from the
artefact page's admin view.
*Status: Shipped.*

**FR4.9 Flagging.** Any visitor can flag a comment for review.
*Status: Shipped.*

**FR4.10 Single moderator.** One shared password, no roles, no second pair of
eyes, no self-approval restriction.
*Status: Partial.* See §16.

### FR5 — Engagement

**FR5.1 Artefact reactions.** Five emoji (🔥 💎 🚀 😂 ❤️), toggled per artefact.
Identity is a random `session_id` in localStorage, so the same browser cannot
double-count and clearing storage resets it.
*Status: Shipped.* No dedupe beyond the browser; a determined visitor can inflate
counts.

**FR5.2 Comment reactions.** The same mechanism, three emoji (👍 ❤️ 😂), per
comment.
*Status: Shipped.*

**FR5.3 Comments.** Anonymous by default with an optional display name (50
characters) and 500 characters of body. Posted straight from the browser to
Supabase; visible immediately.
*Status: Shipped.* Comments are post-moderated, not pre-moderated — see §7.3.

**FR5.4 Flagging.** Any visitor can flag a comment once. The flag increments
`flag_count`, emails the moderator and is remembered in localStorage so the button
locks.
*Status: Shipped.* Flag state is per-browser, so the same comment can be flagged
again from elsewhere.

**FR5.5 Corrections.** A correction form on every artefact page, capped at 1000
characters with an optional 60-character credit, stored in `corrections`.
*Status: Partial.* Stored and shown on the page, but unlike submissions a
correction triggers no email, so one can sit unnoticed until someone looks.

**FR5.6 No-JS behaviour.** Reactions, comments and corrections all require
JavaScript, since they talk to Supabase from the browser. The artefact itself,
its images, metadata and licence render without it.
*Status: Shipped, accepted trade.*

## 7. Moderation Policy

### 7.1 What gets approved

Almost everything. The archive is a record, not a curated exhibition, so
provenance and aesthetic merit are not criteria. A creased sticker photographed
badly is as valid as a studio shot.

Grounds for rejection:

- Not merchandise, ephemera or culture from the ecosystem (§1).
- Illegally obtained or plainly misattributed.
- Duplicate of something already archived.
- Unusable — unreadable, corrupt, or the wrong file entirely.
- Rights holder objection, upheld (§5.6).

*Status: Shipped.*

### 7.2 Who decides

One moderator, the owner, applying §7.1 alone. No appeal body, no second opinion.
A rejected submission keeps the moderator note and is visible to the submitter
through the status page.

*Status: Shipped.*

### 7.3 Comments are post-moderated

Comments appear on posting and are only reviewed when flagged (§FR5.4). The bar is
deliberately low: illegal or abusive gets removed, disagreement stays. Spam is the
main exposure, since nothing throttles posting.

*Status: Shipped.*

### 7.4 Corrections

Corrections are advisory. The moderator applies them by editing or removing, and
the correction stays listed. Nothing is auto-applied.

*Status: Shipped.*

### 7.5 Transparency

Every approve and reject writes to `audit_log` with the note. The log is not
public.
*Status: Partial.* §16 covers exposing it.

## 8. UX Principles

### 8.1 The artefact is the subject

Every layout decision defers to the object. Large images, restrained chrome, no
competing illustration. The homepage is the exception — it is the one page allowed
a personality.

*Status: Shipped.*

### 8.2 Dark by default

`#0D0D0D` ground, `#1A1A1A` surfaces, `#2A2A2A` borders, `#F5F5F5` primary text,
`#888` secondary. Light tokens exist in `globals.css` but no theme switch is
exposed.
*Status: Shipped, dark only.*

### 8.3 Type

Space Grotesk for headings, Inter for body, both loaded from Google Fonts.
*Status: Shipped.* Self-hosting the pair would remove a third-party dependency
from the critical path; not yet done.

### 8.4 Mobile first

Single-column artefact layout below 720px, compressed nav, no horizontal scroll.
The archive will mostly be browsed on a phone.
*Status: Shipped.*

### 8.5 Lists render without JavaScript

Homepage, browse grid and artefact pages are server-rendered. Filtering needs JS;
reading does not.
*Status: Shipped.*

### 8.6 Motion

Entrance transitions and a slow gradient shift. `prefers-reduced-motion` is not
honoured — the gradient and framer-motion transitions run regardless.
*Status: Partial.*

### 8.7 Accessibility

Semantic headings, real links, generous targets, `alt` on every artefact image.
Icon-only controls (flag, reactions) carry no `aria-label`.
*Status: Partial.*

### 8.8 Weight

The bundle is pinned to IPFS and pulled on first visit, so bytes matter more than
on a normal host. The logo is a 32 KB WebP with real alpha. `og.png` at 630 KB is
the largest single asset and is only needed by crawlers.
*Status: Partial — see §16.*

## 9. Current State

Inline statuses throughout this document are authoritative; this is the summary.

**Live:** submission with multi-file upload and compression, private staging,
reference codes and status lookup, email alerting, moderation queue with pinning
and thumbnailing at approval, browse grid with filters, artefact pages, reactions,
comments with flagging, corrections, `/wanted`, admin authentication, IPFS build
and ENS repoint with rollback, social metadata, robots, sitemap, Sentry
instrumentation.

**Not live:** contributor accounts, wallet authentication, editing a published
artefact, drafts, bookmarks, contributor profiles, search beyond category
filtering, public audit log, data export, second pinning provider, Arweave,
governance, mobile client.

## 10. Information Architecture

### 10.1 Routes

| Route | Purpose | Render |
| --- | --- | --- |
| `/` | Hero, stats, recent, categories | Static |
| `/browse` | Full grid, category filter | Static list, client filter |
| `/artefact/[id]` | Artefact, licence, story, reactions, comments, corrections | Static per id |
| `/submit` | Submission form | Static shell |
| `/wanted` | Requests and responses | Client, API-backed |
| `/status` | Reference-code lookup | Static shell, client lookup |
| `/about` | Project rationale | Static |
| `/terms` | Terms | Static |
| `/admin/login` | Password form | Vercel only |
| `/admin/moderation` | Queue | Vercel only |
| `/api/*` | Submissions, moderation, wanted, corrections, feedback, flags | Vercel only |
| `/robots.txt`, `/sitemap.xml` | Crawler metadata | Static |
| `/og.png`, `/icon.svg` | Social card, favicon | Static |

### 10.2 Navigation

Top nav: Browse, Anyone has...?, About, Contribute. Footer: About, Terms,
Submission status, Browse. A floating feedback button sits on every page.

*Status: Shipped.*

### 10.3 URL scheme

Artefact URLs are `/artefact/<uuid>`. Stable and permanent; ugly and uncitable.
Slugs would need a redirect table to keep old URLs alive, so they are deferred.

*Status: Shipped as UUIDs.*

### 10.4 Client dependence

`/wanted` and `/status` render empty until JavaScript runs and calls the API, which
on the IPFS bundle means calling the Vercel deployment via `NEXT_PUBLIC_API_BASE`.
Both degrade to an empty shell if Vercel is unreachable.

*Status: Shipped, accepted.* §18.3 covers the dependence.

## 11. Data Model

Supabase Postgres. Access is service-role from the server, except where noted.

### 11.1 Tables

**`artefacts`** — `id`, `title`, `description`, `category_id`, `licence_type`,
`year_approx`, `credit_as`, `published_at`. `published_at` null means unpublished.

**`media_assets`** — `id`, `artefact_id`, `staging_path`, `ipfs_cid`, `thumb_cid`,
`mime_type`, `file_size_bytes`, `is_primary`. `staging_path` doubles as the Filebase
object key and survives publication so the original can be located.

**`submissions`** — `id`, `artefact_id`, `status`, `rights_declared`,
`staging_path`, `reference_code`, `moderator_note`, `reviewed_at`. Status is
`pending`, `approved` or `rejected`. `reference_code` is unique, ten base32
characters.

**`categories`** — `id`, `name`, `slug`, `licence_type`. The licence a submission
inherits.

**`stories`** — `id`, `artefact_id`, `content`, `created_at`. Optional contributor
narrative.

**`comments`** — `id`, `artefact_id`, `display_name`, `content`, `created_at`,
`flag_count`, `is_visible`.

**`comment_reactions`** — `id`, `comment_id`, `emoji`, `session_id`.

**`reactions`** — `id`, `artefact_id`, `emoji`, `session_id`.

**`corrections`** — `id`, `artefact_id`, `content`, `credit_as`, `created_at`.

**`wanted_posts`** / **`wanted_responses`** — `title` (≤120), `description`
(≤2000), `image_url`; response `content`.

**`audit_log`** — `id`, `action`, `entity_type`, `entity_id`, `note`,
`created_at`.

### 11.2 Functions

**`get_submission_status(text)`** — `SECURITY DEFINER`, granted to anon. Returns
status, timestamps, moderator note, title and artefact id when published. A
`SECURITY DEFINER` function is used because the static bundle cannot run a
server-side handler; the projection is minimal so nothing but the status leaks.

**`increment_comment_flag(uuid)`** — bumps `flag_count`.

### 11.3 Anonymous access

Comments and reactions are written straight from the browser with the anon key, so
RLS permits `INSERT` on `comments`, `reactions` and `comment_reactions` and
`SELECT` on visible comments. Every write is anonymous by definition; there is
nothing to authenticate.

*Status: Shipped.* An exposed anon key with insert rights is the reason the
moderation path exists at all.

### 11.4 Session identity

A random `session_id` in localStorage, sent as an `x-session-id` header by the
Supabase client, is the only per-visitor identity. It dedupes reactions and flags
in one browser and means nothing across devices.

*Status: Shipped.*

## 12. Technical Architecture

### 12.1 Stack

Next.js 16 App Router, React 19, TypeScript, Tailwind 4 plus inline styles,
framer-motion, Supabase Postgres and Storage, `sharp`, `@aws-sdk/client-s3`
against Filebase, Resend, Sentry, `viem`.

*Status: Shipped.*

### 12.2 Rendering

Server Components by default; client components only where interaction needs
them. Pages are prerendered at build time, which is what makes a static bundle
possible at all.

Two builds come from one source:

- `npm run build` — the ordinary server app. Route handlers and middleware work.
  This is what Vercel runs.
- `npm run build:ipfs` — sets `STATIC_EXPORT=1`, which switches on
  `output: "export"`, `trailingSlash` and unoptimised images. This is the archive.

`STATIC_EXPORT` is the only switch between them; neither build is a special case
of the other in the source.

*Status: Shipped.*

### 12.3 Hosting and provider rationale

**The bundle lives on IPFS.** CI uploads the export to a Filebase bucket
configured as an IPFS network bucket, so every `PutObject` is pinned and the
assigned CID is returned in the object metadata. A bucket CID is computed, pinned
and verified, then written to the ENS resolver.

*Filebase*, not Omnipin. v2.5 assumed Omnipin pushing a redirect page to Filecoin.
That was retired because a redirect page means the archive is a pointer to a
centralised app, which defeats the point. Filebase offers an S3-compatible API
with pinning on write, so CI can upload an ordinary directory and get real CIDs
back. Filebase is on the Pro tier; the bucket CID is stable across uploads.

*Supabase* holds the database and the private staging bucket. It is the one
component with no decentralised substitute at this scale.

*Vercel* runs the API and the admin pages. It is a preview and an origin for
route handlers, not the archive. Artefact pages, grids and metadata all work
without it; comments, reactions, wanted posts and moderation do not.

*Resend* sends moderator notifications. *Sentry* captures client and server errors,
with the tunnel rewrite disabled in the export because there is no server to
receive it.

*Status: Shipped.*

### 12.4 Media path

Staging bucket on upload → approval downloads the file → `PutObject` to Filebase
with the staging path as key → CID read from response metadata → `ipfs_cid`
recorded → `sharp` renders a 400px WebP thumbnail → `thumb_cid` recorded → staged
copy deleted. Originals and thumbnails are both immutable once pinned.

*Status: Shipped.*

### 12.5 ENS

The name's resolver holds an EIP-1577 contenthash. `set-contenthash.mjs` validates
the CID (must be v1, dag-pb or raw, sha2-256), strips the version and codec bytes,
prefixes `0xe301`, resolves the resolver through the ENS registry, sends
`setContenthash` and waits for a successful receipt.

Writes are made by a dedicated CI wallet holding a resolver-level approval, so the
owner key never touches the workflow. The name owner is separate again.

*Status: Shipped.*

### 12.6 Nothing renders from a database at request time

Every page is baked at build. A submission approved after a build is invisible
until the next publish. This is the central trade of the design and is why
approval triggers a rebuild automatically.

*Status: Shipped.*

## 13. Deployment and Operations

### 13.1 Publish

GitHub Actions, `workflow_dispatch`
or a `repository_dispatch` of type `publish`. Steps: checkout, install,
`npm run build:ipfs`, upload to Filebase, compute the bucket CID, pin and verify it,
write the contenthash.

*Status: Shipped.*

### 13.2 Rollback

`repoint-ens.yml` writes a previous CID back to the resolver without rebuilding,
so a bad publish is reverted by pointing at the last good one.

*Status: Shipped.* Requires the previous CID to be recorded somewhere; publishes
should be logged with their CIDs.

### 13.3 Artifacts

The exported bundle is uploaded as a workflow artifact with seven-day retention, so
a published bundle can be retrieved without re-running the build.

*Status: Shipped.*

### 13.4 Operational dependencies

Three things expire or run out, and each fails quietly:

- **`GITHUB_DISPATCH_TOKEN`** — fine-grained PAT, 90-day expiry. When it lapses,
  approvals stop triggering publishes and the site silently freezes.
- **CI wallet** — must hold ETH for the contenthash write. Top up below 0.005 ETH.
- **`FILEBASE_IPFS_TOKEN`** — pinning and verification fail without it; the run
  fails rather than publishing an unpinned CID.

*Status: Shipped.* None are monitored; all are checked by hand.

### 13.5 Secrets

`FILEBASE_ACCESS_KEY_ID`, `FILEBASE_SECRET_ACCESS_KEY`, `FILEBASE_SHELL_BUCKET`,
`FILEBASE_IPFS_TOKEN`, `ENS_NAME`, `ENS_RPC_URL`, `ENS_UPDATER_PRIVATE_KEY`,
`GITHUB_DISPATCH_TOKEN`, `ADMIN_PASSWORD`, `RESEND_API_KEY`, Supabase URL and both
keys, `NEXT_PUBLIC_SITE_URL`, Sentry credentials.

*Status: Shipped.* The updater key and the owner key are deliberately different.

## 14. API

### 14.1 Base

`NEXT_PUBLIC_API_BASE` points at the Vercel deployment, so client code works
identically from the ENS bundle and from Vercel. Route handlers exist only on
Vercel; the IPFS copy calls across.

*Status: Shipped.* This is the sharpest centralisation in the system — see §18.3.

### 14.2 Routes

| Route | Methods | Auth | Notes |
| --- | --- | --- | --- |
| `/api/submit` | `POST`, `OPTIONS` | none | multipart, up to five files, returns `code` and `statusUrl` |
| `/api/moderate` | `POST` | admin cookie | approve or reject |
| `/api/moderate-comment` | `POST` | admin cookie | approve or remove |
| `/api/flag-comment` | `POST` | none | increments and emails |
| `/api/correction` | `POST` | none | insert, 1000 char cap |
| `/api/feedback` | `POST` | none | feedback button |
| `/api/wanted` | `GET`, `POST` | none | list and create requests |
| `/api/wanted/respond` | `POST` | none | reply to a request |
| `/api/admin-login` | `POST` | password | sets the session cookie |

All JSON routes answer `OPTIONS` with CORS preflight so a non-browser client can
call them.

*Status: Shipped.*

### 14.3 Caching

`/api/wanted` is `force-static` with `revalidate = 0` so the list stays fresh while
satisfying the export constraint.

*Status: Shipped.*

### 14.4 Validation

Server-side validation is present on the routes that take free text: length caps on
corrections, wanted titles and descriptions, required-field checks on submissions.
Type and size are enforced client-side only, so a hand-rolled `POST` can exceed
them.

*Status: Partial.*

### 14.5 No versioning, no keys

One unversioned surface, no API keys, no rate limiting. A mobile client would need
all three.

*Status: Partial.* See §16.

## 15. Non-Functional Requirements

### 15.1 Permanence

Media is addressed by CID, never by host URL. The bundle is pinned and rebuildable
from public source.

*Status: Shipped.*

### 15.2 Build time

A publish runs three to four minutes, dominated by install and export. Acceptable
at current scale.

*Status: Shipped.*

### 15.3 Failure isolation

Approval aborts rather than half-publishing; publish dispatch failures do not
undo an approval; email failures do not fail a submission; thumbnail failures do
not fail an approval.

*Status: Shipped.*

### 15.4 Metadata

Per-page canonical URLs, `og:title`, `og:description`, `og:image` at 1280×720,
`twitter:card` of `summary_large_image`, `alt` text. Artefact pages override the
default card with their own thumbnail and title; everything else inherits
`/og.png`.

*Status: Shipped.*

### 15.5 Crawlers

`robots.txt` allows everything and names the sitemap; `sitemap.xml` lists static
pages and every published artefact with lastmod.

*Status: Partial.* eth.limo serves its own `robots.txt` for all ENS sites, so the
built file — and its sitemap line — is never seen on this host.

### 15.6 Performance

No measured budget. Largest asset is `og.png` at 630 KB; the logo is 32 KB WebP.

*Status: Partial.*

### 15.7 Accessibility

Semantic structure and image `alt` are present; icon-only controls lack labels and
`prefers-reduced-motion` is ignored.

*Status: Partial.*

### 15.8 Resilience

The archive is not uniformly dependent on one vendor. Each component fails
differently:

| Component | If it fails | What survives | Mitigation |
| --- | --- | --- | --- |
| Filebase pinning | Blocks stop being pinned | CID stays valid; resolves only while another node holds it | Second pinning provider (§16 Phase 5) |
| eth.limo gateway | `merchandmemes.eth.limo` breaks | Name resolves on-chain; any gateway plus the CID still serves it; Brave resolves `.eth` natively | Document gateway fallback; domain in §16 |
| ENS mainnet / owner key | Contenthash cannot be changed | Current content remains resolvable by CID | Key already separated from the CI updater |
| GitHub | Source and CI unavailable | Pinned bundle keeps serving | Public MIT source; third party can fork |
| Vercel | API, admin, comments, reactions, wanted, moderation stop | All pages, all media, all metadata | Documented; §18.3 |
| Supabase | No new build can render data; staging lost | Existing bundle unaffected | Data export (§16 Phase 5) |

*Status: Partial.* The single pinner and the single gateway are the two that
matter, and neither has a mitigation in place.

## 16. Phases

### Phase 1 — Delivered

Closed. Everything below is Shipped and described elsewhere in this document.

Submission form with multi-file upload, client compression and duplicate guard;
private staging; reference codes with collision retry and a status lookup;
moderator email alerting; moderation queue with pinning, thumbnailing and
fail-closed approval; browse grid with category filter; artefact pages with
licence, year, story and credit; reactions; comments with flagging; corrections;
`/wanted` with responses; admin password authentication; IPFS export build, pin,
CID computation, contenthash write and rollback; social metadata; robots; sitemap;
Sentry instrumentation; logo with real alpha at 32 KB.

### Phase 2 — Near-term hardening

- Written recovery procedure (SC6): rebuild from source, pin independently,
  repoint, gateway fallback. Without it "anyone can preserve this" is a claim.
- Email alert on corrections (§FR5.5).
- Verify HEIC on Chromium, then either fix or drop it from the helper text.
- Styled `not-found.tsx`.
- Reconcile terms §8 with reality — no registration exists.
- Recompress `og.png` to JPEG.
- Delete unused scaffold files and `logo.png` from `public/`.
- Sentry auth token so stack traces are not minified.
- Monitor the three expiring dependencies in §13.4.

### Phase 3 — Reach

- Point a conventional domain at the bundle, keeping the ENS name canonical via
  `rel=canonical`. Gives a real `robots.txt`, a submittable sitemap and a host
  search engines trust.
- Submit the sitemap to Search Console and Bing.
- Citation block on artefact pages.
- Full-text search over titles and descriptions with Postgres FTS.
- Expose `audit_log` publicly.

### Phase 4 — Contributor continuity

Deferred as a block. Nothing here serves a first-time contributor, so it waits
until the archive has enough material that people return.

- Wallet authentication via EIP-4361 (§FR1.7).
- Contributor accounts with profiles and submission history (§FR1.8).
- Drafts saved before submission.
- Editing a published artefact's text, without changing pinned media.
- Bookmarks.

Wallet before accounts, because a signature proves continuity without an email and
keeps the no-email promise intact.

### Phase 5 — Durability

- Second pinning provider, so no single vendor holds the only copy (§15.8).
- Data export in open formats (SC8).
- Arweave as a cold archival tier.
- Documented multi-gateway resolution.
- Bundle size budget, enforced in CI.

### Phase 6 — Governance

- Volunteer moderators with individual credentials instead of one shared
  password.
- Quorum on disputed rejections.
- Optimistic moderation — publish immediately, review on flag, matching how
  comments already work.
- Mirror `audit_log` on-chain so the record is not editable by the operator.

### Deferred, with reasons

**Exchange of artefacts.** Trade or swap between visitors. Unscoped: a noticeboard,
a match, or escrow — and whether the platform takes custody. Leaning noticeboard,
because custody drags in disputes, shipping and liability that an archive does not
need. Deferred until there is demand to justify a design pass.

**Discoverable domain.** A second host for search engines. Deferred to Phase 3
because at current volume the ENS name is reachable by everyone who knows about the
project, and the domain only matters once being unfindable costs something.

**Rename.** Closed. Merch&Memes is final; see §19.

## 17. Risks

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| `GITHUB_DISPATCH_TOKEN` expires | Certain, in 90 days | Site silently freezes at the last build | Calendar reminder; renew before expiry |
| CI wallet runs dry | Moderate | Publishes fail at the contenthash step | Top up below 0.005 ETH; failure is loud in Actions |
| Filebase unpins or closes | Low, rising with time | Archive degrades toward unreachable | Second pinner, Phase 5 |
| Single admin falls ill or loses interest | Certain eventually | Queue stops, no governance | Phase 6 |
| Comment spam | High, once noticed | Noise on artefact pages | Flagging, manual removal; no throttle yet |
| A pinned mistake is permanent | Certain | Wrong file or title live forever | Corrections and edits; CIDs cannot be recalled (§5.4) |
| Rights claim contested | Moderate | Takedown, possible dispute | §5.6, manual and immediate |
| Wrong category licence applied | Low | Object published under the wrong terms | Category is chosen by the submitter; reviewable at moderation |
| Vercel outage during moderation | Low | Queue unavailable | Accepted; the archive itself serves |
| ENS name expires (2031) or owner key lost | Low / unknown | Address lost | Renewal calendar; key custody |
| Credentials in the repo | Low | Full compromise | All via secrets, never committed |

The two that need action rather than acceptance are the token expiry and the single
pinner.

## 18. Decentralisation

### 18.1 Principle

Decentralise where it buys survival; centralise where it buys speed. Content and
address earn their place — a hash survives its host, and a name held rather than
rented survives a registrar. Coordination does not: a single moderator reviewing a
queue is better than a quorum, and a Postgres row is better than a chain write, at
this size.

The test applied throughout: **if this component vanished tomorrow, would the
archive still be readable?** Where the answer is no, it is in the decentralised
column.

### 18.2 Keys and roles

- **ENS owner** — `0xD6a42821C6a24A8eb25c49d9B48Cc822608300dF`. Controls the name.
  Held offline.
- **Resolver approval** — granted to the CI wallet
  `0xee9876160e52f571dA56E26162Ae05a6c72DE95D`, scoped to `setContenthash` only.
  Compromise cannot transfer the name.
- **Admin password** — human credential for the queue, unrelated to the keys above.

Contributor `wallet_address` is a nullable column, unused until Phase 4. Roles are
designed to be addressable from the start so moderator authority can migrate
on-chain later without a permission model change.

*Status: Shipped.* Key separation is the part that matters and is done.

### 18.3 Scope

| Layer | State | Why |
| --- | --- | --- |
| Pages | Decentralised | Exported and pinned; rebuildable from MIT source |
| Media | Decentralised | Content-addressed, pinned, CID in the database |
| Address | Decentralised | ENS contenthash on mainnet |
| Pinning | Single provider | Filebase only; Phase 5 adds a second |
| Database | Centralised | No comparable managed option at this scale |
| API surface | Centralised | Route handlers need a server; Vercel provides it |
| Moderation state | Centralised | Human decisions in Postgres |
| Comments, reactions | Centralised | Written straight to Supabase from the browser |
| Search | Centralised | Postgres FTS |
| Admin auth | Centralised | One password in one env var |

The gap between rows is the honest description of this project: the record is
decentralised and the machinery around it is not. A visitor can read everything
without a centralised component except the gateway. Contributing, commenting and
moderating all require one.

v2.5 claimed the reverse — that only a redirect page was hosted and the
application stayed centralised — and was wrong in both directions.

*Status: Shipped, with the pinning gap noted.*

### 18.4 What is deliberately not decentralised

**The build.** One CI pipeline, one repository. Anyone can fork and rebuild, but
the canonical build is centralised. Splitting it would mean multiple builders
racing to write the contenthash.

**The decision to publish.** Moderation is a person. Optimistic moderation
(Phase 6) moves the delay, not the authority.

**The schema.** Postgres, not a content-addressed store. Relational queries are
worth more here than schema immutability.

## 19. Naming

**19.1 Rename — closed.** The project was written as "MemesMerch" in places and the
order was unsettled. Merch&Memes is final and the v3.0 rename pass is retired.

**19.2 Forms.** Display: `Merch&Memes`. ENS: `merchandmemes.eth`. Repository:
`merch-and-memes`. No ampersand in anything technical.

*Status: Shipped.*

## 20. Repository Conventions

Single `main` branch, no feature branches. One author, so a branch would be
ceremony.

Components live beside their route (`app/artefact/[id]/Comments.tsx`); there is no
root `components/` folder. `scripts/` holds CI helpers. `docs/` holds this document.

*Status: Shipped.*

## 21. Current Page Implementations

Recorded so a reader knows what is there without opening the source.

**`/`** — animated hero with floating emoji, CountUp stats (server-rendered at the
real figure), recent artefacts, category grid, a memes block badged "Coming soon"
with no date. Nav and footer.
*Gap:* the memes badge promises without a schedule.

**`/browse`** — server-rendered grid of every published artefact, client-side
category filter, document glyph for PDFs.
*Gap:* filtering needs JS.

**`/artefact/[id]`** — gallery, category, licence, title, credit, year, description,
contributor story, reactions, corrections, comments, licence block.
*Gap:* no citation block; corrections produce no alert.

**`/submit`** — multi-file input, compression, limits, duplicate guard, optional
credit, rights declaration, success screen carrying the reference code and status
URL.
*Gap:* HEIC unverified on Chromium.

**`/status`** — code field , lookup, per-status rendering with the note on rejection and a link when published.
*Gap:* renders empty until JS runs.

**`/wanted`** — request form and list with inline responses, unmoderated.
*Gap:* no email on response; a poster is never told they got one.

**`/about`** — project rationale.

**`/terms`** — nine sections.
*Gaps:* §5 still says the website is conventionally hosted; §8 describes
registration that does not exist; the page is stamped "July 2026" and "will be
extended".

**`/admin/login`**, **`/admin/moderation`** — password form and queue, Vercel only.

**404** — the default Next page, unstyled and off-brand.

## Appendix — Open Items

Carried from v2.5 with current status. Phase references point at §16.

| | Item | Status |
| --- | --- | --- |
| A1 | Co-locate serverless region with the database (eu-west-1, needs Vercel Pro) | Open |
| A2 | Rename the Mac account and hostname | Open |
| A3 | Legal review of the liability clause (§9 terms) | Open |
| A4 | Written recovery procedure | Phase 2, SC6 |
| A5 | Correction alert email | Phase 2 |
| A6 | HEIC behaviour on Chromium | Phase 2 |
| A7 | `og.png` recompression | Phase 2 |
| A8 | Scaffold file removal from `public/` | Phase 2 |
| A9 | Delete the two legacy test artefacts — they store old Supabase URLs and render broken | Phase 2 |
| A10 | Remove `/sentry-example-page` and `/api/sentry-example-api` | Phase 2 |
| A11 | Terms §5 hosting description | Phase 2 |
| A12 | Terms §8 registration claim | Phase 2 |
| A13 | Styled 404 | Phase 2 |
| A14 | Sentry auth token | Phase 2 |
| A15 | Second pinning provider | Phase 5 |
| A16 | Public audit log | Phase 3 |


