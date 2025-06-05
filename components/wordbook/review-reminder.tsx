```tsx
"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Clock } from "lucide-react"
import Link from "next/link"

export default function ReviewReminder() {
  const [reviewCount, setReviewCount] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    const fetchReviewCount = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { count } = await supabase
          .from('user_words')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .lte('next_review_date', new Date().toISOString())

        setReviewCount(count || 0)
      } catch (error) {
        console.error('Error fetching review count:', error)
      }
    }

    fetchReviewCount()
    
    // Set up real-time subscription for updates
    const channel = supabase
      .channel('review_count')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_words'
      }, () => {
        fetchReviewCount()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (reviewCount === 0) return null

  return (
    <Card className="bg-blue-50 border-blue-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-blue-500" />
          <div>
            <p className="font-medium text-blue-900">
              {reviewCount} words due for review
            </p>
            <p className="text-sm text-blue-700">
              Keep your memory fresh!
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href="/review">
            Start Review
          </Link>
        </Button>
      </div>
    </Card>
  )
}
```