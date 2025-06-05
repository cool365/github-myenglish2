"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Volume2, Home, BookHeart, User, Play, Star, Clock, Sparkles, TrendingUp, Zap } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import AuthButton from "@/components/auth/auth-button"
import WordSearch from "@/components/search/word-search"
import ReviewReminder from "@/components/wordbook/review-reminder"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)
  const supabase = createClient()

  const todayWords = [
    {
      id: 1,
      word: "Serendipity",
      phonetic: "/ˌserənˈdipədē/",
      meaning: "The occurrence of events by chance in a happy way",
      level: "Advanced",
      audio: "/audio/serendipity.mp3",
    },
    {
      id: 2,
      word: "Resilience",
      phonetic: "/rɪˈzɪliəns/",
      meaning: "The ability to recover quickly from difficulties",
      level: "Intermediate",
      audio: "/audio/resilience.mp3",
    },
    {
      id: 3,
      word: "Ephemeral",
      phonetic: "/ɪˈfem(ə)rəl/",
      meaning: "Lasting for a very short time",
      level: "Advanced",
      audio: "/audio/ephemeral.mp3",
    },
  ]

  const popularWords = ["amazing", "beautiful", "challenge", "discover", "elegant", "fantastic"]
  const relatedWords = ["synonyms", "antonyms", "etymology", "pronunciation", "definition", "examples"]

  const handleSearch = (query?: string) => {
    const searchTerm = query || searchQuery
    if (searchTerm.trim()) {
      console.log("Searching for:", searchTerm)
    }
  }

  const handleWordClick = (word: string) => {
    setSearchQuery(word)
    handleSearch(word)
  }

  const playAudio = (audioUrl: string, wordId: number) => {
    setPlayingAudio(audioUrl)
    console.log("Playing audio:", audioUrl)
    setTimeout(() => setPlayingAudio(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50">
      {/* Header - Made sticky and more compact on mobile */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-lg px-4 sm:px-6 py-3 rounded-b-[2rem]">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              WordMaster
            </h1>
            <p className="text-xs text-gray-600">Learn English Daily ✨</p>
          </div>
          <AuthButton />
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
        <ReviewReminder />
        
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-100 to-cyan-100 px-3 py-1.5 rounded-2xl mb-3">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-medium text-teal-700">Discover New Words</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">What word would you like to learn?</h2>
          <p className="text-sm sm:text-base text-gray-600">Search for any English word to get detailed explanations</p>
        </div>

        <WordSearch />

        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Featured Words</h2>
          <div className="space-y-4">
            {todayWords.map((word) => (
              <Card 
                key={word.id} 
                className="shadow-lg border-0 rounded-3xl overflow-hidden bg-white transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">{word.word}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 hover:from-teal-200 hover:to-cyan-200 shadow-md transform transition-all duration-300 ${
                            playingAudio === word.audio ? "scale-110 animate-pulse" : "hover:scale-105"
                          }`}
                          onClick={() => playAudio(word.audio, word.id)}
                        >
                          <Volume2 className={`w-4 h-4 sm:w-5 sm:h-5 text-teal-600 ${playingAudio === word.audio ? "animate-bounce" : ""}`} />
                        </Button>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2">{word.phonetic}</p>
                      <p className="text-sm text-gray-800 leading-relaxed mb-3">{word.meaning}</p>

                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={`text-xs px-3 py-1 rounded-2xl ${
                          word.level === "Advanced"
                            ? "border-red-300 text-red-600 bg-red-50"
                            : "border-emerald-300 text-emerald-600 bg-emerald-50"
                        }`}>
                          {word.level}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Made more accessible on mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-4 sm:px-6 py-2 rounded-t-3xl shadow-2xl">
        <div className="flex justify-around items-center max-w-7xl mx-auto">
          <Link href="/">
            <Button variant="ghost" className="flex-col gap-1 h-14 px-4 rounded-2xl bg-teal-100 text-teal-600 transform transition-all duration-200 hover:scale-105 active:scale-95">
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Home</span>
            </Button>
          </Link>

          <Link href="/wordbook">
            <Button variant="ghost" className="flex-col gap-1 h-14 px-4 rounded-2xl text-gray-500 hover:text-gray-700 transform transition-all duration-200 hover:scale-105 active:scale-95">
              <BookHeart className="w-6 h-6" />
              <span className="text-xs font-medium">Wordbook</span>
            </Button>
          </Link>

          <Link href="/profile">
            <Button variant="ghost" className="flex-col gap-1 h-14 px-4 rounded-2xl text-gray-500 hover:text-gray-700 transform transition-all duration-200 hover:scale-105 active:scale-95">
              <User className="w-6 h-6" />
              <span className="text-xs font-medium">Profile</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="h-20"></div>
    </div>
  )
}