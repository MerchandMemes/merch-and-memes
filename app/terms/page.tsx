import Link from 'next/link'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">M&M</span>
          </div>
          <span className="font-semibold text-gray-900">Merch&Memes</span>
          <span className="text-gray-400 text-sm">the web3 archive</span>
        </Link>
        <Link href="/browse" className="text-sm text-gray-600 hover:text-gray-900">Browse</Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16">

        <h1 className="text-4xl font-black text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-12">Last updated July 2026 · This is a minimal terms of service for the MVP phase and will be extended.</p>

        <div className="space-y-10 text-gray-600">

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. Acceptance</h2>
            <p className="leading-relaxed">
              By accessing or contributing to Merch&Memes you agree to these terms. Contributors who submit
              content additionally agree to the content licensing terms described below.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. What you can contribute</h2>
            <p className="leading-relaxed mb-3">
  Merch&Memes accepts photographs and digital images of physical merchandise (hoodies, stickers,
  badges, caps, hardware, and similar objects), as well as digital artefacts such as memes,
  photography, artwork, publications, screenshots, and POAPs; all related to Web3 culture and
  history. Contributors submit images of their artefacts, not the physical objects themselves.
</p>
            <p className="leading-relaxed">
              You may not submit content that is illegal, harmful, abusive, defamatory, or unrelated
              to Web3 culture. All submissions are reviewed before publication.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. Licensing</h2>
            <p className="leading-relaxed mb-3">
            Merchandise and promotional artefacts are published under{' '}
              <strong className="text-gray-900">CC0 (Public Domain)</strong>: you waive all rights
              and the content enters the public domain.
            </p>
            <p className="leading-relaxed">
              Memes, photography, artwork, and personal creative work are published under{' '}
              <strong className="text-gray-900">CC BY 4.0</strong>: you retain copyright but grant
              others the right to share and adapt your contribution with attribution.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Your responsibility</h2>
            <p className="leading-relaxed">
              By submitting content you confirm that you hold the rights to share it, or have obtained
              appropriate permission. You are responsible for ensuring your submission does not infringe
              the intellectual property or privacy rights of any third party.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. IPFS and permanence</h2>
            <p className="leading-relaxed">
              Approved artefacts are stored on IPFS — a decentralised network. Once content is published,
              its content identifier (CID) is permanent and may remain accessible even if the artefact
              is later removed from this site. We can unpin content from our infrastructure but cannot
              guarantee removal from the broader IPFS network. This is a property of the technology,
              not a limitation of our moderation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. Takedown requests</h2>
            <p className="leading-relaxed mb-3">
  If you believe content published on this site infringes your rights, contact the platform
  administrator. Confirmed infringements will be removed promptly from our infrastructure,
  meaning the content will no longer be accessible through this site or our storage services.
</p>
<p className="leading-relaxed">
  As noted in section 5, content stored on IPFS may persist on the broader decentralised network
  beyond our control. We will always act promptly on valid takedown requests within our
  infrastructure, and we will document all removal actions transparently.
</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">7. Privacy</h2>
            <p className="leading-relaxed">
              We collect only the minimum information necessary. Anonymous contributions require no
              personal information. Registered contributors provide an email address and username only.
              No personal information is sold or shared with third parties. Notification emails, if
              provided, are used only for reaction notifications.
            </p>
          </section>
<section>
  <h2 className="text-lg font-bold text-gray-900 mb-3">8. Fair use</h2>
  <p className="leading-relaxed mb-3">
    The content in this archive is made available for personal, educational, research, and
    non-commercial purposes consistent with fair use principles. You may view, share, and
    reference individual artefacts in accordance with their stated licence (CC0 or CC BY 4.0).
  </p>
  <p className="leading-relaxed mb-3">
    You may not systematically download, scrape, or reproduce the archive or substantial
    portions of it for commercial purposes, to build a competing service, or in any way
    that undermines the integrity or purpose of the archive as a community resource.
  </p>
  <p className="leading-relaxed">
    Automated access to this site, including crawlers, bots, and scraping tools, is
    permitted only for non-commercial indexing purposes and must not place unreasonable
    load on the platform infrastructure. Bulk downloading of media files is not permitted.
  </p>
</section>
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">9. Limitation of liability</h2>
            <p className="leading-relaxed">
              Merch&Memes is provided as a community project without warranty of any kind. The platform
              operator accepts no liability for loss or damage arising from use of the platform or
              reliance on contributed content.
            </p>
          </section>

        </div>

        <div className="border-t border-gray-200 pt-8 mt-12">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">← Back to home</Link>
        </div>

      </div>

    </main>
  )
}