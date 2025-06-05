/*
  # Initial Schema Setup for English Learning App

  1. New Tables
    - words
      - Stores English words with their definitions, phonetics, and examples
    - user_words
      - Links users to their saved words and tracks learning progress
    - learning_sessions
      - Records user's learning sessions and progress
    - word_examples
      - Stores example sentences for words
    - word_audio
      - Stores audio file URLs for word pronunciations

  2. Security
    - Enable RLS on all tables
    - Add policies for user access control
    - Secure user data isolation
*/

-- Create words table
CREATE TABLE IF NOT EXISTS words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  word text NOT NULL UNIQUE,
  phonetic text,
  definition text NOT NULL,
  part_of_speech text,
  difficulty_level text CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  frequency_rank integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create word_examples table
CREATE TABLE IF NOT EXISTS word_examples (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  word_id uuid REFERENCES words(id) ON DELETE CASCADE,
  example_text text NOT NULL,
  translation text,
  created_at timestamptz DEFAULT now()
);

-- Create word_audio table
CREATE TABLE IF NOT EXISTS word_audio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  word_id uuid REFERENCES words(id) ON DELETE CASCADE,
  audio_url text NOT NULL,
  accent text CHECK (accent IN ('us', 'uk', 'au')),
  created_at timestamptz DEFAULT now()
);

-- Create user_words table (for saved words and progress)
CREATE TABLE IF NOT EXISTS user_words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  word_id uuid REFERENCES words(id) ON DELETE CASCADE,
  mastery_level integer DEFAULT 0 CHECK (mastery_level BETWEEN 0 AND 5),
  next_review_date timestamptz,
  last_reviewed_at timestamptz,
  review_count integer DEFAULT 0,
  is_favorited boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, word_id)
);

-- Create learning_sessions table
CREATE TABLE IF NOT EXISTS learning_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  words_reviewed integer DEFAULT 0,
  correct_answers integer DEFAULT 0,
  session_type text CHECK (session_type IN ('review', 'learn', 'practice')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE words ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_examples ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_audio ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Words table (public read access)
CREATE POLICY "Words are viewable by everyone" ON words
  FOR SELECT USING (true);

-- Word examples (public read access)
CREATE POLICY "Examples are viewable by everyone" ON word_examples
  FOR SELECT USING (true);

-- Word audio (public read access)
CREATE POLICY "Audio is accessible by everyone" ON word_audio
  FOR SELECT USING (true);

-- User words policies
CREATE POLICY "Users can view their own saved words" ON user_words
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own words" ON user_words
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own words" ON user_words
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own words" ON user_words
  FOR DELETE USING (auth.uid() = user_id);

-- Learning sessions policies
CREATE POLICY "Users can view their own learning sessions" ON learning_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own learning sessions" ON learning_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own learning sessions" ON learning_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_words_word ON words(word);
CREATE INDEX IF NOT EXISTS idx_user_words_user_id ON user_words(user_id);
CREATE INDEX IF NOT EXISTS idx_user_words_next_review ON user_words(next_review_date);
CREATE INDEX IF NOT EXISTS idx_word_examples_word_id ON word_examples(word_id);
CREATE INDEX IF NOT EXISTS idx_word_audio_word_id ON word_audio(word_id);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_user_id ON learning_sessions(user_id);

-- Create functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_user_words_updated_at
  BEFORE UPDATE ON user_words
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_words_updated_at
  BEFORE UPDATE ON words
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();