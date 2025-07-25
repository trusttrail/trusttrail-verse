-- Create wallet profiles table for wallet-only users
CREATE TABLE IF NOT EXISTS public.wallet_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on wallet_profiles
ALTER TABLE public.wallet_profiles ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create wallet profiles (needed for wallet-only registration)
CREATE POLICY "Anyone can create wallet profiles" 
ON public.wallet_profiles 
FOR INSERT 
WITH CHECK (true);

-- Allow users to view wallet profiles by wallet address
CREATE POLICY "Anyone can view wallet profiles" 
ON public.wallet_profiles 
FOR SELECT 
USING (true);

-- Update reviews table to allow wallet-based user IDs
-- Add a new column to link reviews to wallet profiles
ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS wallet_profile_id UUID REFERENCES public.wallet_profiles(id);

-- Create updated RLS policy for reviews that supports both auth users and wallet users
DROP POLICY IF EXISTS "Users can create reviews" ON public.reviews;
CREATE POLICY "Users can create reviews - enhanced" 
ON public.reviews 
FOR INSERT 
WITH CHECK (
  -- Either authenticated user creating their own review
  (auth.uid() = user_id) 
  OR 
  -- Or wallet user creating review (user_id can be any value for wallet users)
  (wallet_profile_id IS NOT NULL)
);

-- Update view policy to support wallet users
DROP POLICY IF EXISTS "Users can view their own reviews" ON public.reviews;
CREATE POLICY "Users can view reviews - enhanced" 
ON public.reviews 
FOR SELECT 
USING (
  -- Authenticated users can see their own reviews
  (auth.uid() = user_id)
  OR
  -- Anyone can see approved reviews
  (status = 'approved'::review_status)
  OR
  -- Wallet users can see reviews via wallet address
  (wallet_address IS NOT NULL)
);

-- Create trigger for updated_at on wallet_profiles
CREATE TRIGGER update_wallet_profiles_updated_at
BEFORE UPDATE ON public.wallet_profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();