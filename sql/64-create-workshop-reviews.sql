-- Create workshop_reviews table
CREATE TABLE IF NOT EXISTS public.workshop_reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  workshop_id uuid NOT NULL,
  user_id uuid NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT workshop_reviews_pkey PRIMARY KEY (id),
  CONSTRAINT workshop_reviews_workshop_id_fkey FOREIGN KEY (workshop_id) REFERENCES public.workshops(id) ON DELETE CASCADE,
  CONSTRAINT workshop_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT workshop_reviews_unique_user_workshop UNIQUE (user_id, workshop_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_workshop_reviews_workshop_id ON public.workshop_reviews(workshop_id);
CREATE INDEX IF NOT EXISTS idx_workshop_reviews_user_id ON public.workshop_reviews(user_id);

-- Enable RLS
ALTER TABLE public.workshop_reviews ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public reviews are viewable by everyone"
ON public.workshop_reviews FOR SELECT
TO public
USING (true);

CREATE POLICY "Users can insert their own reviews"
ON public.workshop_reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
ON public.workshop_reviews FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
ON public.workshop_reviews FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
