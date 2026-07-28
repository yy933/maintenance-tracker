-- ==========================================
-- 1. Create user_profiles table
-- ==========================================
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('user', 'admin')) DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on user_profiles 
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 2. Create Trigger Function for auto sync user_profiles
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New user'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

--  Enable Trigger on auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 3. Create repair_tickets table
-- ==========================================
CREATE TABLE public.repair_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on repair_tickets 
ALTER TABLE public.repair_tickets ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 4. Create RLS policies for user_profiles 
-- ==========================================
-- Allow authenticated users to read all profiles
CREATE POLICY "Allow authenticated users to read all profiles"
  ON public.user_profiles FOR SELECT
  TO authenticated
  USING (true);

-- ==========================================
-- 5. Create RLS policies for repair_tickets 
-- ==========================================

-- 5-1. SELECT policy (SELECT)
-- user can only view their own tickets, while admin can view all tickets
CREATE POLICY "Users can view own tickets, Admins view all"
  ON public.repair_tickets FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR 
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 5-2. INSERT policy (INSERT)
-- Authenticated users can only create tickets for themselves
CREATE POLICY "Users can create tickets for themselves"
  ON public.repair_tickets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 5-3. UPDATE policy (UPDATE)
-- user can only update their own pending tickets
-- admin can update any tickets with any status
CREATE POLICY "Users update own pending tickets, Admins update any"
  ON public.repair_tickets FOR UPDATE
  TO authenticated
  USING (
    (auth.uid() = user_id AND status = 'pending')
    OR
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 5-4. DELETE policy (DELETE)
-- User can only delete their own tickets, while admin can delete any
CREATE POLICY "Users delete own tickets, Admins delete any"
  ON public.repair_tickets FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR 
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );