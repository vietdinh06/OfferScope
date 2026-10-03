'use server'
import { createClient } from '@/lib/supabase/server'

export async function forgot(formData: FormData) {
  const supabase = await createClient()

  if (!supabase) {
    throw new Error('Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY to continue.')
  }

  await supabase.auth.resetPasswordForEmail(formData.get('email') as string, {
    redirectTo: 'http://localhost:3000/change-password',
  })
}