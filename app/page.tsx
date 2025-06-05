```tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import AuthButton from "@/components/auth/auth-button"
import WordSearch from "@/components/search/word-search"
import ReviewReminder from "@/components/wordbook/review-reminder"

export default function Home() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push("/auth/sign-in")
      }
    }
    
    checkUser()
  }, [router, supabase])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">WordMaster</h1>
          <AuthButton />
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <ReviewReminder />
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Search Words</h2>
            <WordSearch />
          </div>
        </div>
      </main>
    </div>
  )
}
```