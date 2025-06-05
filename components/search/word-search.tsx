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
          className="h-12 sm:h-14 pl-4 pr-12 text-base sm:text-lg rounded-2xl border-2 border-teal-200 focus:border-teal-400 shadow-sm transition-all duration-200"
        />
        <Button
          size="icon"
          onClick={handleSearch}
          disabled={isLoading}
          className="absolute right-2 top-2 sm:right-3 sm:top-3 h-8 w-8 sm:h-8 sm:w-8 rounded-xl bg-teal-500 hover:bg-teal-600 transform transition-all duration-200 hover:scale-105 active:scale-95"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="mt-4 space-y-3">
          {results.map((word) => (
            <Link href={`/word/${word.id}`} key={word.id}>
              <div className="p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{word.word}</h3>
                    {word.phonetic && (
                      <p className="text-gray-500 text-sm">{word.phonetic}</p>
                    )}
                  </div>
                  <Badge className={`${getDifficultyColor(word.difficulty_level)} transform transition-all duration-200 hover:scale-105`}>
                    {word.difficulty_level}
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm mt-1">{word.part_of_speech}</p>
                <p className="text-gray-700 mt-2 line-clamp-2">{word.definition}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}