import Link from 'next/link'

export default function AboutPage() {
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

        <h1 className="text-4xl font-black text-gray-900 mb-6">About Merch&Memes</h1>

        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Web3 has always been more than technology. It is also a culture — shaped by the people who built it,
          questioned it, celebrated it, and occasionally laughed at it.
        </p>

        <p className="text-gray-600 mb-6 leading-relaxed">
          Every conference hoodie tucked away in a drawer, every faded sticker on an old laptop, every meme
          shared through a bull run or a bear market tells a small part of the story. On their own they are
          keepsakes. Together they become the history of a movement.
        </p>

        <p className="text-gray-600 mb-12 leading-relaxed">
          Merch&Memes is a community-driven archive of Web3 cultural history. Whether you created a protocol,
          organised a meetup, designed a sticker, or simply picked one up at a conference years ago —
          your contribution belongs here.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">How it works</h2>

        <div className="space-y-4 mb-12">
          {[
            { n: '1', title: 'Contribute', text: 'Submit an artefact — a photo of your merch, a meme, a POAP, a badge. Add the story behind it.' },
            { n: '2', title: 'Review', text: 'Every submission is reviewed before publication to keep the archive authentic and on-topic.' },
            { n: '3', title: 'Preserve', text: 'Approved artefacts are stored on IPFS — a decentralised network designed for long-term preservation.' },
            { n: '4', title: 'Discover', text: 'Browse, search, react, and comment. The archive grows with every contribution.' },
          ].map((step) => (
            <div key={step.n} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                {step.n}
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">{step.title}</div>
                <div className="text-gray-600 text-sm leading-relaxed">{step.text}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Open by design</h2>

        <p className="text-gray-600 mb-4 leading-relaxed">
          Merch&Memes is open source, ENS-native, and IPFS-first. The archive lives at{' '}
          <span className="font-medium text-gray-900">merchandmemes.eth</span> and is accessible
          through any ENS-compatible browser or via{' '}
          <a href="https://merchandmemes.eth.limo" className="underline hover:text-gray-900">
            merchandmemes.eth.limo
          </a>.
        </p>

        <p className="text-gray-600 mb-12 leading-relaxed">
          Merchandise artefacts are published under <strong>CC0</strong> — no rights reserved.
          Memes, photography, and creative works are published under <strong>CC BY 4.0</strong> —
          free to share with attribution.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Memes — coming soon</h2>

        <p className="text-gray-600 mb-12 leading-relaxed">
          From &ldquo;This is fine&rdquo; during the 2018 bear market to the Terra collapse meme series of May 2022,
          community humour is how Web3 processed every cycle. The meme archive is being built with
          the community — submit yours and help shape what it becomes.
        </p>
<h2 className="text-2xl font-bold text-gray-900 mb-4">This is just the beginning</h2>

<p className="text-gray-600 mb-4 leading-relaxed">
  The archive you see today is a starting point, not a finished product. It will grow with every
  contribution, every reaction, every piece of feedback from the community that uses it. The features,
  the categories, the way artefacts are organised — all of it will evolve based on what the community
  needs and what the culture produces.
</p>

<p className="text-gray-600 mb-4 leading-relaxed">
  There is a roadmap. It includes community governance, a full meme archive, event tagging, contributor
  profiles, and permanent archival storage on decentralised networks designed to outlast any single
  organisation or platform. If any of that interests you — as a contributor, a volunteer moderator,
  a developer, or simply someone with ideas — we want to hear from you. Use the feedback button on
  any page.
</p>

<p className="text-gray-600 mb-12 leading-relaxed">
  What will not change: the archive will always be decentralised, free to access, privacy-respecting,
  and owned by the community that built it. No ads, no paywalls, no data harvesting.
  Just Web3 culture, preserved for the people who lived it — and open to everyone who is curious
  about it.
</p>


        <div className="border-t border-gray-200 pt-8 flex gap-4">
          <Link href="/submit" className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800">
            Contribute an artefact
          </Link>
          <Link href="/browse" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50">
            Browse the archive
          </Link>
        </div>

      </div>

    </main>
  )
}