export default function Loading() {
  return (
    <main className="app-shell flex min-h-screen items-center justify-center px-6">
      <div className="surface flex items-center gap-4 px-6 py-5">
        <span className="spinner !border-indigo-200 !border-t-indigo-600" />
        <p className="font-semibold text-slate-700">Loading OfferScope…</p>
      </div>
    </main>
  )
}
