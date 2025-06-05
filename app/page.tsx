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
      <div className="bg-white shadow-lg px-6 py-4 rounded-b-[2rem]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              WordMaster
            </h1>
            <p className="text-xs text-gray-600">Learn English Daily ✨</p>
          </div>
          <AuthButton />
        </div>
      </div>

      <div className="px-6 py-8">
        <ReviewReminder />
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-100 to-cyan-100 px-4 py-2 rounded-2xl mb-4">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <span className="text-sm font-medium text-teal-700">Discover New Words</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">What word would you like to learn?</h2>
          <p className="text-gray-600">Search for any English word to get detailed explanations</p>
        </div>

        <WordSearch />

        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Featured Words</h2>
          <div className="space-y-4">
            {todayWords.map((word) => (
              <Card key={word.id} className="shadow-lg border-0 rounded-3xl overflow-hidden bg-white">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{word.word}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`w-12 h-12 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 hover:from-teal-200 hover:to-cyan-200 shadow-md transform transition-all duration-200 ${
                            playingAudio === word.audio ? "scale-110 animate-pulse" : "hover:scale-105"
                          }`}
                          onClick={() => playAudio(word.audio, word.id)}
                        >
                          <Volume2 className={`w-5 h-5 text-teal-600 ${playingAudio === word.audio ? "animate-bounce" : ""}`} />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{word.phonetic}</p>
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

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 rounded-t-3xl shadow-2xl">
        <div className="flex justify-around items-center">
          <Link href="/">
            <Button variant="ghost" className="flex-col gap-2 h-16 px-6 rounded-3xl bg-teal-100 text-teal-600">
              <Home className="w-7 h-7" />
              <span className="text-sm font-medium">Home</span>
            </Button>
          </Link>

          <Link href="/wordbook">
            <Button variant="ghost" className="flex-col gap-2 h-16 px-6 rounded-3xl text-gray-500 hover:text-gray-700">
              <BookHeart className="w-7 h-7" />
              <span className="text-sm font-medium">Wordbook</span>
            </Button>
          </Link>

          <Link href="/profile">
            <Button variant="ghost" className="flex-col gap-2 h-16 px-6 rounded-3xl text-gray-500 hover:text-gray-700">
              <User className="w-7 h-7" />
              <span className="text-sm font-medium">Profile</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="h-24"></div>
    </div>
  )
}