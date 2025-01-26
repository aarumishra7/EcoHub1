import React, { useState } from 'react';
import { createPhoneOTP, verifyPhoneOTP } from '../lib/phoneVerification';
import { useAuthStore } from '../stores/authStore';

const PhoneVerification = () => {
  const { profile, updateProfile } = useAuthStore();
  const [phone, setPhone] = useState(profile?.phone || '');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendCode = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Update profile with new phone number if changed
      if (phone !== profile?.phone) {
        await updateProfile({ phone, phone_verified: false });
      }
      
      await createPhoneOTP(phone);
      setCodeSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      setLoading(true);
      setError(null);
      await verifyPhoneOTP(phone, code);
      // Phone verification successful
      setCodeSent(false);
      setCode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <div className="flex gap-2">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={codeSent || loading}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
            placeholder="Enter phone number"
          />
          <button
            onClick={handleSendCode}
            disabled={!phone || loading || (codeSent && !error)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : codeSent ? 'Resend Code' : 'Send Code'}
          </button>
        </div>
      </div>

      {codeSent && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Verification Code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="Enter 6-digit code"
              maxLength={6}
            />
            <button
              onClick={handleVerifyCode}
              disabled={!code || loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Enter the 6-digit code sent to your phone
          </p>
        </div>
      )}

      {error && (
        <div className="p-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {profile?.phone_verified && (
        <div className="p-4 text-green-700 bg-green-100 rounded-lg">
          Phone number verified successfully!
        </div>
      )}
    </div>
  );
};

export default PhoneVerification;