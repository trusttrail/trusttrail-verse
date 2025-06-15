
-- First, let's see what RLS policies currently exist on the profiles table
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'profiles' AND schemaname = 'public';

-- If needed, we can drop and recreate policies, but let's first see what exists
