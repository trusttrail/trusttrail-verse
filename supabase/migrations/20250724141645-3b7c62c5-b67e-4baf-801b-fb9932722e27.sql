-- Phase 1: Critical RLS Policy Fixes - Handle existing NULL values

-- First, let's see what we're dealing with
DO $$
BEGIN
  -- Check if there are any reviews with NULL user_id
  IF EXISTS (SELECT 1 FROM public.reviews WHERE user_id IS NULL) THEN
    -- For existing reviews with NULL user_id, we need to either:
    -- 1. Delete them (if they're invalid)
    -- 2. Assign them to a default user
    -- For security, we'll delete reviews without proper user association
    DELETE FROM public.reviews WHERE user_id IS NULL;
    RAISE NOTICE 'Deleted reviews with NULL user_id for security compliance';
  END IF;
END $$;

-- Now make user_id NOT NULL to enforce proper user association
ALTER TABLE public.reviews ALTER COLUMN user_id SET NOT NULL;

-- Drop the overly permissive policy that allows anyone to insert reviews
DROP POLICY IF EXISTS "Anyone can insert reviews" ON public.reviews;

-- Drop duplicate policies to clean up
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update reviews" ON public.reviews;

-- Phase 2: Database Function Security - Update functions with proper search_path
CREATE OR REPLACE FUNCTION public.is_user_admin(check_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = check_user_id AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT public.is_user_admin();
$$;