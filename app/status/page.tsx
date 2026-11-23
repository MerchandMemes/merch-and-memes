import { Suspense } from 'react'
import StatusClient from './StatusClient'

export const metadata = {
  title: 'Submission status — Merch&Memes',
  alternates: { canonical: '/status' },
}

export default function StatusPage() {
  return (
    <Suspense fallback={null}>
      <StatusClient />
    </Suspense>
  )
}
