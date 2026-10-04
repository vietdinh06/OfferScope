'use client'
import {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { parseAdd, docAdd } from '../app/parse/actions'

type pdfWithPreview = File & { preview: string };
type ParsedOffer = Record<string, string | null | undefined>;

function MyDropzone() {
    const [files, setFiles] = useState<pdfWithPreview[]>([]);
    const [result, setResult] = useState<ParsedOffer[] | string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const OFFER_FIELDS = [
        { key: "company", label: "Company" },
        { key: "job_title", label: "Job Title" },
        { key: "pay", label: "Pay" },
        { key: "location", label: "Location" },
        { key: "start_date", label: "Start Date" },
        { key: "end_date", label: "End Date" },
        { key: "offer_deadline", label: "Offer Deadline" },
        { key: "type_of_employment", label: "Work Type" }
    ]

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const pdfs = (acceptedFiles || []).filter(file =>
            file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
        );
        if (pdfs.length) {
            setFiles(prev => [
                ...prev,
                ...pdfs.map(file =>
                    Object.assign(file, {preview: URL.createObjectURL(file)})
                )
            ]);
        }
    }, [])
    
    const {getRootProps, getInputProps, isDragActive, fileRejections} = useDropzone({
        onDrop,
        accept: {'application/pdf': ['.pdf']},
        maxFiles: 2,
        multiple: true
    })

    const rejectionMessage = fileRejections.length > 0
        ? 'Only PDF files are accepted, with a maximum of two files.'
        : null

    const removeFile = (name: string) => {
        setFiles(prev => {
            const removed = prev.filter(file => file.name === name)
            removed.forEach(f => URL.revokeObjectURL(f.preview))
            return prev.filter(file => file.name !== name)
            }
        )
    }

    const parsePdf = async (files: pdfWithPreview[]) => {
        setIsProcessing(true)
        setError(null)
        try {
            const documentResult = await docAdd(files)
            const formData = new FormData();
            files.forEach(file => formData.append('files', file));
            documentResult.jobs.forEach((job) => formData.append('jobIds', job.id))

            const res = await fetch('/api/parse', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error ?? 'Failed to parse document')
            }

            const parsedOffers = Array.isArray(data.offers) ? (data.offers as ParsedOffer[]) : []
            setResult(parsedOffers)

            await parseAdd(parsedOffers)
        } catch (err) {
            const message = err instanceof Error ? err.message : 'We could not process this offer.'
            setError(message.replace(/^Error:\s*/i, ''))
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <form>
            {(error || rejectionMessage) && (
                <div role="alert" className="mx-auto mb-5 flex w-3/4 items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-left text-red-800">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold">!</span>
                    <div><p className="font-bold">{error ? "We couldn't process that offer" : 'That file could not be added'}</p><p className="mt-1 text-sm text-red-700">{error ?? rejectionMessage}</p></div>
                </div>
            )}

            <div {...getRootProps(
                {
                    className:"mx-auto w-3/4 cursor-pointer rounded-3xl border-2 border-dashed border-indigo-300 bg-white/80 p-14 text-center shadow-sm transition hover:border-indigo-500 hover:bg-indigo-50/50"
                }
            )}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                    <p className="text-xl font-bold text-indigo-600">Drop your PDFs here</p> :
                    <><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600">↑</div><p className="mt-5 text-xl font-bold text-slate-900">Drop offer letters here</p><p className="mt-2 text-sm text-slate-500">or click to browse · PDF only · up to 2 files</p></>
                }
            </div>

            <section className="mx-auto mb-5 mt-8 w-3/4 rounded-3xl border border-slate-200 bg-white/70 p-5 text-center shadow-sm">

                {files.length < 1 && (
                    <p className="py-6 text-slate-500">No offers selected yet. Upload a PDF to get started.</p>
                )}

                <div className={`grid gap-4 ${files.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {files.map(file => (
                        <div key={file.name} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left">
                            <p className="truncate pr-3 text-sm font-semibold text-slate-700">{file.name}</p>
                            <button type="button" onClick={() => removeFile(file.name)} className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-500 transition hover:bg-red-50 hover:text-red-600">
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {files.length >= 1 && (
                <button 
                className="button-primary mt-5 disabled:cursor-not-allowed disabled:opacity-60"
                type = "button" onClick={() => parsePdf(files)} disabled={isProcessing}>
                    {isProcessing ? <><span className="spinner" /> Extracting and analyzing...</> : 'Analyze selected offers'}
                </button>
            )}

            <section>
                {result && Array.isArray(result) && (
                    <div className={`mx-auto mb-5 mt-10 grid w-3/4 gap-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl ${result.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                        {result.map((offer, index) => (
                            <div key={index} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-4 border-b border-slate-100 pb-3 text-xl font-bold text-slate-900">Offer {index + 1}</h3>
                                <div className="space-y-3">
                                    {OFFER_FIELDS.map(({ key, label }) => {
                                        const value = offer[key]
                                        if (!value) return null
                                        return (
                                            <div key={key} className="flex flex-col">
                                                <span className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</span>
                                                <span className="mt-1 rounded-lg bg-slate-50 p-2 text-base text-slate-800">{value}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </form>
    )
}

export default MyDropzone