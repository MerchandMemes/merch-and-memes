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

- **CC0** for ephemera where attribution is impractical or irrelevant — memes,
  screenshots and similar. No rights reserved.
- **CC BY 4.0** for objects with an identifiable maker or origin — garments,
  hardware, printed matter. Attribution required.

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
