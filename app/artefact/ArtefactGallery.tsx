'use client'

import { useState } from 'react'

export default function ArtefactGallery({
  images,
  title,
}: {
  images: { ipfs_cid: string }[]
  title: string
}) {
  const [selected, setSelected] = useState(0)
  const current = images[selected]

  return (
    <div style={{
      background: 'white',
      padding: '16px 16px 56px 16px',
      borderRadius: '4px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
      transform: 'rotate(-1deg)',
    }}>
      <div style={{ aspectRatio: '1', overflow: 'hidden', background: '#f0f0f0' }}>
        {current?.ipfs_cid ? (
          <img
            src={`https://ipfs.filebase.io/ipfs/${current.ipfs_cid}`}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>🏷️</div>
        )}
      </div>

      {images.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              aria-label={`View image ${i + 1} of ${images.length}`}
              style={{
                width: '48px', height: '48px', padding: 0, cursor: 'pointer',
                border: i === selected ? '2px solid #627EEA' : '1px solid #ddd',
                borderRadius: '4px', overflow: 'hidden', background: '#f0f0f0',
              }}
            >
              {img.ipfs_cid && (
                <img
                  src={`https://ipfs.filebase.io/ipfs/${img.ipfs_cid}`}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      <p style={{ textAlign: 'center', marginTop: '16px', color: '#333', fontSize: '0.85rem', fontFamily: 'Space Grotesk, sans-serif' }}>
        {title}
      </p>
    </div>
  )
}