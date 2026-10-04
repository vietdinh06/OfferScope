'use server'

import { createClient } from '@/lib/supabase/server'

export type SavedOffer = {
  id: string
  company: string | null
  job_title: string | null
  pay: string | null
  location: string | null
  start_date: string | null
  end_date: string | null
  offer_deadline: string | null
  type_of_employment: string | null
  created_at?: string | null
}

export async function getSavedOffers(): Promise<SavedOffer[]> {
  const supabase = await createClient()

  if (!supabase) {
    throw new Error('Supabase is not configured.')
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('extractions')
    .select('id, company, job_title, pay, location, start_date, end_date, offer_deadline, type_of_employment, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Unable to load saved offers: ${error.message}`)
  }

  return (data ?? []) as SavedOffer[]
}

export async function saveComparison(
  offerIds: string[],
  preferences: Record<string, number>,
  scoreBreakdown: Record<string, unknown>,
) {
  const supabase = await createClient()

  if (!supabase) {
    throw new Error('Supabase is not configured.')
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('You must be signed in to save a comparison.')
  }

  const { error } = await supabase.from('offer_comparisons').insert({
    user_id: user.id,
    offer_ids: offerIds,
    preferences,
    score_breakdown: scoreBreakdown,
  })

  if (error) {
    throw new Error(`Unable to save comparison: ${error.message}`)
  }

  return { success: true }
}
