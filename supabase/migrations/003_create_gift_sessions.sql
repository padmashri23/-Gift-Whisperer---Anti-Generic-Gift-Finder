CREATE TABLE public.gift_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES public.recipients(id) ON DELETE SET NULL,
  description_input TEXT NOT NULL,
  occasion TEXT,
  budget_min INTEGER,
  budget_max INTEGER,
  ai_provider TEXT,
  ai_model TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_gift_sessions_user_id ON public.gift_sessions(user_id);
CREATE INDEX idx_gift_sessions_recipient_id ON public.gift_sessions(recipient_id);

ALTER TABLE public.gift_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own sessions"
  ON public.gift_sessions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
