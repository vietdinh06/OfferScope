'use client'

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { type User } from '@supabase/supabase-js';
function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const supabase = createClient();

    useEffect(() => {
        if (!supabase) {
            return;
        }

        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    return(
         <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <div className="flex items-center justify-between w-full">
                    <a href="/home" className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-900">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm text-white shadow-lg shadow-indigo-200">O</span>
                        Offer<span className="text-indigo-600">Scope</span>
                    </a>
                    
                    <nav className="hidden items-center gap-8 md:flex">
                        <a href="/home" className="font-medium text-slate-600 transition hover:text-indigo-600">Home</a>
                        <a href="/home#about" className="font-medium text-slate-600 transition hover:text-indigo-600">About</a>
                        <a href="/contact" className="font-medium text-slate-600 transition hover:text-indigo-600">Contact</a>
                    </nav>

                    <nav className="hidden md:flex gap-8 items-center">

                        {user ? (
                            <>
                                <a href="/account" className="button-secondary px-4 py-2 text-sm">Account</a>
                            </>
                        ) : (
                            <>
                                <a href="/login" className="font-medium text-slate-600 transition hover:text-indigo-600">Log in</a>
                                <a href="/signup" className="button-primary px-4 py-2 text-sm">Get started</a>
                            </>
                        )}
                    </nav>

                    <button 
                        className="md:hidden flex flex-col gap-1.5 p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className={`h-0.5 w-6 bg-slate-700 transition-all ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`}></span>
                        <span className={`h-0.5 w-6 bg-slate-700 transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`h-0.5 w-6 bg-slate-700 transition-all ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`}></span>
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <nav className="flex flex-col gap-4 border-t border-slate-200 pt-4 pb-2">
                        <a href="/home" className="py-2 font-medium text-slate-700 transition hover:text-indigo-600">Home</a>
                        <a href="/home#about" className="py-2 font-medium text-slate-700 transition hover:text-indigo-600">About</a>
                        <a href="/contact" className="py-2 font-medium text-slate-700 transition hover:text-indigo-600">Contact</a>
                        <hr className="border-gray-200" />
                        <a href="/login" className="py-2 font-medium text-slate-700 transition hover:text-indigo-600">Log in</a>
                        <a href="/signup" className="button-primary text-center">Get started</a>
                    </nav>
                </div>
            </div>
        </header>
    )
}

export default Navbar;