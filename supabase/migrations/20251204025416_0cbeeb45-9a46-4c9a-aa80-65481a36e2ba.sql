
-- Add bio column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;

-- Create challenges table
CREATE TABLE public.challenges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  total_days integer NOT NULL DEFAULT 7,
  icon text DEFAULT 'Trophy',
  reward_xp integer DEFAULT 100,
  reward_badge text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Enable RLS on challenges
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- Anyone can view active challenges
CREATE POLICY "Anyone can view active challenges"
ON public.challenges
FOR SELECT
USING (is_active = true);

-- Specialists and admins can create challenges
CREATE POLICY "Specialists can create challenges"
ON public.challenges
FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'specialist') OR has_role(auth.uid(), 'admin')
);

-- Specialists can update their own challenges
CREATE POLICY "Specialists can update own challenges"
ON public.challenges
FOR UPDATE
USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'));

-- Only admins can delete challenges
CREATE POLICY "Only admins can delete challenges"
ON public.challenges
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Create user_challenges table for tracking user progress
CREATE TABLE public.user_challenges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id uuid NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  current_day integer DEFAULT 0,
  progress integer DEFAULT 0,
  started_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone,
  daily_tasks jsonb DEFAULT '[]'::jsonb,
  UNIQUE(user_id, challenge_id)
);

-- Enable RLS on user_challenges
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;

-- Users can view their own challenges
CREATE POLICY "Users can view own challenges"
ON public.user_challenges
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own challenges
CREATE POLICY "Users can start challenges"
ON public.user_challenges
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own challenges
CREATE POLICY "Users can update own challenges"
ON public.user_challenges
FOR UPDATE
USING (auth.uid() = user_id);

-- Specialists can view all user challenges for management
CREATE POLICY "Specialists can view all user challenges"
ON public.user_challenges
FOR SELECT
USING (has_role(auth.uid(), 'specialist') OR has_role(auth.uid(), 'admin'));
