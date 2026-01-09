/*
  # Create robot quotes table for download assistant

  1. New Tables
    - `robot_quotes`
      - `id` (uuid, primary key) - Unique identifier for each quote
      - `quote` (text) - The actual quote text to display
      - `display_order` (integer) - Order in which quotes should appear
      - `is_active` (boolean) - Whether the quote is currently enabled
      - `created_at` (timestamptz) - Timestamp when quote was created
      - `updated_at` (timestamptz) - Timestamp when quote was last updated

  2. Security
    - Enable RLS on `robot_quotes` table
    - Add policy for anyone to read quotes (public access)
    - Add policy for authenticated users to insert new quotes
    - Add policy for authenticated users to update quotes
    - Add policy for authenticated users to delete quotes

  3. Initial Data
    - Seed table with default funny waiting messages
*/

CREATE TABLE IF NOT EXISTS robot_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE robot_quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read robot quotes"
  ON robot_quotes
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can insert quotes"
  ON robot_quotes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update quotes"
  ON robot_quotes
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete quotes"
  ON robot_quotes
  FOR DELETE
  TO authenticated
  USING (true);

INSERT INTO robot_quotes (quote, display_order, is_active) VALUES
  ('Hey, be patient! It''s almost done.', 1, true),
  ('Oh, you''re that kid who always says "are we there yet?"', 2, true),
  ('Rome wasn''t built in a day, and neither is this model!', 3, true),
  ('I''m downloading as fast as I can! This isn''t dial-up!', 4, true),
  ('Click me again, I dare you.', 5, true),
  ('You know, watching doesn''t make it go faster...', 6, true),
  ('Fine, let me check... Nope, still downloading.', 7, true),
  ('Why don''t you grab a coffee? I''ll wait here.', 8, true),
  ('Patience is a virtue. One you clearly don''t have.', 9, true),
  ('I could go faster, but where''s the fun in that?', 10, true),
  ('Still here? You must really want this model.', 11, true),
  ('Did you know AI models are like fine wine? They need time.', 12, true)
ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION update_robot_quotes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER robot_quotes_updated_at
  BEFORE UPDATE ON robot_quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_robot_quotes_updated_at();