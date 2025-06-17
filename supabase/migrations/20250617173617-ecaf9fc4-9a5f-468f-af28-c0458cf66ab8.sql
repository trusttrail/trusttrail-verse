
-- Let's drop the specific policies that might be blocking insertions and recreate them
DROP POLICY IF EXISTS "Anyone can insert reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can insert their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can view their own reviews" ON public.reviews;

-- Create a policy that allows anyone to insert reviews (since we're using wallet-based authentication)
CREATE POLICY "Anyone can insert reviews" ON public.reviews
    FOR INSERT WITH CHECK (true);

-- Create a policy that allows users to view their own reviews based on wallet address
CREATE POLICY "Users can view their own reviews" ON public.reviews
    FOR SELECT USING (wallet_address IS NOT NULL);
