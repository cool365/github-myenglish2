"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function AuthButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleSignOut}
      className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
    >
      Sign Out
    </Button>
  )
}