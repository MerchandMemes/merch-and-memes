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
