/*
  # User Profile Management System

  1. New Tables
    - `user_sessions`
      - Tracks user sessions and authentication
    - `user_security_logs`
      - Audit logs for security events
    - `user_addresses`
      - User shipping/billing addresses
    - `user_preferences`
      - User notification and privacy preferences
    - `user_documents`
      - User uploaded documents and files
    - `user_orders`
      - Order history and tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for data access control
    - Implement audit logging
*/

-- User Sessions Table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  refresh_token text NOT NULL,
  user_agent text,
  ip_address inet,
  last_activity timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Security Audit Logs
CREATE TABLE IF NOT EXISTS user_security_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  event_type text NOT NULL,
  ip_address inet,
  user_agent text,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- User Addresses
CREATE TABLE IF NOT EXISTS user_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  address_type text NOT NULL,
  is_default boolean DEFAULT false,
  recipient_name text NOT NULL,
  street_address text NOT NULL,
  apartment text,
  city text NOT NULL,
  state text NOT NULL,
  postal_code text NOT NULL,
  country text NOT NULL,
  phone text,
  delivery_instructions text,
  latitude numeric,
  longitude numeric,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users,
  notification_email boolean DEFAULT true,
  notification_sms boolean DEFAULT false,
  notification_push boolean DEFAULT false,
  marketing_email boolean DEFAULT true,
  marketing_sms boolean DEFAULT false,
  language text DEFAULT 'en',
  timezone text DEFAULT 'UTC',
  currency text DEFAULT 'USD',
  theme text DEFAULT 'light',
  privacy_profile_visible boolean DEFAULT true,
  cookie_preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Documents
CREATE TABLE IF NOT EXISTS user_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  document_type text NOT NULL,
  file_name text NOT NULL,
  file_size integer NOT NULL,
  mime_type text NOT NULL,
  storage_path text NOT NULL,
  verified boolean DEFAULT false,
  verification_date timestamptz,
  created_at timestamptz DEFAULT now()
);

-- User Orders
CREATE TABLE IF NOT EXISTS user_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  status text NOT NULL,
  total_amount numeric NOT NULL,
  currency text DEFAULT 'USD',
  shipping_address_id uuid REFERENCES user_addresses,
  billing_address_id uuid REFERENCES user_addresses,
  payment_status text NOT NULL,
  payment_method text,
  tracking_number text,
  notes text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Sessions
CREATE POLICY "Users can view own sessions"
  ON user_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON user_sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Security Logs
CREATE POLICY "Users can view own security logs"
  ON user_security_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Addresses
CREATE POLICY "Users can manage own addresses"
  ON user_addresses FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Preferences
CREATE POLICY "Users can manage own preferences"
  ON user_preferences FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Documents
CREATE POLICY "Users can manage own documents"
  ON user_documents FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Orders
CREATE POLICY "Users can view own orders"
  ON user_orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Functions

-- Update profile function with security logging
CREATE OR REPLACE FUNCTION update_user_profile()
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_security_logs (
    user_id,
    event_type,
    details
  ) VALUES (
    NEW.id,
    'profile_updated',
    jsonb_build_object(
      'changes', jsonb_build_object(
        'old_data', row_to_json(OLD),
        'new_data', row_to_json(NEW)
      )
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for profile updates
CREATE TRIGGER on_profile_update
  AFTER UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_profile();

-- Function to handle address verification
CREATE OR REPLACE FUNCTION verify_address(address_id uuid)
RETURNS boolean AS $$
DECLARE
  addr user_addresses;
BEGIN
  SELECT * INTO addr FROM user_addresses WHERE id = address_id;
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- In a real implementation, this would call an external address verification service
  -- For now, we'll just mark it as verified
  UPDATE user_addresses
  SET verified = true
  WHERE id = address_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;