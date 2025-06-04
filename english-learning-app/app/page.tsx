"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Volume2, Home, BookHeart, User, Play, Star, Clock, Sparkles, TrendingUp, Zap } from "lucide-react"
import Link from "next/link"

export default function EnglishLearningHome() {
  const [searchQuery, setSearchQuery] = useState("")
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)

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

  // 热门搜索词汇
  const popularWords = ["amazing", "beautiful", "challenge", "discover", "elegant", "fantastic"]

  // 相关词汇
  const relatedWords = ["synonyms", "antonyms", "etymology", "pronunciation", "definition", "examples"]

  const handleSearch = (query?: string) => {
    const searchTerm = query || searchQuery
    if (searchTerm.trim()) {
      console.log("Searching for:", searchTerm)
      // 这里会跳转到搜索结果页面或单词详情页
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
      {/* 顶部用户信息 */}
      <div className="bg-white shadow-lg px-6 py-4 rounded-b-[2rem]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              WordMaster
            </h1>
            <p className="text-xs text-gray-600">Learn English Daily ✨</p>
          </div>
          <Avatar className="w-12 h-12 border-3 border-teal-200 shadow-lg">
            <AvatarImage src="/placeholder.svg?height=48&width=48" alt="User" />
            <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white text-sm font-semibold">
              JD
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* 主要搜索区域 - 更突出 */}
      <div className="px-6 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-100 to-cyan-100 px-4 py-2 rounded-2xl mb-4">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <span className="text-sm font-medium text-teal-700">Discover New Words</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">What word would you like to learn?</h2>
          <p className="text-gray-600">Search for any English word to get detailed explanations</p>
        </div>

        {/* 搜索输入框 - 更大更突出 */}
        <Card className="shadow-2xl border-0 rounded-3xl mb-6 bg-white">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Type any word here... (e.g., serendipity)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-16 text-lg px-6 pr-16 border-3 border-teal-200 rounded-3xl focus:border-teal-400 focus:ring-0 shadow-sm bg-gray-50"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button
                  onClick={() => handleSearch()}
                  size="icon"
                  className="absolute right-2 top-2 h-12 w-12 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 rounded-2xl shadow-lg"
                  disabled={!searchQuery.trim()}
                >
                  <Search className="w-6 h-6" />
                </Button>
              </div>

              <Button
                onClick={() => handleSearch()}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 rounded-3xl shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                disabled={!searchQuery.trim()}
              >
                <Search className="w-6 h-6 mr-3" />
                Search & Learn
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 热门搜索词汇 */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-500" />
            Popular Searches
          </h3>
          <div className="flex flex-wrap gap-2">
            {popularWords.map((word, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleWordClick(word)}
                className="rounded-2xl border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-300 transition-all duration-200"
              >
                {word}
              </Button>
            ))}
          </div>
        </div>

        {/* 相关功能词汇 - 可点击搜索 */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-500" />
            Explore Features
          </h3>
          <div className="flex flex-wrap gap-2">
            {relatedWords.map((word, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleWordClick(word)}
                className="rounded-2xl border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
              >
                {word}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* 今日推荐 - 简化版 */}
      <div className="px-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Today's Featured Words</h2>
            <p className="text-sm text-gray-600 mt-1">Handpicked for your learning journey 🎯</p>
          </div>
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-2xl shadow-md">
            <Star className="w-4 h-4 mr-1" />
            Featured
          </Badge>
        </div>

        {/* 推荐单词列表 - 紧凑版 */}
        <div className="space-y-4">
          {todayWords.map((word) => (
            <Card
              key={word.id}
              className="shadow-lg border-0 rounded-3xl overflow-hidden bg-white hover:shadow-xl transition-all duration-200"
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3
                        className="text-xl font-bold text-gray-900 cursor-pointer hover:text-teal-600 transition-colors"
                        onClick={() => handleWordClick(word.word)}
                      >
                        {word.word}
                      </h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`w-12 h-12 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 hover:from-teal-200 hover:to-cyan-200 shadow-md transform transition-all duration-200 ${
                          playingAudio === word.audio ? "scale-110 animate-pulse" : "hover:scale-105"
                        }`}
                        onClick={() => playAudio(word.audio, word.id)}
                      >
                        <Volume2
                          className={`w-5 h-5 text-teal-600 ${playingAudio === word.audio ? "animate-bounce" : ""}`}
                        />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{word.phonetic}</p>
                    <p className="text-sm text-gray-800 leading-relaxed mb-3">{word.meaning}</p>

                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className={`text-xs px-3 py-1 rounded-2xl ${
                          word.level === "Advanced"
                            ? "border-red-300 text-red-600 bg-red-50"
                            : "border-emerald-300 text-emerald-600 bg-emerald-50"
                        }`}
                      >
                        {word.level}
                      </Badge>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-2xl text-xs px-4"
                          onClick={() => handleWordClick(word.word)}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Learn
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-2 border-teal-300 text-teal-600 hover:bg-teal-50 rounded-2xl text-xs px-4"
                        >
                          <BookHeart className="w-3 h-3 mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 快速统计 */}
        <Card className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white rounded-3xl shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Today's Progress 🎉</h3>
                <p className="text-purple-100 mb-4">Keep up the amazing work!</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>15 min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookHeart className="w-4 h-4" />
                    <span>8 words</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">3/5</div>
                <div className="text-sm text-purple-200">Daily Goal</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 底部导航栏 */}
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

      {/* 底部导航栏占位空间 */}
      <div className="h-24"></div>
    </div>
  )
}
