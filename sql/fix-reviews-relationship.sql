-- 1. Fix Foreign Key to point to public.profiles instead of auth.users
ALTER TABLE public.workshop_reviews
DROP CONSTRAINT IF EXISTS workshop_reviews_user_id_fkey;

ALTER TABLE public.workshop_reviews
ADD CONSTRAINT workshop_reviews_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.profiles (id)
ON DELETE CASCADE;

-- 2. Enable RLS
ALTER TABLE public.workshop_reviews ENABLE ROW LEVEL SECURITY;

-- 3. safely Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public reviews are viewable by everyone" ON public.workshop_reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON public.workshop_reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON public.workshop_reviews;

-- 4. Create Policies
-- Allow Public Read
CREATE POLICY "Public reviews are viewable by everyone"
ON public.workshop_reviews FOR SELECT
USING (true);

-- Allow Authenticated Insert
CREATE POLICY "Users can create reviews"
ON public.workshop_reviews FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow Users to Delete their own reviews
CREATE POLICY "Users can delete own reviews"
ON public.workshop_reviews FOR DELETE
USING (auth.uid() = user_id);
