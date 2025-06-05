"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import {
  Search,
  Volume2,
  Trash2,
  Play,
  RotateCcw,
  BookOpen,
  Clock,
  Star,
  ArrowLeft,
  Home,
  BookHeart,
  User,
  CheckSquare,
  Square,
  TrendingUp,
  Flame,
  MoreVertical,
} from "lucide-react"

export default function WordbookPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [selectMode, setSelectMode] = useState(false)
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)

  const savedWords = [
    {
      id: "serendipity",
      word: "Serendipity",
      phonetic: "/ˌserənˈdipədē/",
      meaning: "The occurrence of events by chance in a happy way",
      level: "Advanced",
      addedDate: "2024-01-15",
      reviewCount: 3,
      mastered: false,
      lastReviewed: "2024-01-20",
      nextReview: "2024-01-22",
      difficulty: "hard",
      category: "Academic",
    },
    {
      id: "resilience",
      word: "Resilience",
      phonetic: "/rɪˈzɪliəns/",
      meaning: "The ability to recover quickly from difficulties",
      level: "Intermediate",
      addedDate: "2024-01-14",
      reviewCount: 5,
      mastered: true,
      lastReviewed: "2024-01-21",
      nextReview: null,
      difficulty: "medium",
      category: "Psychology",
    },
    {
      id: "ephemeral",
      word: "Ephemeral",
      phonetic: "/ɪˈfem(ə)rəl/",
      meaning: "Lasting for a very short time",
      level: "Advanced",
      addedDate: "2024-01-13",
      reviewCount: 2,
      mastered: false,
      lastReviewed: "2024-01-19",
      nextReview: "2024-01-21",
      difficulty: "hard",
      category: "Academic",
    },
  ]

  const stats = {
    total: savedWords.length,
    mastered: savedWords.filter((w) => w.mastered).length,
    needReview: savedWords.filter((w) => !w.mastered && w.nextReview && new Date(w.nextReview) <= new Date()).length,
    thisWeek: savedWords.filter((w) => {
      const addedDate = new Date(w.addedDate)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return addedDate >= weekAgo
    }).length,
  }

  const getFilteredWords = () => {
    let filtered = savedWords

    if (searchQuery) {
      filtered = filtered.filter(
        (word) =>
          word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
          word.meaning.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    switch (selectedFilter) {
      case "needReview":
        filtered = filtered.filter((w) => !w.mastered && w.nextReview && new Date(w.nextReview) <= new Date())
        break
      case "mastered":
        filtered = filtered.filter((w) => w.mastered)
        break
      case "recent":
        filtered = filtered.filter((w) => {
          const addedDate = new Date(w.addedDate)
          const threeDaysAgo = new Date()
          threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
          return addedDate >= threeDaysAgo
        })
        break
      case "difficult":
        filtered = filtered.filter((w) => w.difficulty === "hard")
        break
      default:
        break
    }

    return filtered
  }

  const filteredWords = getFilteredWords()

  const toggleWordSelection = (wordId: string) => {
    setSelectedWords((prev) => (prev.includes(wordId) ? prev.filter((id) => id !== wordId) : [...prev, wordId]))
  }

  const selectAllWords = () => {
    if (selectedWords.length === filteredWords.length) {
      setSelectedWords([])
    } else {
      setSelectedWords(filteredWords.map((w) => w.id))
    }
  }

  const playAudio = (audioUrl: string) => {
    setPlayingAudio(audioUrl)
    console.log("Playing audio:", audioUrl)
    setTimeout(() => setPlayingAudio(null), 2000)
  }

  const getDaysUntilReview = (nextReview: string | null) => {
    if (!nextReview) return null
    const days = Math.ceil((new Date(nextReview).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  const WordCard = ({ word }: { word: any }) => {
    const daysUntilReview = getDaysUntilReview(word.nextReview)
    const isSelected = selectedWords.includes(word.id)

    return (
      <Card
        className={`hover:shadow-lg transition-all duration-200 rounded-3xl ${
          isSelected ? "ring-3 ring-teal-400 bg-teal-50" : ""
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {selectMode && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => toggleWordSelection(word.id)}
                className="mt-1 rounded-lg"
              />
            )}

            <Link href={`/word/${word.id}`} className="flex-1">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">{word.word}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`w-10 h-10 rounded-2xl bg-teal-100 hover:bg-teal-200 transform transition-all duration-200 ${
                        playingAudio === `/audio/${word.id}.mp3` ? "scale-110 animate-pulse" : "hover:scale-105"
                      }`}
                      onClick={(e) => {
                        e.preventDefault()
                        playAudio(`/audio/${word.id}.mp3`)
                      }}
                    >
                      <Volume2
                        className={`w-4 h-4 text-teal-600 ${
                          playingAudio === `/audio/${word.id}.mp3` ? "animate-bounce" : ""
                        }`}
                      />
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-2xl">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </Button>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">{word.phonetic}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{word.meaning}</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className={`text-xs rounded-2xl ${
                      word.level === "Advanced"
                        ? "border-red-300 text-red-600 bg-red-50"
                        : word.level === "Intermediate"
                          ? "border-orange-300 text-orange-600 bg-orange-50"
                          : "border-emerald-300 text-emerald-600 bg-emerald-50"
                    }`}
                  >
                    {word.level}
                  </Badge>

                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 rounded-2xl">
                    {word.category}
                  </Badge>

                  {word.mastered ? (
                    <Badge className="text-xs bg-emerald-100 text-emerald-700 rounded-2xl">
                      <Star className="w-3 h-3 mr-1" />
                      Mastered
                    </Badge>
                  ) : (
                    daysUntilReview !== null && (
                      <Badge
                        variant="outline"
                        className={`text-xs rounded-2xl ${
                          daysUntilReview <= 0
                            ? "border-red-300 text-red-600 bg-red-50"
                            : "border-teal-300 text-teal-600 bg-teal-50"
                        }`}
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        {daysUntilReview <= 0 ? "Review Now" : `${daysUntilReview}d`}
                      </Badge>
                    )
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Added: {new Date(word.addedDate).toLocaleDateString()}</span>
                  <span>Reviewed: {word.reviewCount} times</span>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-100 pb-24">
      {/* Header */}
      <div className="bg-white shadow-lg px-6 py-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-teal-100">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              My Wordbook
            </h1>
            <p className="text-gray-600">{stats.total} words collected ✨</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectMode(!selectMode)}
            className="rounded-2xl hover:bg-teal-100"
          >
            {selectMode ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
          </Button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search words or meanings... 🔍"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 pl-12 pr-4 border-3 border-teal-200 focus:border-teal-400 rounded-3xl shadow-sm"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            <Button
              variant={selectedFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("all")}
              className="whitespace-nowrap rounded-2xl"
            >
              All ({stats.total})
            </Button>
            <Button
              variant={selectedFilter === "needReview" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("needReview")}
              className="whitespace-nowrap rounded-2xl"
            >
              <Clock className="w-4 h-4 mr-1" />
              Review ({stats.needReview})
            </Button>
            <Button
              variant={selectedFilter === "mastered" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("mastered")}
              className="whitespace-nowrap rounded-2xl"
            >
              <Star className="w-4 h-4 mr-1" />
              Mastered ({stats.mastered})
            </Button>
            <Button
              variant={selectedFilter === "recent" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("recent")}
              className="whitespace-nowrap rounded-2xl"
            >
              Recent ({stats.thisWeek})
            </Button>
            <Button
              variant={selectedFilter === "difficult" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("difficult")}
              className="whitespace-nowrap rounded-2xl"
            >
              Difficult
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* 学习进度统计 */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-3xl shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm text-teal-100">Total Words</div>
                </div>
                <BookOpen className="w-8 h-8 text-teal-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-3xl shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{stats.mastered}</div>
                  <div className="text-sm text-emerald-100">Mastered</div>
                </div>
                <Star className="w-8 h-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-3xl shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{stats.needReview}</div>
                  <div className="text-sm text-orange-100">Need Review</div>
                </div>
                <Clock className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-3xl shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{Math.round((stats.mastered / stats.total) * 100)}%</div>
                  <div className="text-sm text-purple-100">Mastery Rate</div>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 批量复习入口 */}
        {stats.needReview > 0 && (
          <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-3xl shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Ready for Review! 🔥</h3>
                  <p className="text-yellow-100 mb-4">{stats.needReview} words are waiting for review</p>
                  <Button
                    variant="secondary"
                    className="bg-white text-orange-600 hover:bg-gray-100 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Start Batch Review
                  </Button>
                </div>
                <div className="bg-white/20 p-4 rounded-3xl">
                  <Flame className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 批量操作栏 */}
        {selectMode && (
          <Card className="border-teal-200 bg-teal-50 rounded-3xl shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedWords.length === filteredWords.length && filteredWords.length > 0}
                    onCheckedChange={selectAllWords}
                    className="rounded-lg"
                  />
                  <span className="text-sm font-medium">
                    {selectedWords.length} of {filteredWords.length} selected
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    disabled={selectedWords.length === 0}
                    className="rounded-2xl bg-teal-500 hover:bg-teal-600"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Review
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={selectedWords.length === 0}
                    className="rounded-2xl border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 单词列表 */}
        <div className="space-y-4">
          {filteredWords.length > 0 ? (
            filteredWords.map((word) => <WordCard key={word.id} word={word} />)
          ) : (
            <Card className="rounded-3xl shadow-lg">
              <CardContent className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? "No words found" : "No words in this category"}
                </h3>
                <p className="text-gray-600">
                  {searchQuery ? "Try adjusting your search terms" : "Start adding words to build your vocabulary! 📚"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 rounded-t-3xl shadow-2xl">
        <div className="flex justify-around items-center">
          <Link href="/">
            <Button variant="ghost" className="flex-col gap-2 h-16 px-6 rounded-3xl text-gray-500 hover:text-gray-700">
              <Home className="w-7 h-7" />
              <span className="text-sm font-medium">Home</span>
            </Button>
          </Link>

          <Link href="/wordbook">
            <Button variant="ghost" className="flex-col gap-2 h-16 px-6 rounded-3xl bg-teal-100 text-teal-600">
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
    </div>
  )
}
