import type { Metadata } from 'next'
import './globals.css'
import FeedbackButton from './components/FeedbackButton'
import Footer from './components/Footer'

export const metadata: Metadata = {
  title: 'Merch&Memes — the web3 archive',
  description: 'A community-driven archive of Web3 cultural history. Every hoodie, sticker, meme, POAP, and badge tells a piece of the story.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <FeedbackButton />
        <Footer />
      </body>
    </html>
  )
}