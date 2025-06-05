"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import {
  Calendar,
  Trophy,
  Flame,
  BookOpen,
  Clock,
  Settings,
  ChevronRight,
  Home,
  BookHeart,
  User,
  Star,
  BarChart3,
  CheckCircle2,
  Share2,
  HelpCircle,
  LogOut,
  Bell,
  Edit,
  ArrowLeft,
} from "lucide-react"

export default function ProfilePage() {
  const userData = {
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    level: 12,
    xp: 2450,
    nextLevelXp: 3000,
    joinDate: "2023-09-15",
    premium: true,
  }

  const learningStats = {
    totalDays: 87,
    streak: 14,
    longestStreak: 21,
    totalWords: 642,
    masteredWords: 418,
    todayMinutes: 28,
    weekMinutes: 145,
    totalMinutes: 1840,
    todayWords: 12,
    weekWords: 65,
  }

  const achievements = [
    {
      id: 1,
      name: "Word Master",
      description: "Learn 500 words",
      icon: BookOpen,
      progress: 100,
      completed: true,
    },
    {
      id: 2,
      name: "Dedication",
      description: "14-day learning streak",
      icon: Flame,
      progress: 100,
      completed: true,
    },
    {
      id: 3,
      name: "Time Keeper",
      description: "Study for 30 hours",
      icon: Clock,
      progress: Math.round((learningStats.totalMinutes / (30 * 60)) * 100),
      completed: false,
    },
    {
      id: 4,
      name: "Perfect Week",
      description: "Complete all daily goals for a week",
      icon: CheckCircle2,
      progress: 85,
      completed: false,
    },
  ]

  const weeklyData = [
    { day: "Mon", words: 5 },
    { day: "Tue", words: 3 },
    { day: "Wed", words: 4 },
    { day: "Thu", words: 6 },
    { day: "Fri", words: 2 },
    { day: "Sat", words: 3 },
    { day: "Sun", words: 0 },
  ]

  const checkInData = [
    [0, 0, 1, 1, 1, 0, 1],
    [1, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 2],
  ]

  const settingsOptions = [
    { icon: Bell, label: "Notifications", badge: "5" },
    { icon: Settings, label: "App Settings" },
    { icon: HelpCircle, label: "Help & Support" },
    { icon: Share2, label: "Share App" },
    { icon: LogOut, label: "Sign Out", danger: true },
  ]

  const renderCheckInCalendar = () => {
    const weekdays = ["M", "T", "W", "T", "F", "S", "S"]

    return (
      <div className="space-y-2">
        <div className="flex justify-between px-1">
          {weekdays.map((day, i) => (
            <div key={i} className="w-8 text-center text-xs text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {checkInData.map((week, weekIndex) => (
          <div key={weekIndex} className="flex justify-between">
            {week.map((day, dayIndex) => {
              let bgColor = "bg-gray-200"
              let textColor = "text-gray-400"

              if (day === 1) {
                bgColor = "bg-emerald-500"
                textColor = "text-white"
              } else if (day === 2) {
                bgColor = "bg-teal-500"
                textColor = "text-white"
              }

              return (
                <div
                  key={dayIndex}
                  className={`w-8 h-8 rounded-2xl flex items-center justify-center ${bgColor} ${textColor} text-xs shadow-sm`}
                >
                  {day === 2 && <CheckCircle2 className="w-4 h-4" />}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-100 pb-24">
      {/* Header */}
      <div className="bg-white shadow-lg px-6 py-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-2">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-teal-100">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Profile
          </h1>
          <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-teal-100" asChild>
            <Link href="/settings">
              <Settings className="w-5 h-5" />
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <Avatar className="w-20 h-20 border-4 border-teal-200 shadow-lg">
              <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
              <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white text-xl">
                {userData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="secondary"
              size="icon"
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-2xl bg-teal-500 text-white hover:bg-teal-600 shadow-lg"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-900">{userData.name}</h2>
              {userData.premium && (
                <Badge className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white border-0 rounded-2xl">
                  <Star className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
            <p className="text-gray-600 text-sm mb-2">{userData.email}</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-teal-100 text-teal-700 rounded-2xl">
                Level {userData.level}
              </Badge>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 rounded-2xl">
                {userData.xp} XP
              </Badge>
            </div>
          </div>
        </div>

        {/* 等级进度条 */}
        <div className="mb-2">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Level Progress</span>
            <span>
              {userData.xp}/{userData.nextLevelXp} XP
            </span>
          </div>
          <Progress value={(userData.xp / userData.nextLevelXp) * 100} className="h-3 rounded-2xl" />
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* 学习概览卡片 */}
        <Card className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white overflow-hidden rounded-3xl shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold mb-1">Learning Streak 🔥</h3>
                <p className="text-teal-100">Keep up the amazing work!</p>
              </div>
              <div className="bg-white/20 p-3 rounded-3xl">
                <Flame className="w-6 h-6" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="text-3xl font-bold">{learningStats.totalDays}</div>
                <div className="text-sm text-teal-100">Total Days</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold">{learningStats.streak}</div>
                <div className="text-sm text-teal-100">Current Streak</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold">{learningStats.longestStreak}</div>
                <div className="text-sm text-teal-100">Longest Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 学习统计 */}
        <Card className="rounded-3xl shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-teal-500" />
              Learning Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 单词统计 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-700">Vocabulary 📚</h4>
                <Badge variant="outline" className="text-teal-600 rounded-2xl">
                  <BookOpen className="w-3 h-3 mr-1" />
                  Words
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{learningStats.totalWords}</div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">{learningStats.masteredWords}</div>
                  <div className="text-xs text-gray-600">Mastered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">{learningStats.todayWords}</div>
                  <div className="text-xs text-gray-600">Today</div>
                </div>
              </div>
            </div>

            {/* 时间统计 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-700">Study Time ⏰</h4>
                <Badge variant="outline" className="text-purple-600 rounded-2xl">
                  <Clock className="w-3 h-3 mr-1" />
                  Minutes
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{learningStats.totalMinutes}</div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{learningStats.weekMinutes}</div>
                  <div className="text-xs text-gray-600">This Week</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{learningStats.todayMinutes}</div>
                  <div className="text-xs text-gray-600">Today</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 打卡记录 */}
        <Card className="rounded-3xl shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-500" />
              Check-in Calendar 📅
            </CardTitle>
          </CardHeader>
          <CardContent>{renderCheckInCalendar()}</CardContent>
        </Card>

        {/* 成就和徽章 */}
        <Card className="rounded-3xl shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Achievements 🏆
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements.map((achievement) => {
                const Icon = achievement.icon
                return (
                  <div key={achievement.id} className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-3xl flex items-center justify-center shadow-lg ${
                        achievement.completed ? "bg-gradient-to-br from-yellow-400 to-amber-500" : "bg-gray-200"
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${achievement.completed ? "text-white" : "text-gray-500"}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-medium ${achievement.completed ? "text-gray-900" : "text-gray-600"}`}>
                          {achievement.name}
                        </h4>
                        <span className="text-sm text-gray-500">{achievement.progress}%</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">{achievement.description}</p>
                      <Progress value={achievement.progress} className="h-2 rounded-2xl" />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* 设置选项 */}
        <Card className="rounded-3xl shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-500" />
              Settings & Support ⚙️
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {settingsOptions.map((option, index) => (
                <Link
                  href={
                    option.label === "Sign Out"
                      ? "/logout"
                      : `/settings/${option.label.toLowerCase().replace(/\s+/g, "-")}`
                  }
                  key={index}
                >
                  <div
                    className={`flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors duration-200 ${
                      option.danger ? "text-red-600" : "text-gray-900"
                    } ${index === 0 ? "rounded-t-3xl" : ""} ${index === settingsOptions.length - 1 ? "rounded-b-3xl" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <option.icon className={`w-5 h-5 ${option.danger ? "text-red-500" : "text-gray-500"}`} />
                      <span>{option.label}</span>
                    </div>
                    <div className="flex items-center">
                      {option.badge && <Badge className="bg-red-500 text-white mr-2 rounded-2xl">{option.badge}</Badge>}
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 加入时间 */}
        <div className="text-center text-sm text-gray-500">
          Member since {new Date(userData.joinDate).toLocaleDateString()} ✨
        </div>
      </div>

      {/* 底部导航栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 rounded-t-3xl shadow-2xl">
        <div className="flex justify-around items-center">
          <Link href="/">
            <Button variant="ghost" className="flex-col gap-2 h-16 px-6 rounded-3xl text-gray-500 hover:text-gray-700">
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
            <Button variant="ghost" className="flex-col gap-2 h-16 px-6 rounded-3xl bg-teal-100 text-teal-600">
              <User className="w-7 h-7" />
              <span className="text-sm font-medium">Profile</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
