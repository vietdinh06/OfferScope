'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { type User } from '@supabase/supabase-js'
import Navbar from './Navbar'
import Footer from './Footer'

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState<string | null>(null)

  const getProfile = useCallback(async () => {
    try {
      if (!user?.id || !supabase) {
        setLoading(false)
        return
      }
      setLoading(true)

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        console.error(error)
        throw error
      }

      if (data) {
        setFullname(data.full_name)
      }
    } catch (error) {
      console.error('Error loading user data!', error)
      alert('Error loading user data!')
    } finally {
      setLoading(false)
    }
  }, [supabase, user])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="mt-10">
        <h2 className="text-5xl text-center tracking-wide mb-8 text-gray-800 font-bold">Account Settings</h2>
      </div>
      <section className="flex items-center justify-center py-10">
        <div className="bg-white p-10 rounded-lg shadow-md shadow-[#7B68EE] w-full max-w-lg">
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input 
                id="email" 
                type="email" 
                value={user?.email || ''} 
                disabled 
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
              />
            </div>

            {loading && (
              <p className="text-sm text-gray-500">Loading profile…</p>
            )}
            
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullname || ''}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#7B68EE] focus:border-[#7B68EE]"
                placeholder="Enter your full name"
              />
            </div>

            <div className="pt-4">
              <a 
                href="/change-password" 
                className="inline-block w-full text-center bg-[#7B68EE] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#B6B8D6] hover:text-[#7B68EE] transition-colors"
              >
                Change Password
              </a>
            </div>

            <div>
              <form action="/auth/signout" method="post">
                <button 
                  className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors" 
                  type="submit"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </main>
  )
}