'use client'
import { useState } from 'react'
import NavBar from './Navbar'
import Footer from './Footer'

type OfferHistoryItem = {
  company?: string | null
  job_title?: string | null
  pay?: string | null
  location?: string | null
  start_date?: string | null
  end_date?: string | null
  offer_deadline?: string | null
  type_of_employment?: string | null
}

const defaultOffers: OfferHistoryItem[] = [
  {
    company: 'Example Labs',
    job_title: 'Software Engineer',
    pay: '$150000',
    location: 'New York, NY, USA',
    start_date: '2026-01-15',
    end_date: '',
    offer_deadline: '2026-01-10',
    type_of_employment: 'hybrid',
  },
]

function History() {
    const [offers] = useState<OfferHistoryItem[]>(() => {
        if (typeof window === 'undefined') {
            return defaultOffers
        }

        try {
            const saved = JSON.parse(window.localStorage.getItem('offerscope-offers') ?? '[]') as OfferHistoryItem[]
            return Array.isArray(saved) && saved.length > 0 ? saved : defaultOffers
        } catch {
            return defaultOffers
        }
    })

    return (
        <main className="min-h-screen flex flex-col bg-slate-50">
            <NavBar />
            <section className="max-w-6xl mx-auto w-full px-6 py-12 flex-1">
                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7B68EE]">Saved offers</p>
                    <h1 className="mt-3 text-4xl font-bold text-slate-900">Offer history</h1>
                </div>

                {offers.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
                        No offers saved yet. Upload a PDF from the parse page to begin tracking your opportunities.
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {offers.map((offer, index) => (
                            <article key={`${offer.company ?? 'offer'}-${index}`} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                <div className="mb-4 flex items-center justify-between gap-4">
                                    <h2 className="text-xl font-semibold text-slate-900">{offer.company || 'Unknown company'}</h2>
                                    <span className="rounded-full bg-[#EFEAFF] px-3 py-1 text-xs font-medium text-[#7B68EE] uppercase tracking-wide">
                                        {offer.type_of_employment || 'Not specified'}
                                    </span>
                                </div>

                                <dl className="space-y-3 text-sm text-slate-600">
                                    <div><dt className="font-medium text-slate-500">Role</dt><dd>{offer.job_title || 'Not provided'}</dd></div>
                                    <div><dt className="font-medium text-slate-500">Pay</dt><dd>{offer.pay || 'Not provided'}</dd></div>
                                    <div><dt className="font-medium text-slate-500">Location</dt><dd>{offer.location || 'Not provided'}</dd></div>
                                    <div><dt className="font-medium text-slate-500">Start date</dt><dd>{offer.start_date || 'Not provided'}</dd></div>
                                    <div><dt className="font-medium text-slate-500">Offer deadline</dt><dd>{offer.offer_deadline || 'Not provided'}</dd></div>
                                </dl>
                            </article>
                        ))}
                    </div>
                )}
            </section>
            <Footer />
        </main>
    )
}

export default History;