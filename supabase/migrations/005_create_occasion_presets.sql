CREATE TABLE public.occasion_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL UNIQUE,
  emoji TEXT,
  sort_order INTEGER DEFAULT 0
);

ALTER TABLE public.occasion_presets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Occasion presets readable by all authenticated users"
  ON public.occasion_presets FOR SELECT
  TO authenticated
  USING (true);

INSERT INTO public.occasion_presets (label, emoji, sort_order) VALUES
  ('Birthday', '🎂', 1),
  ('Christmas', '🎄', 2),
  ('Anniversary', '💍', 3),
  ('Valentine''s Day', '❤️', 4),
  ('Mother''s Day', '👩', 5),
  ('Father''s Day', '👨', 6),
  ('Graduation', '🎓', 7),
  ('Wedding', '💒', 8),
  ('Baby Shower', '👶', 9),
  ('Housewarming', '🏠', 10),
  ('Thank You', '🙏', 11),
  ('Just Because', '✨', 12);
