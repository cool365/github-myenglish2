"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import {
  ArrowLeft,
  Volume2,
  Heart,
  Share2,
  BookOpen,
  Globe,
  Lightbulb,
  TreePine,
  Play,
  Copy,
  Bookmark,
} from "lucide-react"

export default function WordDetailPage({ params }: { params: { id: string } }) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("zh")
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)
  const [savedExamples, setSavedExamples] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")

  const wordData = {
    word: "Serendipity",
    phonetic: "/ˌserənˈdipədē/",
    partOfSpeech: "noun",
    level: "Advanced",
    frequency: "Rare",
    image: "/placeholder.svg?height=200&width=300",

    definitions: {
      en: [
        {
          meaning: "The occurrence and development of events by chance in a happy or beneficial way",
          example: "A fortunate stroke of serendipity brought the two old friends together after twenty years.",
        },
        {
          meaning: "A pleasant surprise; an instance of making a fortunate discovery",
          example: "Finding that rare book in the used bookstore was pure serendipity.",
        },
      ],
      zh: [
        {
          meaning: "意外发现珍奇事物的能力；意外的好运",
          example: "在旧书店发现那本珍贵的书纯属意外之喜。",
        },
        {
          meaning: "偶然发现有价值事物的天赋",
          example: "两位老朋友二十年后的重逢完全是一种美好的巧合。",
        },
      ],
      es: [
        {
          meaning: "La capacidad de hacer descubrimientos afortunados por casualidad",
          example: "Encontrar ese libro raro en la librería de segunda mano fue pura serendipia.",
        },
      ],
    },

    examples: [
      {
        id: "ex1",
        text: "The discovery of penicillin was a famous example of serendipity in science.",
        translation: "青霉素的发现是科学史上著名的意外发现例子。",
        audio: "/audio/example1.mp3",
        difficulty: "intermediate",
        category: "Science",
      },
      {
        id: "ex2",
        text: "Meeting my future business partner at that coffee shop was pure serendipity.",
        translation: "在那家咖啡店遇到我未来的商业伙伴纯属偶然。",
        audio: "/audio/example2.mp3",
        difficulty: "beginner",
        category: "Business",
      },
      {
        id: "ex3",
        text: "Sometimes the best travel experiences come from serendipity rather than planning.",
        translation: "有时最好的旅行体验来自意外发现而非精心规划。",
        audio: "/audio/example3.mp3",
        difficulty: "intermediate",
        category: "Travel",
      },
      {
        id: "ex4",
        text: "The serendipitous encounter led to a lifelong friendship and countless adventures.",
        translation: "这次偶然的相遇促成了终生的友谊和无数次冒险。",
        audio: "/audio/example4.mp3",
        difficulty: "advanced",
        category: "Relationships",
      },
      {
        id: "ex5",
        text: "Her career in photography began through serendipity when she found an old camera.",
        translation: "她的摄影生涯始于偶然发现一台旧相机的意外之喜。",
        audio: "/audio/example5.mp3",
        difficulty: "intermediate",
        category: "Career",
      },
    ],

    synonyms: ["chance", "fortune", "luck", "coincidence", "fate", "destiny"],
    antonyms: ["misfortune", "bad luck", "design", "intention", "planning"],
    similarWords: ["serendipitous", "serendipitously", "serendipitist"],

    etymology: {
      origin: "Coined by Horace Walpole in 1754",
      source: "From the Persian fairy tale 'The Three Princes of Serendip'",
      meaning: "Serendip was an old name for Sri Lanka",
      development: "The princes were always making discoveries by accident",
    },

    wordParts: {
      root: "serendip",
      suffix: "-ity",
      breakdown: "serendip + -ity (quality of)",
      related: ["serendipitous", "serendipitously"],
    },
  }

  const playAudio = (audioUrl: string) => {
    setPlayingAudio(audioUrl)
    console.log("Playing audio:", audioUrl)
    setTimeout(() => setPlayingAudio(null), 2000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const toggleExampleSave = (exampleId: string) => {
    setSavedExamples((prev) =>
      prev.includes(exampleId) ? prev.filter((id) => id !== exampleId) : [...prev, exampleId],
    )
  }

  const handleWordClick = (word: string) => {
    console.log("Searching for word:", word)
    // 显示搜索反馈
    setSearchQuery(word)
    // 这里会触发搜索功能，可以跳转到搜索结果页或新的单词详情页
    // 例如：router.push(`/word/${word.toLowerCase()}`)
    // 或者：router.push(`/search?q=${encodeURIComponent(word)}`)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-700 border-green-300"
      case "intermediate":
        return "bg-yellow-100 text-yellow-700 border-yellow-300"
      case "advanced":
        return "bg-red-100 text-red-700 border-red-300"
      default:
        return "bg-gray-100 text-gray-700 border-gray-300"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-100">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm shadow-lg px-4 py-4 rounded-b-3xl">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl hover:bg-teal-100">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold truncate max-w-48 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            {wordData.word}
          </h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl hover:bg-teal-100">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-2xl hover:bg-teal-100"
              onClick={() => setIsFavorited(!isFavorited)}
            >
              <Heart className={`w-5 h-5 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* 单词头部信息 */}
        <Card className="overflow-hidden rounded-3xl shadow-xl">
          <CardContent className="p-0">
            <div className="relative">
              <img
                src={wordData.image || "/placeholder.svg"}
                alt={wordData.word}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{wordData.word}</h1>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`w-14 h-14 bg-white/20 hover:bg-white/30 text-white rounded-2xl transform transition-all duration-200 ${
                      playingAudio === "/audio/serendipity.mp3" ? "scale-110 animate-pulse" : "hover:scale-105"
                    }`}
                    onClick={() => playAudio("/audio/serendipity.mp3")}
                  >
                    <Volume2
                      className={`w-6 h-6 ${playingAudio === "/audio/serendipity.mp3" ? "animate-bounce" : ""}`}
                    />
                  </Button>
                </div>
                <p className="text-lg mb-2">{wordData.phonetic}</p>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 rounded-2xl">
                    {wordData.partOfSpeech}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 rounded-2xl">
                    {wordData.level}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 rounded-2xl">
                    {wordData.frequency}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 详细释义 */}
        <Card className="rounded-3xl shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-500" />
                Definitions
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant={selectedLanguage === "en" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLanguage("en")}
                  className="h-8 px-3 rounded-2xl"
                >
                  EN
                </Button>
                <Button
                  variant={selectedLanguage === "zh" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLanguage("zh")}
                  className="h-8 px-3 rounded-2xl"
                >
                  中文
                </Button>
                <Button
                  variant={selectedLanguage === "es" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLanguage("es")}
                  className="h-8 px-3 rounded-2xl"
                >
                  ES
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {wordData.definitions[selectedLanguage as keyof typeof wordData.definitions]?.map((def, index) => (
              <div key={index}>
                <div className="flex items-start gap-2 mb-2">
                  <span className="bg-teal-100 text-teal-600 text-sm font-semibold px-3 py-1 rounded-full min-w-[32px] text-center">
                    {index + 1}
                  </span>
                  <p className="text-gray-900 font-medium flex-1">{def.meaning}</p>
                </div>
                <div className="ml-10 bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-2xl">
                  <p className="text-sm text-gray-700 italic">"{def.example}"</p>
                </div>
                {index < wordData.definitions[selectedLanguage as keyof typeof wordData.definitions].length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 例句卡片式滑动展示 */}
        <Card className="rounded-3xl shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Example Sentences
              <Badge variant="secondary" className="ml-2 rounded-2xl">
                {wordData.examples.length} examples
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="flex gap-4 pb-4">
                {wordData.examples.map((example, index) => (
                  <Card
                    key={example.id}
                    className="min-w-[320px] bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <CardContent className="p-5">
                      {/* 例句头部信息 */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="bg-teal-100 text-teal-600 text-xs font-semibold px-2 py-1 rounded-full">
                            #{index + 1}
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-xs rounded-2xl ${getDifficultyColor(example.difficulty)}`}
                          >
                            {example.difficulty}
                          </Badge>
                        </div>
                        <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 rounded-2xl">
                          {example.category}
                        </Badge>
                      </div>

                      {/* 例句内容 */}
                      <div className="mb-4">
                        <p className="text-gray-900 leading-relaxed mb-3 text-sm">{example.text}</p>
                        <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-2xl">{example.translation}</p>
                      </div>

                      {/* 操作按钮 */}
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-10 px-4 rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transform transition-all duration-200 ${
                              playingAudio === example.audio ? "scale-105 animate-pulse" : "hover:scale-105"
                            }`}
                            onClick={() => playAudio(example.audio)}
                          >
                            <Volume2
                              className={`w-4 h-4 mr-1 ${playingAudio === example.audio ? "animate-bounce" : ""}`}
                            />
                            Play
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-10 px-4 rounded-2xl transform transition-all duration-200 hover:scale-105 ${
                              savedExamples.includes(example.id)
                                ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                            }`}
                            onClick={() => toggleExampleSave(example.id)}
                          >
                            <Bookmark
                              className={`w-4 h-4 mr-1 ${savedExamples.includes(example.id) ? "fill-current" : ""}`}
                            />
                            {savedExamples.includes(example.id) ? "Saved" : "Save"}
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-10 w-10 rounded-2xl hover:bg-gray-100"
                          onClick={() => copyToClipboard(example.text)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">← Swipe to explore more examples →</p>
          </CardContent>
        </Card>

        {/* 词汇关系 - 支持点击搜索 */}
        <Card className="rounded-3xl shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-500" />
              Related Words
              <Badge variant="secondary" className="ml-2 rounded-2xl text-xs">
                Click to search
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-emerald-600 mb-3 flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Synonyms
                <span className="text-xs text-gray-500 ml-2">({wordData.synonyms.length} words)</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {wordData.synonyms.map((synonym, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 border border-emerald-200 hover:border-emerald-300 rounded-2xl px-4 py-2 h-auto transform hover:scale-105 transition-all duration-200 cursor-pointer"
                    onClick={() => handleWordClick(synonym)}
                  >
                    <span className="font-medium">{synonym}</span>
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Antonyms
                <span className="text-xs text-gray-500 ml-2">({wordData.antonyms.length} words)</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {wordData.antonyms.map((antonym, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border border-red-200 hover:border-red-300 rounded-2xl px-4 py-2 h-auto transform hover:scale-105 transition-all duration-200 cursor-pointer"
                    onClick={() => handleWordClick(antonym)}
                  >
                    <span className="font-medium">{antonym}</span>
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-semibold text-teal-600 mb-3 flex items-center gap-1">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                Similar Words
                <span className="text-xs text-gray-500 ml-2">({wordData.similarWords.length} words)</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {wordData.similarWords.map((word, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="bg-teal-50 text-teal-700 hover:bg-teal-100 hover:text-teal-800 border border-teal-200 hover:border-teal-300 rounded-2xl px-4 py-2 h-auto transform hover:scale-105 transition-all duration-200 cursor-pointer"
                    onClick={() => handleWordClick(word)}
                  >
                    <span className="font-medium">{word}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 词根词缀 */}
        <Card className="rounded-3xl shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <TreePine className="w-5 h-5 text-emerald-600" />
              Word Structure & Etymology
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-2xl">
              <h4 className="font-semibold text-emerald-800 mb-2">Word Breakdown</h4>
              <div className="text-sm space-y-1">
                <p>
                  <span className="font-medium">Root:</span> {wordData.wordParts.root}
                </p>
                <p>
                  <span className="font-medium">Suffix:</span> {wordData.wordParts.suffix}
                </p>
                <p>
                  <span className="font-medium">Structure:</span> {wordData.wordParts.breakdown}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-2xl">
              <h4 className="font-semibold text-cyan-800 mb-2">Etymology</h4>
              <div className="text-sm space-y-1">
                <p>
                  <span className="font-medium">Origin:</span> {wordData.etymology.origin}
                </p>
                <p>
                  <span className="font-medium">Source:</span> {wordData.etymology.source}
                </p>
                <p>
                  <span className="font-medium">Background:</span> {wordData.etymology.development}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 底部操作区域 */}
        <div className="grid grid-cols-2 gap-4 pb-6">
          <Button className="h-14 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all duration-200">
            <Play className="w-5 h-5 mr-2" />
            Practice
          </Button>
          <Button
            variant="outline"
            className="h-14 border-3 border-teal-300 text-teal-600 hover:bg-teal-50 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all duration-200"
            onClick={() => setIsFavorited(!isFavorited)}
          >
            <Heart className={`w-5 h-5 mr-2 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
            {isFavorited ? "Saved" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  )
}
