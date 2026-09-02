import Link from 'next/link'

export default function AboutPage() {
  const principles = [
    { title: 'Community-driven', text: 'The platform exists to enable the Web3 community to document and preserve its own cultural history.' },
    { title: 'Open and accessible', text: 'Barriers to participation are minimised while maintaining the quality and integrity of the archive.' },
    { title: 'Authenticity', text: 'Contributions represent genuine artefacts, experiences, and memories.' },
    { title: 'Context matters', text: 'An artefact without its story is only part of the historical record.' },
    { title: 'Long-term preservation', text: 'The platform prioritises technologies that maximise long-term availability.' },
    { title: 'Openness', text: 'The project is developed as open-source software wherever practical.' },
    { title: 'Privacy', text: 'Only the minimum information necessary for operation is collected.' },
    { title: 'Decentralisation', text: 'Where practical, the platform favours decentralised technologies and open standards.' },
    { title: 'Respectful stewardship', text: 'Moderation exists to protect quality, authenticity, and accessibility, not to shape historical narrative.' },
    { title: 'Evolution', text: 'The platform is intended to evolve alongside the community it serves.' },
  ]

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

        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: 'white', marginBottom: '24px' }}>
          About Merch&Memes
        </h1>

        <p style={{ fontSize: '1.15rem', color: '#999', lineHeight: 1.8, marginBottom: '20px' }}>
          Web3 has always been more than technology. It is also a culture, shaped by the people who built it, questioned it, celebrated it, and occasionally laughed at it.
        </p>

        <p style={{ color: '#777', lineHeight: 1.8, marginBottom: '20px' }}>
          Every conference hoodie tucked away in a drawer, every faded sticker on an old laptop, every meme shared through a bull run or a bear market tells a small part of the story. On their own they are keepsakes. Together they become the history of a movement.
        </p>

        <p style={{ color: '#777', lineHeight: 1.8, marginBottom: '48px' }}>
          Merch&Memes is a community-driven archive of Web3 cultural history. Whether you created a protocol, organised a meetup, designed a sticker, or simply picked one up at a conference years ago, your contribution belongs here.
        </p>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: 'white', marginBottom: '24px' }}>
          Principles
        </h2>

        <p style={{ color: '#777', lineHeight: 1.8, marginBottom: '24px' }}>
          This archive is built on a defined set of principles:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '48px' }}>
          {principles.map((p) => (
            <div key={p.title} style={{ display: 'flex', gap: '10px', alignItems: 'baseline' }}>
              <span style={{ color: '#627EEA', flexShrink: 0 }}>&bull;</span>
              <p style={{ color: '#777', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>
                <strong style={{ color: 'white' }}>{p.title}:</strong> {p.text}
              </p>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: 'white', marginBottom: '24px' }}>
          How it works
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '48px' }}>
          {[
            { n: '1', title: 'Contribute', text: 'Submit an artefact, a photo of your merch, a meme, a POAP, a badge. Add the story behind it.' },
            { n: '2', title: 'Review', text: 'Every submission is reviewed before publication to keep the archive authentic and on-topic.' },
            { n: '3', title: 'Preserve', text: 'Approved artefacts are stored on IPFS, a decentralised network designed for long-term preservation.' },
            { n: '4', title: 'Discover', text: 'Browse, search, react, and comment. The archive grows with every contribution.' },
          ].map((step) => (
            <div key={step.n} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #627EEA, #DC1FFF)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.9rem', fontWeight: 700, color: 'white',
              }}>{step.n}</div>
              <div>
                <p style={{ fontWeight: 700, color: 'white', marginBottom: '4px' }}>{step.title}</p>
                <p style={{ color: '#777', lineHeight: 1.7, fontSize: '0.95rem' }}>{step.text}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: 'white', marginBottom: '16px' }}>
          Open by design
        </h2>

        <p style={{ color: '#777', lineHeight: 1.8, marginBottom: '12px' }}>
          Merch&Memes is open source. The archive&apos;s domain identity is ENS-native: it is reachable at{' '}
          <span style={{ fontWeight: 600, color: '#F5F5F5' }}>merchandmemes.eth</span> through any ENS-compatible browser or gateway, including{' '}
          <a href="https://merchandmemes.eth.limo" style={{ color: '#627EEA' }}>merchandmemes.eth.limo</a>.
        </p>

        <p style={{ color: '#777', lineHeight: 1.8, marginBottom: '12px' }}>
          Decentralisation is applied where it is currently practical, consistent with the principle above, rather than uniformly across every layer of the platform:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px', paddingLeft: '4px' }}>
          <p style={{ color: '#777', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>
            <strong style={{ color: 'white' }}>Artefact images</strong> are stored on IPFS, a decentralised, content-addressed network, via Filebase.
          </p>
          <p style={{ color: '#777', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>
            <strong style={{ color: 'white' }}>Domain identity</strong> is decentralised via ENS.
          </p>
          <p style={{ color: '#777', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>
            <strong style={{ color: 'white' }}>The application itself</strong>, the website, submission and moderation workflow, search, reactions, and comments, currently runs on conventional, centrally-hosted infrastructure (Vercel and Supabase).
          </p>
        </div>

        <p style={{ color: '#777', lineHeight: 1.8, marginBottom: '12px' }}>
          This reflects the current build stage, not a ceiling. Decentralising a domain name and static content is well-supported and low-risk to build on today. Decentralising the interactive parts of an application, the database, moderation, search, and real-time features, requires a substantially different architecture: on-chain announcements, peer-to-peer storage networks such as Swarm, and independently operated indexing or curation services. This was evaluated and set aside for the initial build as disproportionate to what a solo-maintained MVP can sustain, not because it conflicts with the project&apos;s principles.
        </p>

        <p style={{ color: '#777', lineHeight: 1.8, marginBottom: '48px' }}>
          Merchandise artefacts are published under <strong style={{ color: '#00FFA3' }}>CC0</strong>, no rights reserved. Memes, photography, and creative works are published under <strong style={{ color: '#627EEA' }}>CC BY 4.0</strong>, free to share with attribution.
        </p>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: 'white', marginBottom: '16px' }}>
          Memes, coming soon
        </h2>

        <p style={{ color: '#777', lineHeight: 1.8, marginBottom: '48px' }}>
          From &ldquo;This is fine&rdquo; during the 2018 bear market to the Terra collapse meme series of May 2022, community humour is how Web3 processed every cycle. The meme archive is being built with the community, submit yours and help shape what it becomes.
        </p>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: 'white', marginBottom: '16px' }}>
          This is just the beginning
        </h2>

        <p style={{ color: '#777', lineHeight: 1.8, marginBottom: '20px' }}>
          The archive you see today is a starting point, not a finished product. It will grow with every contribution, every reaction, every piece of feedback from the community that uses it.
        </p>

        <p style={{ color: '#777', lineHeight: 1.8, marginBottom: '20px' }}>
          There is a roadmap. It includes community governance, a full meme archive, event tagging, contributor profiles, and evaluation of further decentralisation of the application&apos;s data and interactive layers, for example, moving discovery, moderation, or storage onto peer-to-peer networks such as Swarm, following patterns already demonstrated by other decentralised applications. Whether and when that step is taken depends on community interest and available contributor capacity. If this direction interests you, use the feedback button on any page.
        </p>

        <p style={{ color: '#777', lineHeight: 1.8, marginBottom: '48px' }}>
          What will not change: the archive&apos;s content and domain identity will remain decentralised and permanent by design (IPFS, ENS), access will remain free, and the platform will remain privacy-respecting and community-owned. No ads, no paywalls, no data harvesting.
        </p>

        <div style={{ borderTop: '1px solid #2A2A2A', paddingTop: '32px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/submit" style={{
            padding: '12px 24px', borderRadius: '12px', fontWeight: 700, textDecoration: 'none',
            background: 'linear-gradient(135deg, #627EEA, #DC1FFF)', color: 'white', fontSize: '0.95rem',
          }}>Contribute an artefact</Link>
          <Link href="/browse" style={{
            padding: '12px 24px', borderRadius: '12px', fontWeight: 600, textDecoration: 'none',
            border: '1px solid #2A2A2A', color: '#F5F5F5', fontSize: '0.95rem',
          }}>Browse the archive</Link>
        </div>

      </div>
    </main>
  )
}