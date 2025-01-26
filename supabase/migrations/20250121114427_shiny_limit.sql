/*
  # Add phone verification system

  1. New Tables
    - `phone_verification_codes`
      - `id` (uuid, primary key)
      - `phone` (text, the phone number being verified)
      - `code` (text, the OTP code)
      - `expires_at` (timestamptz, when the code expires)
      - `attempts` (int, number of verification attempts)
      - `verified` (boolean, whether verification was successful)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `phone_verification_codes` table
    - Add policies for secure code verification
*/

CREATE TABLE IF NOT EXISTS phone_verification_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  code text NOT NULL,
  expires_at timestamptz NOT NULL,
  attempts int DEFAULT 0,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE phone_verification_codes ENABLE ROW LEVEL SECURITY;

-- Users can only verify their own phone numbers
CREATE POLICY "Users can verify their own phone numbers"
  ON phone_verification_codes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.phone = phone_verification_codes.phone
    )
  );