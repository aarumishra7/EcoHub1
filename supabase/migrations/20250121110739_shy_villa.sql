/*
  # Create materials table and setup security

  1. New Tables
    - `materials`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `quantity` (text)
      - `location` (text)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `materials` table
    - Add policies for:
      - Anyone can read materials
      - Authenticated users can create materials
      - Users can update/delete their own materials
*/

CREATE TABLE IF NOT EXISTS materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  quantity text NOT NULL,
  location text NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read materials
CREATE POLICY "Anyone can read materials"
  ON materials
  FOR SELECT
  USING (true);

-- Allow authenticated users to create materials
CREATE POLICY "Authenticated users can create materials"
  ON materials
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own materials
CREATE POLICY "Users can update their own materials"
  ON materials
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own materials
CREATE POLICY "Users can delete their own materials"
  ON materials
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);