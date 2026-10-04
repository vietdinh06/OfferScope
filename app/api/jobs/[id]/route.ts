import { createClient } from '@/lib/supabase/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient()
  if (!supabase) {
    return Response.json({ error: 'Supabase is not configured.' }, { status: 500 })
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return Response.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const { id } = await params
  const { data, error } = await supabase
    .from('processing_jobs')
    .select('id, status, attempt_count, error_message, started_at, completed_at, created_at')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) {
    return Response.json({ error: 'Processing job not found.' }, { status: 404 })
  }

  return Response.json({ job: data })
}
