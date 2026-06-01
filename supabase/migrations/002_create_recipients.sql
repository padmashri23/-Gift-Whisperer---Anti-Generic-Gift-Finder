CREATE TABLE public.recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT,
  description TEXT,
  interests TEXT[] DEFAULT '{}',
  important_dates JSONB DEFAULT '[]',
  notes TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_recipients_user_id ON public.recipients(user_id);

ALTER TABLE public.recipients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own recipients"
  ON public.recipients FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
