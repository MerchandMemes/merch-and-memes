import Link from 'next/link'

export default function NotFound() {
  return (
    <main style={{
      background: '#0D0D0D',
      color: '#F5F5F5',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '48px' }}>
        <img src="/logo_nofold.webp" alt="Merch&Memes" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
        <span style={{ fontWeight: 700, color: 'white', fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem' }}>Merch&Memes</span>
      </Link>

      <p style={{
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: 'clamp(3rem, 12vw, 7rem)',
        fontWeight: 700,
        lineHeight: 1,
        background: 'linear-gradient(135deg, #627EEA, #DC1FFF, #00FFA3)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '16px',
      }}>
        404
      </p>

      <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'white', marginBottom: '12px' }}>
        Nothing archived at this address
      </h1>
      <p style={{ color: '#888', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '440px', marginBottom: '32px' }}>
        The artefact may have been removed, or the link may be mistyped. The archive itself is
        still there.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/browse" style={{
          padding: '14px 28px', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 700,
          background: 'linear-gradient(135deg, #00FFA3, #627EEA)', color: 'white', textDecoration: 'none',
        }}>
          Explore the archive →
        </Link>
        <Link href="/submit" style={{
          padding: '14px 28px', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 700,
          border: '1px solid #2A2A2A', color: '#A78BFA', background: 'rgba(255,255,255,0.05)', textDecoration: 'none',
        }}>
          Contribute something
        </Link>
      </div>

      <p style={{ color: '#555', fontSize: '0.8rem', marginTop: '40px' }}>
        Looking up a submission? <Link href="/status" style={{ color: '#627CEA' }}>Check its status</Link>.
      </p>
    </main>
  )
}
