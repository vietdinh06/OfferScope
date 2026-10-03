'use server'
import { createClient } from '@/lib/supabase/server'

export async function change(formData: FormData) {
  const supabase = await createClient()

  if (!supabase) {
    throw new Error('Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY to continue.')
  }

  await supabase.auth.updateUser({ password: formData.get('password') as string })
}