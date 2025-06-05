```tsx
"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Volume2, ArrowLeft, Check, X } from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"

interface ReviewWord {
  id: string
  word: {
    id: string
    word: string
    phonetic: string
    definition: string
    part_of_speech: string
    difficulty_level: string
  }
  mastery_level: number
  next_review_date: string
}

export default function Review() {
  const [words, setWords] = useState<ReviewWord[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchReviewWords()
  }, [])

  const fetchReviewWords = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('user_words')
        .select(`
          id,
          mastery_level,
          next_review_date,
          word:words (
            id,
            word,
            phonetic,
            definition,
            part_of_speech,
            difficulty_level
          )
        `)
        .eq('user_id', user.id)
        .lte('next_review_date', new Date().toISOString())
        .order('next_review_date', { ascending: true })

      if (error) throw error

      setWords(data || [])
    } catch (error) {
      console.error('Error fetching review words:', error)
      toast({
        title: "Error",
        description: "Failed to load review words",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const calculateNextReview = (currentMastery: number, remembered: boolean) => {
    const now = new Date()
    let newMastery = remembered 
      ? Math.min(currentMastery + 1, 5)
      : Math.max(currentMastery - 1, 0)
    
    // Intervals based on Ebbinghaus forgetting curve (in days)
    const intervals = [1, 2, 4, 7, 15, 30]
    const days = intervals[newMastery] || 30
    
    now.setDate(now.getDate() + days)
    return now.toISOString()
  }

  const handleResponse = async (remembered: boolean) => {
    if (!words[currentIndex]) return

    const word = words[currentIndex]
    const nextReviewDate = calculateNextReview(word.mastery_level, remembered)
    const newMasteryLevel = remembered 
      ? Math.min(word.mastery_level + 1, 5)
      : Math.max(word.mastery_level - 1, 0)

    try {
      const { error } = await supabase
        .from('user_words')
        .update({
          mastery_level: newMasteryLevel,
          next_review_date: nextReviewDate,
          last_reviewed_at: new Date().toISOString(),
          review_count: supabase.sql\`review_count + 1`
        })
        .eq('id', word.id)

      if (error) throw error

      if (currentIndex < words.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setShowAnswer(false)
      } else {
        toast({
          title: "Review Complete!",
          description: "You've reviewed all words for now."
        })
        // Redirect to wordbook after a short delay
        setTimeout(() => {
          window.location.href = '/wordbook'
        }, 2000)
      }
    } catch (error) {
      console.error('Error updating word:', error)
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (words.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-6">
            <Link href="/wordbook" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-6 w-6" />
            </Link>
          </div>
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No words to review
              </h3>
              <p className="text-gray-600 mb-4">
                You're all caught up! Check back later for more reviews.
              </p>
              <Button asChild>
                <Link href="/wordbook">Back to Wordbook</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentWord = words[currentIndex]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/wordbook" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div className="text-gray-600">
            {currentIndex + 1} / {words.length}
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">{currentWord.word.word}</h2>
              <p className="text-gray-600">{currentWord.word.phonetic}</p>
              
              {showAnswer ? (
                <div className="mt-8">
                  <p className="text-gray-500 text-sm mb-2">
                    {currentWord.word.part_of_speech}
                  </p>
                  <p className="text-xl">{currentWord.word.definition}</p>
                </div>
              ) : (
                <Button
                  className="mt-8"
                  onClick={() => setShowAnswer(true)}
                >
                  Show Definition
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {showAnswer && (
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              variant="outline"
              className="w-32 text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => handleResponse(false)}
            >
              <X className="w-5 h-5 mr-2" />
              Again
            </Button>
            <Button
              size="lg"
              className="w-32 bg-green-600 hover:bg-green-700"
              onClick={() => handleResponse(true)}
            >
              <Check className="w-5 h-5 mr-2" />
              Good
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
```