-- ============================================================
-- StudyAce CBSE Platform — Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES TABLE
-- ============================================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  class SMALLINT CHECK (class IN (9, 10, 11, 12)),
  subjects TEXT[] DEFAULT '{}',
  sessions_used INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT FALSE,
  premium_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================
-- PRACTICE SESSIONS TABLE
-- ============================================================
CREATE TABLE public.practice_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  class SMALLINT NOT NULL,
  subject TEXT NOT NULL,
  chapter TEXT NOT NULL,
  chapter_id INTEGER NOT NULL,
  mode TEXT NOT NULL DEFAULT 'quick',
  questions JSONB NOT NULL DEFAULT '[]',
  answers JSONB NOT NULL DEFAULT '{}',
  score INTEGER DEFAULT 0,
  total_marks INTEGER DEFAULT 0,
  time_taken INTEGER DEFAULT 0, -- in seconds
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON public.practice_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON public.practice_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON public.practice_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================
-- QUESTION CACHE TABLE
-- ============================================================
CREATE TABLE public.question_cache (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  class_num SMALLINT NOT NULL,
  subject TEXT NOT NULL,
  chapter_id INTEGER NOT NULL,
  mode TEXT NOT NULL,
  questions JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(class_num, subject, chapter_id, mode)
);

-- Anyone can read the cache (questions are generic, not user-specific)
ALTER TABLE public.question_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read question cache"
  ON public.question_cache FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert cache"
  ON public.question_cache FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- SUBSCRIPTIONS TABLE
-- ============================================================
CREATE TABLE public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  plan TEXT NOT NULL,
  amount INTEGER NOT NULL, -- in paise
  status TEXT NOT NULL DEFAULT 'pending', -- pending, active, expired
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- AUTO-UPDATE updated_at ON PROFILES
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_practice_sessions_user_id ON public.practice_sessions(user_id);
CREATE INDEX idx_practice_sessions_created_at ON public.practice_sessions(created_at DESC);
CREATE INDEX idx_question_cache_lookup ON public.question_cache(class_num, subject, chapter_id, mode);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
