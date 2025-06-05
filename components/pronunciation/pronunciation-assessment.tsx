import { useState, useRef } from 'react'
import * as sdk from 'microsoft-cognitiveservices-speech-sdk'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Mic, Square, Volume2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface PronunciationAssessmentProps {
  word: string
  audioUrl?: string
}

export default function PronunciationAssessment({ word, audioUrl }: PronunciationAssessmentProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<string>("")
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.current = new MediaRecorder(stream)
      audioChunks.current = []

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data)
      }

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' })
        await assessPronunciation(audioBlob)
      }

      mediaRecorder.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop()
      setIsRecording(false)
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop())
    }
  }

  const assessPronunciation = async (audioBlob: Blob) => {
    try {
      // Convert blob to array buffer for Azure Speech SDK
      const arrayBuffer = await audioBlob.arrayBuffer()
      
      // Call Azure Speech Service via Edge Function
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/assess-pronunciation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio: Array.from(new Uint8Array(arrayBuffer)),
          word: word
        })
      })

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      setScore(data.score)
      
      // Generate feedback based on score
      if (data.score >= 80) {
        setFeedback("Excellent pronunciation! Keep it up! 🌟")
      } else if (data.score >= 60) {
        setFeedback("Good pronunciation. Practice a bit more to perfect it! 👍")
      } else {
        setFeedback("Keep practicing! Try listening to the word again and focus on each sound. 💪")
      }

    } catch (error) {
      console.error('Error assessing pronunciation:', error)
      toast({
        title: "Error",
        description: "Failed to assess pronunciation. Please try again.",
        variant: "destructive"
      })
    }
  }

  const playReference = () => {
    if (audioUrl) {
      new Audio(audioUrl).play()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {audioUrl && (
          <Button
            variant="outline"
            size="icon"
            onClick={playReference}
            className="w-12 h-12 rounded-full"
          >
            <Volume2 className="w-6 h-6" />
          </Button>
        )}
        
        <Button
          variant={isRecording ? "destructive" : "default"}
          size="icon"
          onClick={isRecording ? stopRecording : startRecording}
          className="w-12 h-12 rounded-full"
        >
          {isRecording ? (
            <Square className="w-6 h-6" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </Button>
      </div>

      {score !== null && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Pronunciation Score</span>
            <span className="font-medium">{score}%</span>
          </div>
          <Progress value={score} className="h-2" />
          <p className="text-sm text-gray-600 mt-2">{feedback}</p>
        </div>
      )}
    </div>
  )
}