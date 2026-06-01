CREATE TABLE public.gift_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.gift_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  estimated_price_min INTEGER,
  estimated_price_max INTEGER,
  why_its_perfect TEXT,
  category TEXT,
  purchase_keywords TEXT[] DEFAULT '{}',
  is_saved BOOLEAN DEFAULT false,
  is_given BOOLEAN DEFAULT false,
  given_date DATE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_gift_ideas_session_id ON public.gift_ideas(session_id);
CREATE INDEX idx_gift_ideas_user_id ON public.gift_ideas(user_id);
CREATE INDEX idx_gift_ideas_saved ON public.gift_ideas(user_id, is_saved) WHERE is_saved = true;

ALTER TABLE public.gift_ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own gift ideas"
  ON public.gift_ideas FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
