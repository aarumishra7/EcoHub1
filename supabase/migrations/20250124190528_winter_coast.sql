/*
  # Fix profiles table RLS policies

  1. Changes
    - Drop existing RLS policies for profiles table
    - Add new policies that properly handle profile access
    - Allow users to read and update their own profiles
    - Allow service role to manage all profiles

  2. Security
    - Ensure users can only access their own profile data
    - Maintain strict access control while fixing permission issues
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;

-- Create new policies
CREATE POLICY "Enable read access for users to their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Enable update access for users to their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable insert access for users to their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Service role can do everything
CREATE POLICY "Service role full access"
  ON profiles
  USING (auth.role() = 'service_role');