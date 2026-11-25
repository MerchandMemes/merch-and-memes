import Link from 'next/link'

export default function TermsPage() {
  return (
    <main style={{ background: '#0D0D0D', minHeight: '100vh', color: '#F5F5F5' }}>

      <nav style={{
        borderBottom: '1px solid #2A2A2A', background: 'rgba(13,13,13,0.95)',
        padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(8px)',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img src="/logo_nofold.webp" alt="Merch&Memes" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
          <span style={{ fontWeight: 700, color: 'white', fontFamily: 'Space Grotesk, sans-serif' }}>Merch&Memes</span>
        </Link>
        <Link href="/browse" style={{ fontSize: '0.9rem', color: '#888', textDecoration: 'none' }}>Browse</Link>
      </nav>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '64px 24px' }}>

        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: 'white', marginBottom: '8px' }}>
          Terms of Service
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#999', marginBottom: '48px' }}>
          Last updated November 2026 · These terms are minimal by design and will be extended.
        </p>

        {[
          {
            n: '1', title: 'Acceptance',
            body: 'By accessing or contributing to Merch&Memes you agree to these terms. Contributors who submit content additionally agree to the content licensing terms described below.',
          },
          {
            n: '2', title: 'What you can contribute',
            body: 'Merch&Memes accepts photographs and digital images of physical merchandise (hoodies, stickers, badges, caps, hardware, and similar objects), as well as digital artefacts such as memes, photography, artwork, publications, screenshots, and POAPs, all related to Web3 culture and history. Contributors submit images of their artefacts, not the physical objects themselves. You may not submit content that is illegal, harmful, abusive, defamatory, or unrelated to Web3 culture. All submissions are reviewed before publication.',
          },
          {
            n: '3', title: 'Licensing',
            body: 'Merchandise and promotional artefacts are published under CC0 (Public Domain): you waive all rights and the content enters the public domain. Memes, photography, artwork, and personal creative work are published under CC BY 4.0: you retain copyright but grant others the right to share and adapt your contribution with attribution.',
          },
          {
            n: '4', title: 'Your responsibility',
            body: 'By submitting content you confirm that you hold the rights to share it, or have obtained appropriate permission. You are responsible for ensuring your submission does not infringe the intellectual property or privacy rights of any third party.',
          },
          {
            n: '5', title: 'Architecture and permanence',
            body: 'Merch&Memes is served from IPFS, a decentralised network, and its address is an ENS name registered on Ethereum mainnet. The pages themselves are content-addressed: each published version of the site has a content identifier (CID) and can be retrieved from any IPFS gateway by anyone, without going through this project. Approved artefact media is pinned to IPFS and referenced by CID. Once pinned, a CID is permanent and may remain retrievable even if the artefact is later removed from this site. We can unpin from our own infrastructure but cannot recall copies held elsewhere; this is a property of the technology, not a limitation of moderation. Some things remain on conventional servers: the submission and moderation workflow, the database, search, comments, reactions and the admin interface. That data is centrally held and can be deleted in full on request or by moderation action. The extent of decentralisation reflects the current build, and the roadmap is published in the repository.',
          },
          {
            n: '6', title: 'Takedown requests',
            body: 'If you believe content published on this site infringes your rights, contact the platform administrator. Confirmed infringements will be removed promptly from our infrastructure, meaning the content will no longer be accessible through this site or our storage services. As noted in section 5, content stored on IPFS may persist on the broader decentralised network beyond our control.',
          },
          {
            n: '7', title: 'Fair use',
            body: 'The content in this archive is made available for personal, educational, research, and non-commercial purposes consistent with fair use principles. You may not systematically download, scrape, or reproduce the archive or substantial portions of it for commercial purposes, to build a competing service, or in any way that undermines the integrity of the archive as a community resource. Automated access is permitted only for non-commercial indexing and must not place unreasonable load on the platform. Bulk downloading of media files is not permitted.',
          },
          {
            n: '8', title: 'Privacy',
            body: 'We collect as little as possible. There are no accounts and no registration. Contributing requires no personal information: the optional credit name is free text and is published if supplied. Comments accept an optional display name, and a blank name is shown as Anonymous. Each submission receives a random reference code, which is the only handle to it; keep it if you want to check the status, since it is linked to no identity. Reactions and flags are keyed to a random identifier stored in your browser, and clearing browser storage resets it. No personal information is sold or shared with third parties.',
          },
          {
            n: '9', title: 'Limitation of liability',
            body: 'Merch&Memes is provided as a community project without warranty of any kind. The platform operator accepts no liability for loss or damage arising from use of the platform or reliance on contributed content.',
          },
        ].map((section) => (
          <div key={section.n} style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '10px' }}>
              <span style={{ color: '#627EEA', marginRight: '8px' }}>{section.n}.</span>
              {section.title}
            </h2>
            <p style={{ color: '#777', lineHeight: 1.8, fontSize: '0.95rem' }}>{section.body}</p>
          </div>
        ))}

        <div style={{ borderTop: '1px solid #2A2A2A', paddingTop: '24px' }}>
          <Link href="/" style={{ fontSize: '0.9rem', color: '#627EEA', textDecoration: 'none' }}>← Back to home</Link>
        </div>

      </div>
    </main>
  )
}
