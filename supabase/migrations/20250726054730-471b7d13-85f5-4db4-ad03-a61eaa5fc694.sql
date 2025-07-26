-- Remove the foreign key constraint that's causing the issue
-- since we're using wallet-based authentication instead of Supabase Auth
ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;

-- Make user_id nullable since not all reviews will have a Supabase Auth user
ALTER TABLE public.reviews ALTER COLUMN user_id DROP NOT NULL;

-- Update existing reviews to set user_id to NULL where it references non-existent auth users
UPDATE public.reviews 
SET user_id = NULL 
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Add a comment to clarify the schema
COMMENT ON COLUMN public.reviews.user_id IS 'References auth.users.id when user is authenticated via Supabase Auth, otherwise NULL for wallet-only users';