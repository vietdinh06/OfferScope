'use client';
import Navbar from "./Navbar";
import Footer from "./Footer";
import { signup } from '../app/signup/actions';
import { useState } from 'react'

function Signup() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(formData: FormData) {
        // Clear previous errors
        setError("");
        
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long!");
            return;
        }

        try {
            await signup(formData);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        }
    }

    return (
        <main className="min-h-screen flex flex-col">
            <Navbar/>
            <section className="flex items-center justify-center py-25">
                <div className="bg-white p-10 rounded-lg shadow-md shadow-[#7B68EE] w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign Up</h2>
                    <h3 className="text-1xl font-bold mb-6 text-gray-800">Have an account? <a href="/login" className="text-[#B8B8FF]">Log In</a></h3>
                    
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}
                    
                    <form action={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <input type="text" id="name" name="name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#7B68EE] focus:border-[#7B68EE]" placeholder="John Doe" required />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" id="email" name="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#7B68EE] focus:border-[#7B68EE]" placeholder="you@example.com" required />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                value={password}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#7B68EE] focus:border-[#7B68EE]" 
                                placeholder="Your Password" 
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input 
                                type="password" 
                                id="confirmPassword" 
                                name="confirmPassword" 
                                value={confirmPassword}
                                className={`mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring-[#7B68EE] focus:border-[#7B68EE] ${
                                    confirmPassword && password !== confirmPassword 
                                        ? 'border-red-500' 
                                        : 'border-gray-300'
                                }`}
                                placeholder="Confirm Your Password" 
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required 
                            />
                            {confirmPassword && password !== confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                            )}
                        </div>
                        <button 
                            type="submit" 
                            disabled={!password || !confirmPassword || password !== confirmPassword}
                            className="w-full bg-[#7B68EE] text-white py-2 px-4 rounded-md shadow-sm hover:bg-[#B6B8D6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7B68EE] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Sign Up
                        </button>
                    </form>
                </div>
            </section>
            <Footer/>
        </main>
    )
}

export default Signup;