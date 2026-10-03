'use client'

export default function GlobalError({ reset }: { error: Error & { digest?: string }, reset: () => void }) {
    return (
        <html lang="en">
            <body>
                <main className="app-shell flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
                    <div className="max-w-lg text-center">
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-teal-300">OfferScope</p>
                        <h1 className="mt-5 text-4xl font-black">We&apos;re having trouble loading the app.</h1>
                        <p className="mt-4 leading-7 text-slate-300">Please try again. If the problem continues, come back in a few minutes.</p>
                        <button onClick={() => reset()} className="mt-8 rounded-xl bg-white px-5 py-3 font-bold text-slate-900 transition hover:bg-teal-100">Reload OfferScope</button>
                    </div>
                </main>
            </body>
        </html>
    )
}
