import Link from 'next/link'

export default function ErrorPage() {
    return (
        <main className="app-shell flex min-h-screen items-center justify-center px-6">
            <div className="surface max-w-lg p-10 text-center">
                <p className="eyebrow">Something went wrong</p>
                <h1 className="mt-4 text-4xl font-black text-slate-950">We couldn&apos;t complete that request.</h1>
                <p className="mt-4 leading-7 text-slate-500">The link may have expired or the service is temporarily unavailable. Try again or return to the OfferScope home page.</p>
                <div className="mt-8 flex justify-center gap-3">
                    <Link href="/home" className="button-primary">Back to home</Link>
                    <Link href="/contact" className="button-secondary">Get help</Link>
                </div>
            </div>
        </main>
    )
}