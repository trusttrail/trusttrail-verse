
-- Update all pending reviews to approved status
UPDATE public.reviews 
SET status = 'approved'::review_status, 
    updated_at = now()
WHERE status = 'pending'::review_status;

-- Let's also check if we need to modify the review_status enum to remove pending
-- But first, let's see what the current enum values are
-- ALTER TYPE review_status ADD VALUE IF NOT EXISTS 'approved';
-- ALTER TYPE review_status ADD VALUE IF NOT EXISTS 'rejected';

-- Update any reviews that might still be pending to approved
UPDATE public.reviews 
SET status = 'approved'::review_status, 
    updated_at = now()
WHERE status = 'pending'::review_status OR status IS NULL;
