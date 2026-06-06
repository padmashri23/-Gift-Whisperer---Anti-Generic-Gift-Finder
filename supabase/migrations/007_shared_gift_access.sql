-- Allow public read of gift_ideas that are part of an active shared list
CREATE POLICY "Anyone can view gifts in active shared lists"
  ON gift_ideas
  FOR SELECT
  USING (
    id IN (
      SELECT unnest(gift_ids)
      FROM shared_lists
      WHERE is_active = true
    )
  );
