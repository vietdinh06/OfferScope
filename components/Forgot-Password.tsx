'use client';
import Navbar from "./Navbar";
import Footer from "./Footer";
import { forgot } from '../app/forgot-password/actions';
import { useState } from 'react'

function ForgotPassword() {
    const [email, setEmail] = useState("");
    return (
        <main className="min-h-screen flex flex-col">
            <Navbar/>
            <section className="flex items-center justify-center py-25">
                <div className="bg-white p-10 rounded-lg shadow-md shadow-[#7B68EE] w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Forgot Password</h2>
                    <h3 className="text-1xl font-bold mb-6 text-gray-800">Remember your password? <a href="/login" className="text-[#B8B8FF]">Log in</a></h3>
                    <form action={forgot} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#7B68EE] focus:border-[#7B68EE]" 
                                placeholder="you@example.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="w-full bg-[#7B68EE] text-white py-2 px-4 rounded-md shadow-sm hover:bg-[#B6B8D6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7B68EE] disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!email}
                        >
                            Get New Password
                        </button>
                    </form>
                </div>
            </section>
            <Footer/>
        </main>
    )
}

export default ForgotPassword;