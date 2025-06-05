```tsx
"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Volume2, Trash2, Clock, Star, BookOpen, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"

interface SavedWord {
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
  last_reviewed_at: string | null
  review_count: number
  is_favorited: boolean
}

export default function Wordbook() {
  const [words, setWords] = useState<SavedWord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'review' | 'mastered'>('all')
  const supabase = createClient()

  useEffect(() => {
    fetchWords()
  }, [])

  const fetchWords = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('user_words')
        .select(`
          id,
          mastery_level,
          next_review_date,
          last_reviewed_at,
          review_count,
          is_favorited,
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
        .order('next_review_date', { ascending: true })

      if (error) throw error

      setWords(data || [])
    } catch (error) {
      console.error('Error fetching words:', error)
      toast({
        title: "Error",
        description: "Failed to load your wordbook",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const removeWord = async (wordId: string) => {
    try {
      const { error } = await supabase
        .from('user_words')
        .delete()
        .eq('id', wordId)

      if (error) throw error

      setWords(words.filter(w => w.id !== wordId))
      toast({
        title: "Success",
        description: "Word removed from your collection"
      })
    } catch (error) {
      console.error('Error removing word:', error)
      toast({
        title: "Error",
        description: "Failed to remove word",
        variant: "destructive"
      })
    }
  }

  const toggleFavorite = async (wordId: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from('user_words')
        .update({ is_favorited: !currentState })
        .eq('id', wordId)

      if (error) throw error

      setWords(words.map(w => 
        w.id === wordId ? { ...w, is_favorited: !currentState } : w
      ))
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast({
        title: "Error",
        description: "Failed to update word",
        variant: "destructive"
      })
    }
  }

  const filteredWords = words.filter(word => {
    switch (filter) {
      case 'review':
        return new Date(word.next_review_date) <= new Date()
      case 'mastered':
        return word.mastery_level >= 5
      default:
        return true
    }
  })

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              All ({words.length})
            </Button>
            <Button
              variant={filter === 'review' ? 'default' : 'outline'}
              onClick={() => setFilter('review')}
            >
              <Clock className="h-4 w-4 mr-2" />
              Review ({words.filter(w => new Date(w.next_review_date) <= new Date()).length})
            </Button>
            <Button
              variant={filter === 'mastered' ? 'default' : 'outline'}
              onClick={() => setFilter('mastered')}
            >
              <Star className="h-4 w-4 mr-2" />
              Mastered ({words.filter(w => w.mastery_level >= 5).length})
            </Button>
          </div>
        </div>

        {filteredWords.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No words found
              </h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? "Start by adding words to your collection!"
                  : filter === 'review'
                    ? "No words to review at the moment."
                    : "Keep learning to master more words!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredWords.map((savedWord) => (
              <Card key={savedWord.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Link 
                          href={`/word/${savedWord.word.id}`}
                          className="text-lg font-semibold hover:text-blue-600"
                        >
                          {savedWord.word.word}
                        </Link>
                        <Badge className={getDifficultyColor(savedWord.word.difficulty_level)}>
                          {savedWord.word.difficulty_level}
                        </Badge>
                      </div>
                      <p className="text-gray-500 text-sm">{savedWord.word.phonetic}</p>
                      <p className="text-gray-700 mt-2">{savedWord.word.definition}</p>
                      
                      <div className="flex items-center gap-4 mt-4">
                        <span className="text-sm text-gray-500">
                          Mastery: {savedWord.mastery_level}/5
                        </span>
                        <span className="text-sm text-gray-500">
                          Reviews: {savedWord.review_count}
                        </span>
                        {savedWord.next_review_date && (
                          <span className="text-sm text-gray-500">
                            Next review: {new Date(savedWord.next_review_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFavorite(savedWord.id, savedWord.is_favorited)}
                      >
                        <Star
                          className={`h-5 w-5 ${
                            savedWord.is_favorited ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                          }`}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => removeWord(savedWord.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```