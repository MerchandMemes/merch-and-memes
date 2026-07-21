import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">

      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">M&M</span>
          </div>
          <span className="font-semibold text-gray-900">Merch&Memes</span>
          <span className="text-gray-400 text-sm">the web3 archive</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/browse" className="text-sm text-gray-600 hover:text-gray-900">Browse</Link>
          <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">About</Link>
          <Link href="/submit" className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
            Contribute
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full mb-6">
          ENS-native · IPFS-first · Open source
        </div>
        <h1 className="text-5xl font-black text-gray-900 leading-tight mb-6">
          The cultural archive<br />of Web3
        </h1>
        <p className="text-lg text-gray-500 mb-10 leading-relaxed">
          Every hoodie, sticker, meme, POAP, and badge tells a piece of the story.
          Contribute yours — or explore the history the community is building together.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/submit" className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800">
            Contribute an artefact
          </Link>
          <Link href="/browse" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50">
            Explore the archive
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-200 bg-white py-8">
        <div className="max-w-4xl mx-auto grid grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-500 mt-1">artefacts</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-500 mt-1">contributors</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-500 mt-1">events documented</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">2013</div>
            <div className="text-sm text-gray-500 mt-1">earliest artefact</div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Hoodies & Sweatshirts', emoji: '🧥', slug: 'hoodies-sweatshirts' },
            { name: 'T-Shirts', emoji: '👕', slug: 't-shirts' },
            { name: 'Stickers', emoji: '🏷️', slug: 'stickers' },
            { name: 'Badges & Pins', emoji: '📛', slug: 'badges-pins' },
            { name: 'Caps & Hats', emoji: '🧢', slug: 'caps-hats' },
            { name: 'Posters & Flyers', emoji: '📄', slug: 'posters-flyers' },
            { name: 'POAPs', emoji: '⬡', slug: 'poaps' },
            { name: 'Memes', emoji: '😂', slug: 'memes' },
          ].map((cat) => (
            <Link
              key={cat.slug}
              href={`/browse?category=${cat.slug}`}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-400 transition-colors"
            >
              <div className="text-2xl mb-2">{cat.emoji}</div>
              <div className="text-sm font-medium text-gray-900">{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Memes narrative */}
      <section className="bg-gray-900 text-white px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Memes are history too</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            From &ldquo;This is fine&rdquo; during the 2018 bear market to the Terra collapse meme series of May 2022,
            community humour is how Web3 processed every bull run, every crash, and everything in between.
            We are building the meme archive with the community. Submit yours and help shape what it becomes.
          </p>
          <Link href="/submit?category=memes" className="inline-block border border-gray-600 text-gray-300 px-5 py-2 rounded-lg text-sm hover:border-gray-400 hover:text-white">
            Submit a meme
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-6 py-8 text-center text-sm text-gray-400">
        <p>Merch&Memes — the web3 archive · merchandmemes.eth · CC0 &amp; CC BY 4.0</p>
      </footer>

    </main>
  )
}