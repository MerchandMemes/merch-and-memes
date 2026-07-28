import CommentActions from './CommentActions'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import ModerationActions from './ModerationActions'

export const dynamic = 'force-dynamic'

export default async function ModerationPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Fetch pending submissions
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

  // Fetch flagged comments
  const { data: flaggedComments } = await supabase
    .from('comments')
    .select(`
      id,
      display_name,
      content,
      created_at,
      flag_count,
      artefact_id,
      artefacts(title)
    `)
    .gte('flag_count', 1)
    .eq('is_visible', true)
    .order('flag_count', { ascending: false })

  // Generate signed URLs
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
    <main className="min-h-screen bg-[#0D0D0D]">
      {/*
        NOTE: This nav is written inline to match the screenshot (logo, wordmark,
        nav links, gradient pill). If you have a shared Header/Nav component used
        on /browse, /about etc., swap this block for <Header /> instead so nav
        changes stay in one place.
      */}
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center">
            <img src="/logo_nofold.png" alt="Merch&Memes" className="w-full h-full object-contain" />
          </div>
          <span className="font-['Space_Grotesk'] font-bold text-white">Merch&Memes</span>
          <span className="text-white/40 text-sm">moderation</span>
        </Link>
        <Link href="/browse" className="text-sm text-white/60 hover:text-white transition-colors">
          Back to site
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Submissions queue */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-['Space_Grotesk'] text-2xl font-black text-white">
            Submission queue
          </h1>
          <span className="bg-gradient-to-r from-[#627EEA] to-[#DC1FFF] text-white text-sm font-medium px-3 py-1 rounded-full">
            {submissionsWithUrls.length} pending
          </span>
        </div>

        {submissionsWithUrls.length > 0 ? (
          <div className="space-y-6 mb-12">
            {submissionsWithUrls.map((submission) => {
              const artefact = submission.artefacts as any
              const story = artefact?.stories?.[0]?.content

              return (
                <div
                  key={submission.id}
                  className="bg-white rounded-xl overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
                >
                  <div className="flex gap-6 p-6">
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
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h2 className="font-bold text-gray-900 text-lg">{artefact?.title}</h2>
                        <span className="text-xs bg-[#00FFA3]/10 text-[#00B37A] px-2 py-1 rounded ml-4 font-medium">
                          {artefact?.licence_type === 'CC0' ? 'CC0' : 'CC BY 4.0'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mb-3">
                        {(artefact?.categories as any)?.name} · {artefact?.year_approx || 'Year unknown'} · Submitted{' '}
                        {new Date(submission.submitted_at).toLocaleDateString()}
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
          <div className="text-center py-16 mb-12 bg-white/5 rounded-xl border border-white/10">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-lg font-medium text-white mb-2">Queue is empty</h3>
            <p className="text-white/50 text-sm">No pending submissions to review.</p>
          </div>
        )}

        {/* Flagged comments */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-['Space_Grotesk'] text-2xl font-black text-white">
            Flagged comments
          </h2>
          <span className="bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-full">
            {flaggedComments?.length || 0} flagged
          </span>
        </div>

        {flaggedComments && flaggedComments.length > 0 ? (
          <div className="space-y-4">
            {flaggedComments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white rounded-xl p-5 shadow-[0_0_0_1px_rgba(239,68,68,0.35)]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {comment.display_name || 'Anonymous'}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">
                      on{' '}
                      <Link
                        href={`/artefact/${comment.artefact_id}`}
                        className="underline hover:text-gray-700"
                      >
                        {(comment.artefacts as any)?.title}
                      </Link>
                    </span>
                  </div>
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                    {comment.flag_count} flag{comment.flag_count !== 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-4">{comment.content}</p>
                <CommentActions commentId={comment.id} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg font-medium text-white mb-2">No flagged comments</h3>
            <p className="text-white/50 text-sm">All comments are clean.</p>
          </div>
        )}

      </div>
    </main>
  )
}