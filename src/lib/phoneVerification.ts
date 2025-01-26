import { supabase } from './supabase';

// Generate a random 6-digit code
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create a new OTP for a phone number
export const createPhoneOTP = async (phone: string) => {
  try {
    const code = generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // Code expires in 10 minutes

    // Delete any existing codes for this phone number
    await supabase
      .from('phone_verification_codes')
      .delete()
      .eq('phone', phone);

    // Create new verification code
    const { error } = await supabase
      .from('phone_verification_codes')
      .insert({
        phone,
        code,
        expires_at: expiresAt.toISOString(),
      });

    if (error) throw error;

    // In a production environment, you would integrate with an SMS service here
    // For demo purposes, we'll just log the code
    console.log(`OTP for ${phone}: ${code}`);

    return true;
  } catch (error) {
    console.error('Error creating OTP:', error);
    throw error;
  }
};

// Verify an OTP code
export const verifyPhoneOTP = async (phone: string, code: string) => {
  try {
    const { data, error } = await supabase
      .from('phone_verification_codes')
      .select('*')
      .eq('phone', phone)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    if (!data) throw new Error('No valid verification code found');

    // Check attempts
    if (data.attempts >= 3) {
      throw new Error('Too many verification attempts');
    }

    // Update attempts
    await supabase
      .from('phone_verification_codes')
      .update({ attempts: data.attempts + 1 })
      .eq('id', data.id);

    // Verify code
    if (data.code !== code) {
      throw new Error('Invalid verification code');
    }

    // Mark code as verified
    await supabase
      .from('phone_verification_codes')
      .update({ verified: true })
      .eq('id', data.id);

    // Update profile phone_verified status
    await supabase
      .from('profiles')
      .update({ phone_verified: true })
      .eq('phone', phone);

    return true;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};