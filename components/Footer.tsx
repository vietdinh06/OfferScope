'use client'

function Footer() {
    return (
        <footer className="mt-auto border-t border-slate-200 bg-white/70 px-6 py-8">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
                <div>
                    <p className="font-bold text-slate-900">Offer<span className="text-indigo-600">Scope</span></p>
                    <p className="mt-1 text-sm text-slate-500">Clarity for your next career move.</p>
                </div>
                <p className="text-xs text-slate-500">Informational summaries only. Not financial or legal advice.</p>
            </div>
        </footer>
    )
}

export default Footer;