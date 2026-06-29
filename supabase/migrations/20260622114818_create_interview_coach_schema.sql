/*
# AI Interview Coach - Core Schema

Creates the multi-user schema for the AI Interview Coach app.

1. New Tables
- `profiles` — extends auth.users with display name, avatar, streak, totals
- `resumes` — uploaded resume metadata + AI analysis JSON
- `interviews` — interview config (role, difficulty, type, duration) + status + final report
- `interview_messages` — the transcript of the conversation (ai/user turns)
- `interview_scores` — per-category scores for a finished interview
- `achievements` — definition of unlockable badges
- `user_achievements` — which achievements a user has unlocked
- `skills` — skill name + a user's progress percentage

2. Relationships
- profiles.id -> auth.users.id (1:1)
- resumes.user_id -> auth.users.id
- interviews.user_id -> auth.users.id
- interviews.resume_id -> resumes.id (nullable)
- interview_messages.interview_id -> interviews.id
- interview_scores.interview_id -> interviews.id
- user_achievements.user_id -> auth.users.id, achievement_id -> achievements.id
- skills.user_id -> auth.users.id

3. Security
- RLS enabled on every table.
- Owner-scoped CRUD (4 policies each) for profiles, resumes, interviews,
  interview_messages, interview_scores, skills, user_achievements.
- achievements (badge definitions) are read-only for authenticated users.

4. Notes
- user_id columns default to auth.uid() so client inserts that omit it still pass RLS.
- Timestamps default to now().
*/

-- profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  target_role text,
  daily_streak int NOT NULL DEFAULT 0,
  last_practice_date date,
  total_interviews int NOT NULL DEFAULT 0,
  avg_score numeric(5,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profiles" ON profiles;
CREATE POLICY "select_own_profiles" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);
DROP POLICY IF EXISTS "insert_own_profiles" ON profiles;
CREATE POLICY "insert_own_profiles" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "update_own_profiles" ON profiles;
CREATE POLICY "update_own_profiles" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "delete_own_profiles" ON profiles;
CREATE POLICY "delete_own_profiles" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- resumes
CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text,
  analysis jsonb,
  ats_score int,
  resume_score int,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_resumes" ON resumes;
CREATE POLICY "select_own_resumes" ON resumes FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_resumes" ON resumes;
CREATE POLICY "insert_own_resumes" ON resumes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_resumes" ON resumes;
CREATE POLICY "update_own_resumes" ON resumes FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_resumes" ON resumes;
CREATE POLICY "delete_own_resumes" ON resumes FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- interviews
CREATE TABLE IF NOT EXISTS interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id uuid REFERENCES resumes(id) ON DELETE SET NULL,
  role text NOT NULL,
  difficulty text NOT NULL DEFAULT 'medium',
  experience text NOT NULL DEFAULT 'fresher',
  interview_type text NOT NULL DEFAULT 'mixed',
  duration_minutes int NOT NULL DEFAULT 30,
  status text NOT NULL DEFAULT 'in_progress',
  overall_score int,
  technical_score int,
  hr_score int,
  communication_score int,
  confidence_score int,
  report jsonb,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_interviews" ON interviews;
CREATE POLICY "select_own_interviews" ON interviews FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_interviews" ON interviews;
CREATE POLICY "insert_own_interviews" ON interviews FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_interviews" ON interviews;
CREATE POLICY "update_own_interviews" ON interviews FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_interviews" ON interviews;
CREATE POLICY "delete_own_interviews" ON interviews FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- interview_messages
CREATE TABLE IF NOT EXISTS interview_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id uuid NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  role text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE interview_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_messages" ON interview_messages;
CREATE POLICY "select_own_messages" ON interview_messages FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM interviews WHERE interviews.id = interview_messages.interview_id AND interviews.user_id = auth.uid())
  );
DROP POLICY IF EXISTS "insert_own_messages" ON interview_messages;
CREATE POLICY "insert_own_messages" ON interview_messages FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM interviews WHERE interviews.id = interview_messages.interview_id AND interviews.user_id = auth.uid())
  );
DROP POLICY IF EXISTS "update_own_messages" ON interview_messages;
CREATE POLICY "update_own_messages" ON interview_messages FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM interviews WHERE interviews.id = interview_messages.interview_id AND interviews.user_id = auth.uid())
  );
DROP POLICY IF EXISTS "delete_own_messages" ON interview_messages;
CREATE POLICY "delete_own_messages" ON interview_messages FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM interviews WHERE interviews.id = interview_messages.interview_id AND interviews.user_id = auth.uid())
  );

-- interview_scores
CREATE TABLE IF NOT EXISTS interview_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id uuid NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  category text NOT NULL,
  score int NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE interview_scores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_scores" ON interview_scores;
CREATE POLICY "select_own_scores" ON interview_scores FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM interviews WHERE interviews.id = interview_scores.interview_id AND interviews.user_id = auth.uid())
  );
DROP POLICY IF EXISTS "insert_own_scores" ON interview_scores;
CREATE POLICY "insert_own_scores" ON interview_scores FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM interviews WHERE interviews.id = interview_scores.interview_id AND interviews.user_id = auth.uid())
  );
DROP POLICY IF EXISTS "update_own_scores" ON interview_scores;
CREATE POLICY "update_own_scores" ON interview_scores FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM interviews WHERE interviews.id = interview_scores.interview_id AND interviews.user_id = auth.uid())
  );
DROP POLICY IF EXISTS "delete_own_scores" ON interview_scores;
CREATE POLICY "delete_own_scores" ON interview_scores FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM interviews WHERE interviews.id = interview_scores.interview_id AND interviews.user_id = auth.uid())
  );

-- achievements (badge definitions, read-only for users)
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read_achievements" ON achievements;
CREATE POLICY "read_achievements" ON achievements FOR SELECT
  TO authenticated USING (true);

-- user_achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at timestamptz DEFAULT now(),
  UNIQUE (user_id, achievement_id)
);
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_user_achievements" ON user_achievements;
CREATE POLICY "select_own_user_achievements" ON user_achievements FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_user_achievements" ON user_achievements;
CREATE POLICY "insert_own_user_achievements" ON user_achievements FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_user_achievements" ON user_achievements;
CREATE POLICY "update_own_user_achievements" ON user_achievements FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_user_achievements" ON user_achievements;
CREATE POLICY "delete_own_user_achievements" ON user_achievements FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- skills (per-user skill progress)
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  progress int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id, name)
);
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_skills" ON skills;
CREATE POLICY "select_own_skills" ON skills FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_skills" ON skills;
CREATE POLICY "insert_own_skills" ON skills FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_skills" ON skills;
CREATE POLICY "update_own_skills" ON skills FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_skills" ON skills;
CREATE POLICY "delete_own_skills" ON skills FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- indexes
CREATE INDEX IF NOT EXISTS idx_interviews_user_id ON interviews(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_messages_interview_id ON interview_messages(interview_id);
CREATE INDEX IF NOT EXISTS idx_interview_scores_interview_id ON interview_scores(interview_id);
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_user_id ON skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
