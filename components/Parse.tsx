'use client'
import Dropzone from "@/components/Dropzone";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function myParse() {
    return (
        <main className="app-shell flex flex-col">
            <div className="flex-1">
                <Navbar/>
                <section>
                    <div className="text-center">
                        <div className="mx-auto max-w-3xl px-6 pb-4 pt-16">
                        <p className="eyebrow">Offer workspace</p>
                        <h1 className="mt-4 text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">
                            Compare your <span className="bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">offers</span>
                        </h1>
                        <p className="mx-auto mt-4 max-w-xl text-slate-500">Upload your offer letters and get the important details in one calm, focused view.</p>
                        <div className="mt-7">
                            <a className="button-secondary" href="/history">View saved offers <span aria-hidden="true">→</span></a>
                        </div>
                        </div>
                        
                        <Dropzone />
                    </div>
                </section>
            </div>
            <Footer/>
        </main>
    )
}

export default myParse;