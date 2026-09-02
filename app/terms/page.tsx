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
          <img src="/logo_nofold.png" alt="Merch&Memes" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
          <span style={{ fontWeight: 700, color: 'white', fontFamily: 'Space Grotesk, sans-serif' }}>Merch&Memes</span>
        </Link>
        <Link href="/browse" style={{ fontSize: '0.9rem', color: '#888', textDecoration: 'none' }}>Browse</Link>
      </nav>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '64px 24px' }}>

        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: 'white', marginBottom: '8px' }}>
          Terms of Service
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: '48px' }}>
          Last updated July 2026 · This is a minimal terms of service for the MVP phase and will be extended.
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
            body: 'Merch&Memes runs on a combination of centrally-hosted infrastructure and decentralised storage. The website, database, submission and moderation workflow, search, reactions, and comments are hosted on conventional servers. Approved artefact images are stored on IPFS, a decentralised network, and the archive\u2019s domain (merchandmemes.eth) is registered on ENS. For content stored on IPFS: once published, its content identifier (CID) is permanent and may remain accessible even if the artefact is later removed from this site. We can unpin content from our infrastructure but cannot guarantee removal from the broader IPFS network. This is a property of the technology, not a limitation of our moderation. Other platform data (submission records, comments, reactions, moderation history) is stored in a centrally-managed database and is not subject to the same permanence property: this data can be fully deleted upon request or as part of standard moderation action. The extent of decentralisation described above reflects the current build stage of the platform and may change. Further decentralisation of the application\u2019s data and interactive features is on the project roadmap and may be pursued based on community interest and available contributor capacity.',
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
            body: 'We collect only the minimum information necessary. Anonymous contributions require no personal information. Registered contributors provide an email address and username only. No personal information is sold or shared with third parties. Notification emails, if provided, are used only for reaction notifications.',
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