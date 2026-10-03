'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <main className="app-shell flex min-h-screen items-center justify-center px-6">
            <div className="surface max-w-lg p-10 text-center">
                <p className="eyebrow text-red-600">Unexpected error</p>
                <h1 className="mt-4 text-4xl font-black text-slate-950">That didn&apos;t go as planned.</h1>
                <p className="mt-4 leading-7 text-slate-500">OfferScope hit a problem while loading this page. Your work is safe. You can try the page again or return home.</p>
                <div className="mt-8 flex justify-center gap-3">
                    <button onClick={() => reset()} className="button-primary">Try again</button>
                    <a href="/home" className="button-secondary">Back to home</a>
                </div>
            </div>
        </main>
    )
}
