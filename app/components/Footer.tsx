import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 px-6 py-8 text-center text-sm text-gray-400">
      <p className="mb-2">Merch&Memes — the web3 archive · merchandmemes.eth · CC0 &amp; CC BY 4.0</p>
      <p className="flex items-center justify-center gap-4">
        <Link href="/about" className="hover:text-gray-600">About</Link>
        <span>·</span>
        <Link href="/terms" className="hover:text-gray-600">Terms of Service</Link>
        <span>·</span>
        <Link href="/browse" className="hover:text-gray-600">Browse</Link>
      </p>
    </footer>
  )
}