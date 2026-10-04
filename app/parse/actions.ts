'use server'

import { createClient } from '@/lib/supabase/server'

type Offer = {
  company?: string | null
  job_title?: string | null
  pay?: string | null
  location?: string | null
  start_date?: string | null
  end_date?: string | null
  offer_deadline?: string | null
  type_of_employment?: string | null
}


export async function parseAdd(offers: Offer[]) {
  const supabase = await createClient()

  if (!supabase) {
    throw new Error('Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY to continue.')
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not found');
  }

  const offer = offers.map((offer) => ({
    user_id: user.id,
    company: offer.company ?? null,
    job_title: offer.job_title ?? null,
    pay: offer.pay ?? null,
    location: offer.location ?? null,
    start_date: offer.start_date ?? null,
    end_date: offer.end_date ?? null,
    offer_deadline: offer.offer_deadline ?? null,
    type_of_employment: offer.type_of_employment ?? null,
  }))

  const { error } = await supabase
    .from('extractions')
    .insert(offer)

  if (error) {
    throw new Error(error.message)
  }

  return { success: true }
}

export async function docAdd(files: File[]) {
  const supabase = await createClient()

  if (!supabase) {
    throw new Error('Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY to continue.')
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not found');
  }

  const doc = files.map((doc) => ({
    user_id: user.id,
    file_name: doc.name,
    file_size: doc.size,
    status: 'processing',
  }))

  const { data, error } = await supabase
    .from('documents')
    .insert(doc)
    .select('id, file_name')

  if (error) {
    throw new Error(error.message)
  }

  const documents = data ?? []
  const jobs = await Promise.all(documents.map(async (document) => {
    const { data: job, error: jobError } = await supabase
      .from('processing_jobs')
      .insert({
        user_id: user.id,
        document_id: document.id,
        status: 'queued',
      })
      .select('id, document_id')
      .single()

    if (jobError) {
      throw new Error(`Unable to create processing job: ${jobError.message}`)
    }

    return job
  }))

  return { documents, jobs };
}
