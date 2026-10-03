'use client'

import Navbar from './Navbar'
import Footer from './Footer'
function Home() {
    return (
        <main className="min-h-screen flex flex-col">
            <div>
                <Navbar/>

                <section className="h-screen flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-6xl tracking-wide mb-6 text-gray-800">
                            Prepare your <span className="font-semibold tracking-wider bg-gradient-to-r from-[#B8B8FF] to-[#7B68EE] text-transparent bg-clip-text inline-block">future</span> in real time.
                        </p>
                        <p className="text-gray-600 text-2xl text-pretty mb-8">Turn your offer letters into structured insights and see what&apos;s right for you.</p>

                        <a href="/parse"className="bg-[#7B68EE] text-white px-6 py-4 rounded-lg font-semibold hover:bg-[#B6B8D6] hover:text-[#7B68EE] transition-colors mt-8">
                            Parse your offers today
                        </a>
                    </div>
                </section>

                <section className="h-screen/2 flex items-center justify-center">
                    <div className="bg-[#DEDFF8] p-10 rounded-xl w-3/4 mx-auto shadow-md">
                        <h2 className="text-4xl text-center tracking-wide mb-8 text-gray-800 font-bold">3 Simple Steps</h2>
                        <div className="grid grid-cols-3 gap-8 items-start">
                            <div className="flex flex-col items-center text-center">
                                <div className="flex-shrink-0 w-12 h-12 bg-[#7B68EE] text-white rounded-full flex items-center justify-center mb-4 border-2 border-[#FFFFFF]">
                                    1
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Upload Your Offer(s)</h3>
                                    <p className="text-gray-600">With easy drag and drop</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="flex-shrink-0 w-12 h-12 bg-[#7B68EE] text-white rounded-full flex items-center justify-center mb-4 border-2 border-[#FFFFFF]">
                                    2
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Review Your Info</h3>
                                    <p className="text-gray-600">Change as necessary</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="flex-shrink-0 w-12 h-12 bg-[#7B68EE] text-white rounded-full flex items-center justify-center mb-4 border-2 border-[#FFFFFF]">
                                    3
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Compare Your Future</h3>
                                    <p className="text-gray-600">Where will your career take you?</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="h-screen flex items-center justify-center" id="about">
                    <div className="p-10 rounded-xl w-3/4 mx-auto">
                        <h2 className="text-5xl text-center tracking-wide mb-8 text-gray-800 font-bold">About OfferScope</h2>
                        <p className="text-sm/10">OfferLens was built to solve a common problem: comparing job offers shouldn&apos;t feel overwhelming.

Offer letters are often filled with complex terms and fine print. This project uses AI to extract key information and present it in a way that makes comparisons easier and more transparent.

Built as a full-stack AI application, the goal is to combine thoughtful software design with practical career tools.

Your documents are processed only to provide summaries and comparisons. We do not sell or share user data.</p>
                    </div>
                </section>
            </div>
            <Footer/>
        </main>
    )
}

export default Home