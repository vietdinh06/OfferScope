'use client'

import { useMemo, useState } from 'react'
import { saveComparison, type SavedOffer } from '@/app/history/actions'
import NavBar from './Navbar'
import Footer from './Footer'

type Preferences = {
  compensation: number
  remote: number
  timing: number
}

const defaultPreferences: Preferences = {
  compensation: 5,
  remote: 3,
  timing: 2,
}

function numericPay(pay: string | null) {
  if (!pay) return 0
  const amount = Number(pay.replace(/[^0-9.]/g, ''))
  return Number.isFinite(amount) ? amount : 0
}

function scoreOffer(offer: SavedOffer, offers: SavedOffer[], preferences: Preferences) {
  const payValues = offers.map((item) => numericPay(item.pay))
  const maxPay = Math.max(...payValues, 1)
  const payScore = numericPay(offer.pay) / maxPay
  const remoteScore = offer.type_of_employment === 'remote' ? 1 : 0
  const timingScore = offer.offer_deadline ? 1 : 0
  const total = (payScore * preferences.compensation) + (remoteScore * preferences.remote) + (timingScore * preferences.timing)

  return {
    total: Math.round(total * 10) / 10,
    pay: Math.round(payScore * 100),
    remote: Math.round(remoteScore * 100),
    timing: Math.round(timingScore * 100),
  }
}

function History({ initialOffers }: { initialOffers: SavedOffer[] }) {
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [preferences, setPreferences] = useState<Preferences>(defaultPreferences)
    const [saveMessage, setSaveMessage] = useState<string | null>(null)
    const selectedOffers = useMemo(() => initialOffers.filter((offer) => selectedIds.includes(offer.id)), [initialOffers, selectedIds])
    const scores = useMemo(() => selectedOffers.map((offer) => ({ offer, score: scoreOffer(offer, initialOffers, preferences) })).sort((a, b) => b.score.total - a.score.total), [initialOffers, preferences, selectedOffers])

    const toggleOffer = (id: string) => {
        setSaveMessage(null)
        setSelectedIds((current) => current.includes(id)
            ? current.filter((selectedId) => selectedId !== id)
            : current.length < 2 ? [...current, id] : current)
    }

    const handleSave = async () => {
        if (selectedOffers.length !== 2) return
        try {
            await saveComparison(selectedIds, preferences, Object.fromEntries(scores.map(({ offer, score }) => [offer.id, score])))
            setSaveMessage('Comparison saved to your account.')
        } catch (error) {
            setSaveMessage(error instanceof Error ? error.message : 'We could not save this comparison.')
        }
    }

    return (
        <main className="app-shell flex flex-col">
            <NavBar />
            <section className="mx-auto w-full max-w-7xl flex-1 px-6 py-12">
                <div className="mb-10">
                    <p className="eyebrow">Your decision workspace</p>
                    <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Offer history</h1>
                    <p className="mt-3 max-w-2xl text-slate-500">Select up to two offers to see a transparent comparison based on the priorities you choose.</p>
                </div>

                {initialOffers.length === 0 ? (
                    <div className="surface p-10 text-center">
                        <h2 className="text-xl font-bold text-slate-900">No saved offers yet</h2>
                        <p className="mt-2 text-slate-500">Upload an offer letter to start building your decision workspace.</p>
                        <a href="/parse" className="button-primary mt-6">Analyze an offer</a>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-5 md:grid-cols-2">
                            {initialOffers.map((offer) => {
                                const selected = selectedIds.includes(offer.id)
                                return (
                                    <button key={offer.id} type="button" onClick={() => toggleOffer(offer.id)} className={`surface p-6 text-left transition hover:-translate-y-1 hover:shadow-2xl ${selected ? 'border-indigo-500 ring-4 ring-indigo-100' : ''}`}>
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-xl font-bold text-slate-950">{offer.company || 'Unknown company'}</p>
                                                <p className="mt-1 text-sm text-slate-500">{offer.job_title || 'Role not provided'}</p>
                                            </div>
                                            <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${selected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{selected ? 'Selected' : 'Compare'}</span>
                                        </div>
                                        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                                            <div><p className="text-xs font-bold uppercase tracking-wide text-slate-400">Pay</p><p className="mt-1 font-bold text-slate-800">{offer.pay || 'Not provided'}</p></div>
                                            <div><p className="text-xs font-bold uppercase tracking-wide text-slate-400">Work type</p><p className="mt-1 font-bold text-slate-800">{offer.type_of_employment || 'Not provided'}</p></div>
                                            <div><p className="text-xs font-bold uppercase tracking-wide text-slate-400">Location</p><p className="mt-1 font-bold text-slate-800">{offer.location || 'Not provided'}</p></div>
                                            <div><p className="text-xs font-bold uppercase tracking-wide text-slate-400">Start</p><p className="mt-1 font-bold text-slate-800">{offer.start_date || 'Not provided'}</p></div>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>

                        <div className="surface mt-8 p-6">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <p className="eyebrow">Preference weights</p>
                                    <h2 className="mt-2 text-2xl font-black text-slate-950">What matters most?</h2>
                                </div>
                                <span className="text-sm text-slate-500">{selectedOffers.length}/2 offers selected</span>
                            </div>
                            <div className="mt-6 grid gap-5 md:grid-cols-3">
                                {([
                                    ['compensation', 'Compensation'],
                                    ['remote', 'Remote work'],
                                    ['timing', 'Timing'],
                                ] as const).map(([key, label]) => (
                                    <label key={key} className="text-sm font-semibold text-slate-700">
                                        <span className="flex justify-between"><span>{label}</span><span className="text-indigo-600">{preferences[key]}/5</span></span>
                                        <input type="range" min="0" max="5" value={preferences[key]} onChange={(event) => setPreferences({ ...preferences, [key]: Number(event.target.value) })} className="mt-3 w-full accent-indigo-600" />
                                    </label>
                                ))}
                            </div>
                        </div>

                        {selectedOffers.length === 2 && (
                            <div className="surface mt-8 overflow-hidden p-6">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div><p className="eyebrow">Transparent recommendation</p><h2 className="mt-2 text-2xl font-black text-slate-950">Your comparison</h2></div>
                                    <button type="button" onClick={handleSave} className="button-primary">Save comparison</button>
                                </div>
                                {saveMessage && <p className="mt-4 rounded-xl bg-indigo-50 p-3 text-sm font-semibold text-indigo-700">{saveMessage}</p>}
                                <div className="mt-6 grid gap-4 md:grid-cols-2">
                                    {scores.map(({ offer, score }, index) => (
                                        <div key={offer.id} className={`rounded-2xl border p-5 ${index === 0 ? 'border-teal-300 bg-teal-50/60' : 'border-slate-200 bg-slate-50'}`}>
                                            <div className="flex items-center justify-between gap-3"><h3 className="font-bold text-slate-900">{offer.company || 'Unknown company'}</h3>{index === 0 && <span className="text-xs font-bold uppercase text-teal-700">Best match</span>}</div>
                                            <p className="mt-3 text-4xl font-black text-slate-950">{score.total}<span className="text-base text-slate-400"> pts</span></p>
                                            <div className="mt-5 space-y-2 text-sm text-slate-600"><p className="flex justify-between"><span>Compensation fit</span><b>{score.pay}%</b></p><p className="flex justify-between"><span>Remote fit</span><b>{score.remote}%</b></p><p className="flex justify-between"><span>Timing fit</span><b>{score.timing}%</b></p></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </section>
            <Footer />
        </main>
    )
}

export default History
