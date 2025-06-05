import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DictionaryResponse {
  word: string
  phonetic: string
  meanings: {
    partOfSpeech: string
    definitions: {
      definition: string
      example?: string
    }[]
  }[]
  phonetics: {
    audio?: string
    text?: string
  }[]
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { word } = await req.json()
    if (!word) {
      throw new Error('Word is required')
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check if word exists in cache
    const { data: existingWord } = await supabase
      .from('words')
      .select('*')
      .eq('word', word.toLowerCase())
      .single()

    if (existingWord) {
      // Return cached data
      return new Response(
        JSON.stringify(existingWord),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch from Dictionary API
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`)
    const data: DictionaryResponse[] = await response.json()

    if (!data || !data[0]) {
      throw new Error('Word not found')
    }

    const wordData = data[0]
    const meaning = wordData.meanings[0]

    // Determine difficulty level based on word length and definition complexity
    let difficultyLevel = 'beginner'
    if (word.length > 8 || meaning.definitions[0].definition.length > 100) {
      difficultyLevel = 'advanced'
    } else if (word.length > 6 || meaning.definitions[0].definition.length > 50) {
      difficultyLevel = 'intermediate'
    }

    // Insert word into database
    const { data: newWord, error: insertError } = await supabase
      .from('words')
      .insert({
        word: wordData.word.toLowerCase(),
        phonetic: wordData.phonetic || wordData.phonetics.find(p => p.text)?.text || '',
        definition: meaning.definitions[0].definition,
        part_of_speech: meaning.partOfSpeech,
        difficulty_level: difficultyLevel,
      })
      .select()
      .single()

    if (insertError) throw insertError

    // Insert examples if available
    const examples = meaning.definitions
      .filter(def => def.example)
      .map(def => ({
        word_id: newWord.id,
        example_text: def.example!,
        translation: '', // Could be filled by translation API in the future
      }))

    if (examples.length > 0) {
      await supabase.from('word_examples').insert(examples)
    }

    // Insert audio if available
    const audioUrls = wordData.phonetics
      .filter(p => p.audio)
      .map(p => ({
        word_id: newWord.id,
        audio_url: p.audio!,
        accent: p.audio!.includes('us') ? 'us' : p.audio!.includes('uk') ? 'uk' : 'au',
      }))

    if (audioUrls.length > 0) {
      await supabase.from('word_audio').insert(audioUrls)
    }

    return new Response(
      JSON.stringify(newWord),
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