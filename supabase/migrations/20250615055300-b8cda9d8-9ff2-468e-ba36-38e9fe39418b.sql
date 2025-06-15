
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow wallet address verification" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Create the correct RLS policies for wallet verification
-- Policy to allow users to view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT 
  USING (auth.uid() = id);

-- Policy to allow authenticated users to query wallet addresses for verification
-- This is needed for the wallet checking functionality
CREATE POLICY "Allow wallet address verification" ON public.profiles
  FOR SELECT 
  USING (wallet_address IS NOT NULL);

-- Policy to allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE 
  USING (auth.uid() = id);

-- Policy to allow users to insert their own profile (handled by trigger but needed for explicit inserts)
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = id);
