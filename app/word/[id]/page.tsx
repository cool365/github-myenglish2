"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Volume2, BookmarkPlus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"

interface WordDetails {
  id: string
  word: string
  phonetic: string
  definition: string
  part_of_speech: string
  difficulty_level: string
  examples: {
    id: string
    example_text: string
    translation: string
  }[]
  audio: {
    id: string
    audio_url: string
    accent: string
  }[]
}

export default function WordDetails({ params }: { params: { id: string } }) {
  const [word, setWord] = useState<WordDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchWordDetails = async () => {
      try {
        // Fetch word details
        const { data: wordData, error: wordError } = await supabase
          .from('words')
          .select('*')
          .eq('id', params.id)
          .single()

        if (wordError) throw wordError

        // Fetch examples
        const { data: examples, error: examplesError } = await supabase
          .from('word_examples')
          .select('*')
          .eq('word_id', params.id)

        if (examplesError) throw examplesError

        // Fetch audio
        const { data: audio, error: audioError } = await supabase
          .from('word_audio')
          .select('*')
          .eq('word_id', params.id)

        if (audioError) throw audioError

        setWord({
          ...wordData,
          examples: examples || [],
          audio: audio || []
        })
      } catch (error) {
        console.error('Error fetching word details:', error)
        toast({
          title: "Error",
          description: "Failed to load word details",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchWordDetails()
  }, [params.id, supabase])

  const saveWord = async () => {
    if (!word) return

    setIsSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('user_words')
        .insert({
          user_id: user.id,
          word_id: word.id,
          mastery_level: 0,
          next_review_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Word saved to your collection"
      })
    } catch (error) {
      console.error('Error saving word:', error)
      toast({
        title: "Error",
        description: "Failed to save word",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

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
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!word) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900">Word not found</h2>
          <Link href="/" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            Return to home
          </Link>
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
          <Button onClick={saveWord} disabled={isSaving}>
            <BookmarkPlus className="h-5 w-5 mr-2" />
            {isSaving ? "Saving..." : "Save Word"}
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{word.word}</h1>
                <p className="text-gray-600 mt-1">{word.phonetic}</p>
              </div>
              <Badge className={getDifficultyColor(word.difficulty_level)}>
                {word.difficulty_level}
              </Badge>
            </div>

            <div className="mt-4">
              <span className="text-sm font-medium text-gray-500">
                {word.part_of_speech}
              </span>
              <p className="mt-2 text-gray-800">{word.definition}</p>
            </div>

            {word.audio.length > 0 && (
              <div className="mt-4 flex gap-2">
                {word.audio.map((audio) => (
                  <Button
                    key={audio.id}
                    variant="outline"
                    size="sm"
                    onClick={() => new Audio(audio.audio_url).play()}
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    {audio.accent.toUpperCase()}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {word.examples.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Examples</h2>
            <div className="space-y-4">
              {word.examples.map((example) => (
                <Card key={example.id}>
                  <CardContent className="p-4">
                    <p className="text-gray-800">{example.example_text}</p>
                    {example.translation && (
                      <p className="text-gray-600 mt-2 text-sm">
                        {example.translation}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}