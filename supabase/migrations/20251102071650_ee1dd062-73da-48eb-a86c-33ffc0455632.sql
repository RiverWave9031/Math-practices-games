-- Add columns to profiles table for storing user game statistics
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS xp integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS streak integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS play_history jsonb DEFAULT '[]'::jsonb;

-- Create an index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_xp ON public.profiles(xp DESC);