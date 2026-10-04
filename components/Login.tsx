'use client';
import Navbar from "./Navbar";
import Footer from "./Footer";
import { login } from '../app/login/actions';

function Login() {
    return (
        <main className="app-shell flex flex-col">
            <Navbar/>
            <section className="flex flex-1 items-center justify-center px-6 py-16">
                <div className="surface w-full max-w-md p-8 sm:p-10">
                    <p className="eyebrow">Welcome back</p>
                    <h2 className="mt-3 text-3xl font-black text-slate-950">Log in to OfferScope</h2>
                    <h3 className="mt-3 text-sm text-slate-500">Don&apos;t have an account? <a href="/signup" className="font-bold text-indigo-600 hover:text-indigo-800">Sign up</a></h3>
                    <form className="mt-8 space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-700">Email</label>
                            <input type="email" id="email" name="email" className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100" placeholder="you@example.com" />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-700">Password</label>
                            <input type="password" id="password" name="password" className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100" placeholder="Your password" />
                        </div>
                        <button type="submit" formAction={login} className="button-primary w-full">Sign in</button>
                        <p className="text-sm text-slate-500">Forgot your password? <a href="/forgot-password" className="font-bold text-indigo-600">Reset it here</a></p>
                    </form>
                </div>
            </section>
            <Footer/>
        </main>
    )
}

export default Login;