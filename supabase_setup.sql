-- ============================================================
-- FITNEXA AI — Supabase Database Setup & Seed Data
-- Run this SQL in your Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Create the profiles table (id defaults to random UUID if not provided)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  age_range TEXT,
  height_cm INTEGER,
  weight_kg INTEGER,
  goal TEXT,
  experience TEXT CHECK (experience IN ('beginner', 'intermediate', 'advanced')),
  workout_frequency TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safely remove strict foreign-key restriction if it existed previously
-- This allows you to add sample/test users while keeping real auth signups functional
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Authenticated users can view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- (Optional) If you want all athletes to view community profiles, uncomment below:
-- DROP POLICY IF EXISTS "Allow public read of profiles" ON public.profiles;
-- CREATE POLICY "Allow public read of profiles" ON public.profiles FOR SELECT USING (true);

-- 4. Policy: Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 5. Policy: Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- 6. Trigger: Auto-create a profile row when a new user signs up via Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- 7. RANDOM SAMPLE ATHLETES (SEED DATA)
-- You can edit any values, change names, or add more rows below!
-- Re-running this query will safely update existing records without errors.
-- ============================================================

INSERT INTO public.profiles (
  id,
  full_name,
  gender,
  age_range,
  height_cm,
  weight_kg,
  goal,
  experience,
  workout_frequency,
  onboarding_completed,
  created_at,
  updated_at
) VALUES
  (
    'a1000000-0000-0000-0000-000000000001',
    'Marcus Vance',
    'male',
    '21-29',
    185,
    88,
    'gain_muscle',
    'advanced',
    '5-6 days/week',
    TRUE,
    NOW() - INTERVAL '12 days',
    NOW()
  ),
  (
    'a1000000-0000-0000-0000-000000000002',
    'Elena Rostova',
    'female',
    '21-29',
    168,
    58,
    'lose_weight',
    'intermediate',
    '3-4 days/week',
    TRUE,
    NOW() - INTERVAL '10 days',
    NOW()
  ),
  (
    'a1000000-0000-0000-0000-000000000003',
    'David Chen',
    'male',
    '30-39',
    176,
    74,
    'stay_fit',
    'intermediate',
    '3-4 days/week',
    TRUE,
    NOW() - INTERVAL '9 days',
    NOW()
  ),
  (
    'a1000000-0000-0000-0000-000000000004',
    'Sarah Jenkins',
    'female',
    '16-20',
    162,
    52,
    'endurance',
    'beginner',
    '1-2 days/week',
    TRUE,
    NOW() - INTERVAL '8 days',
    NOW()
  ),
  (
    'a1000000-0000-0000-0000-000000000005',
    'Tyler Brooks',
    'male',
    '21-29',
    192,
    96,
    'gain_weight',
    'advanced',
    'Everyday',
    TRUE,
    NOW() - INTERVAL '7 days',
    NOW()
  ),
  (
    'a1000000-0000-0000-0000-000000000006',
    'Priya Sharma',
    'female',
    '30-39',
    165,
    61,
    'flexibility',
    'beginner',
    '3-4 days/week',
    TRUE,
    NOW() - INTERVAL '6 days',
    NOW()
  ),
  (
    'a1000000-0000-0000-0000-000000000007',
    'Liam O''Connor',
    'male',
    '40-49',
    180,
    83,
    'stay_fit',
    'intermediate',
    '3-4 days/week',
    TRUE,
    NOW() - INTERVAL '5 days',
    NOW()
  ),
  (
    'a1000000-0000-0000-0000-000000000008',
    'Maya Lin',
    'female',
    '21-29',
    170,
    64,
    'gain_muscle',
    'intermediate',
    '5-6 days/week',
    TRUE,
    NOW() - INTERVAL '4 days',
    NOW()
  ),
  (
    'a1000000-0000-0000-0000-000000000009',
    'Jordan Taylor',
    'other',
    '21-29',
    174,
    69,
    'endurance',
    'advanced',
    '5-6 days/week',
    TRUE,
    NOW() - INTERVAL '3 days',
    NOW()
  ),
  (
    'a1000000-0000-0000-0000-000000000010',
    'Carlos Mendez',
    'male',
    '30-39',
    178,
    86,
    'lose_weight',
    'beginner',
    '3-4 days/week',
    TRUE,
    NOW() - INTERVAL '3 days',
    NOW()
  ),
  (
    'a1000000-0000-0000-0000-000000000011',
    'Emma Watson',
    'female',
    '16-20',
    166,
    55,
    'stay_fit',
    'beginner',
    '1-2 days/week',
    TRUE,
    NOW() - INTERVAL '2 days',
    NOW()
  ),
  (
    'a1000000-0000-0000-0000-000000000012',
    'Alexander Wright',
    'male',
    '50-59',
    183,
    89,
    'stay_fit',
    'intermediate',
    '3-4 days/week',
    TRUE,
    NOW() - INTERVAL '1 day',
    NOW()
  ),
  (
    'a1000000-0000-0000-0000-000000000013',
    'Sophia Kowalski',
    'female',
    '21-29',
    172,
    63,
    'gain_muscle',
    'advanced',
    '5-6 days/week',
    TRUE,
    NOW() - INTERVAL '18 hours',
    NOW()
  ),
  (
    'a1000000-0000-0000-0000-000000000014',
    'Noah Patel',
    'male',
    '21-29',
    175,
    70,
    'gain_muscle',
    'intermediate',
    '3-4 days/week',
    TRUE,
    NOW() - INTERVAL '8 hours',
    NOW()
  ),
  (
    'a1000000-0000-0000-0000-000000000015',
    'Chloe Dubois',
    'female',
    '30-39',
    160,
    54,
    'flexibility',
    'intermediate',
    '3-4 days/week',
    TRUE,
    NOW() - INTERVAL '2 hours',
    NOW()
  )
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  gender = EXCLUDED.gender,
  age_range = EXCLUDED.age_range,
  height_cm = EXCLUDED.height_cm,
  weight_kg = EXCLUDED.weight_kg,
  goal = EXCLUDED.goal,
  experience = EXCLUDED.experience,
  workout_frequency = EXCLUDED.workout_frequency,
  onboarding_completed = EXCLUDED.onboarding_completed,
  updated_at = NOW();

-- Check and display the inserted athletes
SELECT 
  id,
  full_name,
  gender,
  age_range,
  height_cm,
  weight_kg,
  goal,
  experience,
  workout_frequency,
  onboarding_completed
FROM public.profiles
ORDER BY created_at DESC;
