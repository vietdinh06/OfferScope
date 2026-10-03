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
         <header className="bg-[white]/75 backdrop-blur-md shadow-xs sticky top-0 z-50 font-mono">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between w-full">
                    <a href="/home" className="text-3xl font-bold bg-gradient-to-r from-[#B8B8FF] to-[#7B68EE] text-transparent bg-clip-text">OfferScope</a>
                    
                    <nav className="hidden md:flex gap-8 lg:gap-20">
                        <a href="/home" className="text-gray-700 hover:text-[#B8B8FF] transition-colors font-medium">Home</a>
                        <a href="/home#about" className="text-gray-700 hover:text-[#B8B8FF] transition-colors font-medium">About</a>
                        <a href="/contact" className="text-gray-700 hover:text-[#B8B8FF] transition-colors font-medium">Contact</a>
                    </nav>

                    <nav className="hidden md:flex gap-8 items-center">

                        {user ? (
                            <>
                                <a href="/account" className="text-gray-700 hover:text-[#B8B8FF] transition-colors font-medium">Account</a>
                            </>
                        ) : (
                            <>
                                <a href="/login" className="text-gray-700 hover:text-[#B8B8FF] transition-colors font-medium">Log In</a>
                                <a href="/signup" className="px-4 py-2 font-medium bg-[#7B68EE] text-white rounded-lg font-semibold hover:bg-[#B6B8D6] hover:text-[#7B68EE] transition-colors">Sign up</a>
                            </>
                        )}
                    </nav>

                    <button 
                        className="md:hidden flex flex-col gap-1.5 p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className={`w-6 h-0.5 bg-gray-700 transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`w-6 h-0.5 bg-gray-700 transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`w-6 h-0.5 bg-gray-700 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <nav className="flex flex-col gap-4 pt-4 pb-2">
                        <a href="/home" className="text-gray-700 hover:text-[#B8B8FF] transition-colors font-medium py-2">Home</a>
                        <a href="/home#about" className="text-gray-700 hover:text-[#B8B8FF] transition-colors font-medium py-2">About</a>
                        <a href="/contact" className="text-gray-700 hover:text-[#B8B8FF] transition-colors font-medium py-2">Contact</a>
                        <hr className="border-gray-200" />
                        <a href="/login" className="text-gray-700 hover:text-[#B8B8FF] transition-colors font-medium py-2">Log In</a>
                        <a href="/signup" className="px-4 py-2 font-medium bg-[#7B68EE] text-white rounded-lg font-semibold hover:bg-[#B6B8D6] hover:text-[#7B68EE] transition-colors text-center">Sign up</a>
                    </nav>
                </div>
            </div>
        </header>
    )
}

export default Navbar;