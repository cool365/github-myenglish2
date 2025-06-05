import { createClient } from 'npm:@supabase/supabase-js@2'
import * as sdk from 'npm:microsoft-cognitiveservices-speech-sdk@1.34.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { audio, word } = await req.json()
    
    if (!audio || !word) {
      throw new Error('Audio data and word are required')
    }

    // Convert array back to audio buffer
    const audioBuffer = new Uint8Array(audio).buffer

    // Initialize Speech SDK with Azure credentials
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      Deno.env.get('AZURE_SPEECH_KEY') ?? '',
      Deno.env.get('AZURE_SPEECH_REGION') ?? ''
    )

    // Configure pronunciation assessment
    const pronunciationConfig = new sdk.PronunciationAssessmentConfig(
      word,
      sdk.PronunciationAssessmentGradingSystem.HundredMark,
      sdk.PronunciationAssessmentGranularity.Phoneme
    )

    // Create audio config from the buffer
    const pushStream = sdk.AudioInputStream.createPushStream()
    pushStream.write(audioBuffer)
    pushStream.close()
    const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream)

    // Create pronunciation assessment recognizer
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig)
    pronunciationConfig.applyTo(recognizer)

    // Perform assessment
    const result = await new Promise((resolve, reject) => {
      recognizer.recognizeOnceAsync(
        result => {
          const assessment = sdk.PronunciationAssessment.fromResult(result)
          resolve({
            score: assessment.pronunciationScore,
            phonemes: assessment.phonemeAssessment
          })
        },
        error => reject(error)
      )
    })

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})