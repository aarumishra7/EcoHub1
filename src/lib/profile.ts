import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  phone: string | null;
  full_name: string;
  date_of_birth: string | null;
  avatar_url: string | null;
  language: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface UserAddress {
  id: string;
  address_type: 'shipping' | 'billing';
  is_default: boolean;
  recipient_name: string;
  street_address: string;
  apartment?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  delivery_instructions?: string;
  verified: boolean;
}

export interface UserPreferences {
  notification_email: boolean;
  notification_sms: boolean;
  notification_push: boolean;
  marketing_email: boolean;
  marketing_sms: boolean;
  language: string;
  timezone: string;
  currency: string;
  theme: 'light' | 'dark';
  privacy_profile_visible: boolean;
  cookie_preferences: Record<string, boolean>;
}

// Profile Management
export const updateProfile = async (
  user: User,
  updates: Partial<UserProfile>
): Promise<{ data: UserProfile | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { data: null, error: error as Error };
  }
};

// Address Management
export const addAddress = async (
  userId: string,
  address: Omit<UserAddress, 'id' | 'verified'>
): Promise<{ data: UserAddress | null; error: Error | null }> => {
  try {
    // If this is the first address or marked as default, unset other default addresses
    if (address.is_default) {
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', userId)
        .eq('address_type', address.address_type);
    }

    const { data, error } = await supabase
      .from('user_addresses')
      .insert({ ...address, user_id: userId })
      .select()
      .single();

    if (error) throw error;

    // Trigger address verification
    await supabase.rpc('verify_address', { address_id: data.id });

    return { data, error: null };
  } catch (error) {
    console.error('Error adding address:', error);
    return { data: null, error: error as Error };
  }
};

// Preferences Management
export const updatePreferences = async (
  userId: string,
  preferences: Partial<UserPreferences>
): Promise<{ data: UserPreferences | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({ user_id: userId, ...preferences })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating preferences:', error);
    return { data: null, error: error as Error };
  }
};

// Security Audit
export const getSecurityLogs = async (
  userId: string,
  limit = 10
): Promise<{ data: any[]; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('user_security_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching security logs:', error);
    return { data: [], error: error as Error };
  }
};

// Session Management
export const getCurrentSessions = async (
  userId: string
): Promise<{ data: any[]; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', userId)
      .gt('expires_at', new Date().toISOString());

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return { data: [], error: error as Error };
  }
};

export const revokeSession = async (
  sessionId: string
): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('user_sessions')
      .delete()
      .eq('id', sessionId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error revoking session:', error);
    return { error: error as Error };
  }
};