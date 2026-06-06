-- Shared gift lists for public sharing
CREATE TABLE IF NOT EXISTS shared_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  share_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  title TEXT NOT NULL,
  description TEXT,
  gift_ids UUID[] NOT NULL,
  recipient_name TEXT,
  occasion TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE shared_lists ENABLE ROW LEVEL SECURITY;

-- Users can manage their own shared lists
CREATE POLICY "Users can manage own shared lists"
  ON shared_lists
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Anyone can view active shared lists (public read)
CREATE POLICY "Anyone can view active shared lists"
  ON shared_lists
  FOR SELECT
  USING (is_active = true);

CREATE INDEX idx_shared_lists_token ON shared_lists(share_token);
CREATE INDEX idx_shared_lists_user ON shared_lists(user_id);
