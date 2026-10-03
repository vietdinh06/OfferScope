'use client'
import {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { parseAdd, docAdd } from '../app/parse/actions'

type pdfWithPreview = File & { preview: string };
type ParsedOffer = Record<string, string | null | undefined>;

function MyDropzone() {
    const [files, setFiles] = useState<pdfWithPreview[]>([]);
    const [result, setResult] = useState<ParsedOffer[] | string | null>(null);

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
    
    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: {'application/pdf': ['.pdf']},
        maxFiles: 2,
        multiple: true
    })

    const removeFile = (name: string) => {
        setFiles(prev => {
            const removed = prev.filter(file => file.name === name)
            removed.forEach(f => URL.revokeObjectURL(f.preview))
            return prev.filter(file => file.name !== name)
            }
        )
    }

    const parsePdf = async (files: pdfWithPreview[]) => {
        try {
            await docAdd(files)
            const formData = new FormData();
            files.forEach(file => formData.append('files', file));

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

            const existing = JSON.parse(localStorage.getItem('offerscope-offers') ?? '[]') as ParsedOffer[]
            const next = [...existing, ...parsedOffers]
            localStorage.setItem('offerscope-offers', JSON.stringify(next))

            await parseAdd(parsedOffers)
        } catch (err) {
            setResult(String(err));
        }
    }

    return (
        <form>
            <div {...getRootProps(
                {
                    className:"border-3 rounded-xl border-dashed border-[#7E78D2] p-30 text-center bg-gradient-to-r from-[#B8B8FF] to-[#B7BBF5] w-3/4 mx-auto"
                }
            )}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                    <p>Drop the files here ...</p> :
                    <p className="text-2xl">Click or drag and drop to select files</p>
                }
            </div>

            <section className="bg-[#DEDFF8] mt-10 mb-5 rounded-xl p-5 w-3/4 mx-auto shadow-md pb-50 text-center">

                {files.length < 1 && (
                    <p className="text-gray-600">No offers uploaded yet. Upload your files and get started!</p>
                )}

                <div className={`grid gap-4 ${files.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {files.map(file => (
                        <div key={file.name} className="bg-[#E4E4FB] p-4 rounded-lg border-2 border-[#7E78D2] flex flex-col items-center">
                            <p>{file.name}</p>
                            <button type="button" onClick={() => removeFile(file.name)} className="mt-2 px-3 py-1 bg-[#E8D6F5] text-[#6B21A8] rounded">
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {files.length >= 1 && (
                <button 
                className="bg-[#7B68EE] text-white px-6 py-4 rounded-lg font-semibold hover:bg-[#B6B8D6] transition-colors mt-8 align-center mx-auto block shadow-sm"
                type = "button" onClick={() => parsePdf(files)}>
                    Process your offers
                </button>
            )}

            <section>
                {result && Array.isArray(result) && (
                    <div className={`grid gap-6 mt-10 mb-5 rounded-xl p-6 w-3/4 mx-auto bg-[#DEDFF8] shadow-xl ${result.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                        {result.map((offer, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#7B68EE]">
                                <h3 className="text-xl font-bold text-[#7B68EE] mb-4 border-b pb-2">Offer {index + 1}</h3>
                                <div className="space-y-3">
                                    {OFFER_FIELDS.map(({ key, label }) => {
                                        const value = offer[key]
                                        if (!value) return null
                                        return (
                                            <div key={key} className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-600">{label}</span>
                                                <span className="text-lg text-gray-800 bg-gray-50 p-2 rounded mt-1">{value}</span>
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