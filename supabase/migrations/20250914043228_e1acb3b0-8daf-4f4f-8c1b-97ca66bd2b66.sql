-- CRITICAL SECURITY FIX: Prevent wallet address exposure (Fixed version)
-- Handle existing policies properly

-- Fix wallet_profiles policies
DROP POLICY IF EXISTS "Secure wallet profile access" ON public.wallet_profiles;
DROP POLICY IF EXISTS "Restrict wallet profile access" ON public.wallet_profiles;

-- Create restrictive policy that denies direct access
CREATE POLICY "Deny direct wallet access" 
ON public.wallet_profiles 
FOR SELECT 
USING (false);  -- Default deny all direct access

-- Fix profiles table wallet exposure
DROP POLICY IF EXISTS "Allow wallet address verification" ON public.profiles;
DROP POLICY IF EXISTS "Secure wallet verification" ON public.profiles;

-- Replace with secure policy for profiles
CREATE POLICY "Secure profile wallet access" 
ON public.profiles 
FOR SELECT 
USING (
  -- Only profile owner or admin can see wallet addresses
  (auth.uid() = id) OR is_admin()
);

-- Create audit logs table for security monitoring
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  user_id UUID DEFAULT auth.uid(),
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for audit logs (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'audit_logs' 
    AND policyname = 'Admins can view audit logs'
  ) THEN
    CREATE POLICY "Admins can view audit logs" 
    ON public.audit_logs 
    FOR SELECT 
    USING (is_admin());
  END IF;
END $$;

-- Create secure wallet lookup function
CREATE OR REPLACE FUNCTION public.secure_wallet_lookup(target_address TEXT)
RETURNS TABLE(profile_id UUID, wallet_addr TEXT) AS $$
DECLARE
  sanitized_address TEXT;
BEGIN
  -- Validate and sanitize input
  IF target_address IS NULL OR LENGTH(TRIM(target_address)) = 0 THEN
    RETURN;
  END IF;
  
  sanitized_address := LOWER(TRIM(target_address));
  
  -- Validate Ethereum address format
  IF NOT (sanitized_address ~ '^0x[a-f0-9]{40}$') THEN
    RETURN;
  END IF;
  
  -- Log the access attempt for security monitoring
  INSERT INTO public.audit_logs (action, table_name, details, created_at)
  VALUES (
    'secure_wallet_lookup', 
    'wallet_profiles', 
    jsonb_build_object('target_address', sanitized_address, 'user_id', auth.uid()),
    NOW()
  );
  
  -- Return only the specific wallet profile requested
  RETURN QUERY
  SELECT wp.id, wp.wallet_address
  FROM public.wallet_profiles wp
  WHERE wp.wallet_address = sanitized_address
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add security comments
COMMENT ON TABLE public.wallet_profiles IS 
'SECURITY CRITICAL: Direct access denied. Use secure_wallet_lookup() function for legitimate queries only.';

COMMENT ON TABLE public.profiles IS 
'SECURITY: Wallet addresses restricted to profile owners and admins only.';

-- Create performance index
CREATE INDEX IF NOT EXISTS idx_wallet_profiles_address_lookup 
ON public.wallet_profiles(wallet_address) 
WHERE wallet_address IS NOT NULL;