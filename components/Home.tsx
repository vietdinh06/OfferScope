'use client'

import Navbar from './Navbar'
import Footer from './Footer'
function Home() {
    return (
        <main className="app-shell flex flex-col">
            <div className="flex-1">
                <Navbar/>

                <section className="relative overflow-hidden">
                    <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-[1.1fr_.9fr] lg:py-32">
                        <div className="fade-up">
                            <p className="eyebrow">Your next move, made clearer</p>
                            <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[1.02] tracking-tight text-slate-950 sm:text-7xl">
                                Make your offer letter work
                                <span className="block bg-gradient-to-r from-indigo-600 via-violet-600 to-teal-500 bg-clip-text text-transparent">for you.</span>
                            </h1>
                            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                                Turn dense offer letters into a clear, side-by-side view of the details that matter before you decide.
                            </p>
                            <div className="mt-9 flex flex-wrap gap-3">
                                <a href="/parse" className="button-primary">Analyze an offer <span aria-hidden="true">→</span></a>
                                <a href="#about" className="button-secondary">See how it works</a>
                            </div>
                            <div className="mt-8 flex flex-wrap gap-5 text-sm text-slate-500">
                                <span>✓ Structured extraction</span>
                                <span>✓ Private by design</span>
                                <span>✓ Built for decisions</span>
                            </div>
                        </div>
                        <div className="relative hidden min-h-[390px] lg:block">
                            <div className="float absolute right-8 top-4 h-72 w-72 rounded-full bg-indigo-200/50 blur-3xl" />
                            <div className="surface relative mx-auto mt-8 max-w-sm rotate-2 p-6">
                                <div className="flex items-center justify-between">
                                    <span className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-600">OFFER SNAPSHOT</span>
                                    <span className="text-sm text-teal-600">● Ready</span>
                                </div>
                                <p className="mt-8 text-sm font-medium text-slate-500">Software Engineer · Example Labs</p>
                                <p className="mt-2 text-4xl font-black text-slate-950">$150k</p>
                                <div className="mt-8 space-y-3">
                                    <div className="h-3 rounded-full bg-slate-100"><div className="h-3 w-4/5 rounded-full bg-indigo-500" /></div>
                                    <div className="h-3 rounded-full bg-slate-100"><div className="h-3 w-3/5 rounded-full bg-teal-400" /></div>
                                    <div className="h-3 rounded-full bg-slate-100"><div className="h-3 w-2/3 rounded-full bg-violet-400" /></div>
                                </div>
                                <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                                    <span>Hybrid · New York</span><span className="font-bold text-indigo-600">Compare →</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-6 py-14">
                    <div className="surface grid gap-6 p-8 sm:grid-cols-3 sm:p-10">
                        {[
                            ['01', 'Upload', 'Drop in one or two offer PDFs.'],
                            ['02', 'Understand', 'We organize the details for you.'],
                            ['03', 'Compare', 'Make the next step with confidence.'],
                        ].map(([number, title, description]) => (
                            <div key={number} className="group rounded-2xl p-4 transition hover:bg-indigo-50/70">
                                <span className="text-sm font-black text-indigo-600">{number}</span>
                                <h3 className="mt-5 text-xl font-bold text-slate-900">{title}</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
                            </div>
                        ))}
                        </div>
                </section>

                <section className="mx-auto max-w-7xl px-6 pb-24 pt-10" id="about">
                    <div className="max-w-2xl">
                        <p className="eyebrow">Built for clarity</p>
                        <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950">Less fine print. More confidence.</h2>
                        <p className="mt-5 text-lg leading-8 text-slate-600">OfferScope turns complex employment documents into structured insights so you can spend less time hunting for details and more time thinking about the life you want to build.</p>
                    </div>
                </section>
            </div>
            <Footer/>
        </main>
    )
}

export default Home