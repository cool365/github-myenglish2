import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Loader2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

interface WordResult {
  id: string
  word: string
  definition: string
  part_of_speech: string
  difficulty_level: string
  phonetic?: string
}

export default function WordSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<WordResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    try {
      // First, search in our database
      const { data: existingWords } = await supabase
        .from('words')
        .select('*')
        .ilike('word', `${query}%`)
        .limit(10)

      if (existingWords && existingWords.length > 0) {
        setResults(existingWords)
        setIsLoading(false)
        return
      }

      // If not found, fetch from dictionary API
      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/dictionary`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabase.supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word: query.trim() }),
      })

      const data = await response.json()
      
      if (data.error) {
        toast({
          title: "Word not found",
          description: "Please try another word",
          variant: "destructive",
        })
        return
      }

      setResults([data])
    } catch (error) {
      console.error('Error searching words:', error)
      toast({
        title: "Error",
        description: "Failed to search for word",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <Input
          type="text"
          placeholder="Type any English word..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="pr-10"
        />
        <Button
          size="icon"
          onClick={handleSearch}
          disabled={isLoading}
          className="absolute right-1 top-1"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="mt-4 space-y-2">
          {results.map((word) => (
            <Link href={`/word/${word.id}`} key={word.id}>
              <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{word.word}</h3>
                    {word.phonetic && (
                      <p className="text-gray-500 text-sm">{word.phonetic}</p>
                    )}
                  </div>
                  <Badge className={getDifficultyColor(word.difficulty_level)}>
                    {word.difficulty_level}
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm mt-1">{word.part_of_speech}</p>
                <p className="text-gray-700 mt-2">{word.definition}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}