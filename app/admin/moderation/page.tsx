import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import ModerationActions from './ModerationActions'

export const dynamic = 'force-dynamic'

export default async function ModerationPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: submissions } = await supabase
    .from('submissions')
    .select(`
      id,
      status,
      submitted_at,
      staging_path,
      artefacts(
        id,
        title,
        description,
        year_approx,
        licence_type,
        categories(name),
        stories(content)
      )
    `)
    .eq('status', 'pending')
    .order('submitted_at', { ascending: true })

  // Generate signed URLs for each submission image
  const submissionsWithUrls = await Promise.all(
    (submissions || []).map(async (submission) => {
      let signedUrl = null
      if (submission.staging_path) {
        const { data } = await supabase.storage
          .from('staging')
          .createSignedUrl(submission.staging_path, 3600)
        signedUrl = data?.signedUrl || null
      }
      return { ...submission, signedUrl }
    })
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">M&M</span>
          </div>
          <span className="font-semibold text-gray-900">Merch&Memes</span>
          <span className="text-gray-400 text-sm">moderation</span>
        </Link>
        <Link href="/browse" className="text-sm text-gray-600 hover:text-gray-900">Back to site</Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-black text-gray-900">Moderation queue</h1>
          <span className="bg-gray-900 text-white text-sm px-3 py-1 rounded-full">
            {submissionsWithUrls.length} pending
          </span>
        </div>

        {submissionsWithUrls.length > 0 ? (
          <div className="space-y-6">
            {submissionsWithUrls.map((submission) => {
              const artefact = submission.artefacts as any
              const story = artefact?.stories?.[0]?.content

              return (
                <div key={submission.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="flex gap-6 p-6">
                    {/* Image */}
                    <div className="w-48 h-48 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      {submission.signedUrl ? (
                        <img
                          src={submission.signedUrl}
                          alt={artefact?.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">🏷️</div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h2 className="font-bold text-gray-900 text-lg">{artefact?.title}</h2>
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded ml-4">
                          {artefact?.licence_type === 'CC0' ? 'CC0' : 'CC BY 4.0'}
                        </span>
                      </div>

                      <div className="text-xs text-gray-400 mb-3">
                        {(artefact?.categories as any)?.name} · {artefact?.year_approx || 'Year unknown'} · Submitted {new Date(submission.submitted_at).toLocaleDateString()}
                      </div>

                      {artefact?.description && (
                        <p className="text-sm text-gray-600 mb-3">{artefact.description}</p>
                      )}

                      {story && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <p className="text-xs text-gray-500 font-medium mb-1">Contributor story</p>
                          <p className="text-sm text-gray-700">{story}</p>
                        </div>
                      )}

                      <ModerationActions submissionId={submission.id} artefactId={artefact?.id} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Queue is empty</h3>
            <p className="text-gray-500 text-sm">No pending submissions to review.</p>
          </div>
        )}
      </div>
    </main>
  )
}