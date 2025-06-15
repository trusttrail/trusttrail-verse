
-- Create admin_users table to manage admin privileges separately
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  UNIQUE(user_id)
);

-- Enable RLS on admin_users table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Only existing admins can view admin users
CREATE POLICY "Only admins can view admin users" 
  ON public.admin_users 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Policy: Only existing admins can insert new admin users
CREATE POLICY "Only admins can create admin users" 
  ON public.admin_users 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Policy: Only existing admins can update admin users
CREATE POLICY "Only admins can update admin users" 
  ON public.admin_users 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Create a function to check if a user is admin
CREATE OR REPLACE FUNCTION public.is_user_admin(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = check_user_id AND is_active = true
  );
$$;

-- Update the existing is_admin function to use the new table
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
AS $$
  SELECT public.is_user_admin();
$$;

-- Insert the first admin user (you'll need to replace 'your-user-id' with your actual user ID)
-- You can find your user ID in the auth.users table in Supabase
-- INSERT INTO public.admin_users (user_id, notes) VALUES ('your-user-id', 'Initial admin user');
