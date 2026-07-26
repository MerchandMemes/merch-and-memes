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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <FeedbackButton />
        <Footer />
      </body>
    </html>
  )
}