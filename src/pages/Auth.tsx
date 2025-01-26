import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { LogIn, UserPlus, Building2, Landmark } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'business' | 'financial'>('business');
  const [businessName, setBusinessName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        // Validate GST format for business accounts
        if (userType === 'business' && !gstNumber.match(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)) {
          throw new Error('Invalid GST number format');
        }

        await signUp({
          email,
          password,
          userType,
          businessName: businessName || undefined,
          gstNumber: gstNumber || undefined,
          phone: phone || undefined,
        });
      }
      navigate('/materials');
    } catch (err) {
      // Handle specific error cases
      if (err instanceof Error) {
        if (err.message.includes('user_already_exists')) {
          setError('This email is already registered. Please sign in instead.');
          setIsLogin(true); // Switch to login form
        } else if (err.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
        } else if (err.message.includes('Invalid GST number')) {
          setError('Please enter a valid GST number in the format: 22AAAAA0000A1Z5');
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError(null); // Clear any existing errors
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          {isLogin ? 'Sign in to EcoHub' : 'Create an EcoHub account'}
        </h2>

        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setUserType('business')}
                    className={`flex items-center justify-center p-4 rounded-lg border ${
                      userType === 'business'
                        ? 'border-green-600 bg-green-50 text-green-600'
                        : 'border-gray-300 hover:border-green-600'
                    }`}
                  >
                    <Building2 className="h-5 w-5 mr-2" />
                    Business
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('financial')}
                    className={`flex items-center justify-center p-4 rounded-lg border ${
                      userType === 'financial'
                        ? 'border-green-600 bg-green-50 text-green-600'
                        : 'border-gray-300 hover:border-green-600'
                    }`}
                  >
                    <Landmark className="h-5 w-5 mr-2" />
                    Financial
                  </button>
                </div>
              </div>

              {userType === 'business' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                      className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter business name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GST Number
                    </label>
                    <input
                      type="text"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                      required
                      pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
                      className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter GST number"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Format: 22AAAAA0000A1Z5
                    </p>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your password"
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              'Please wait...'
            ) : isLogin ? (
              <>
                <LogIn className="h-5 w-5 mr-2" />
                Sign In
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5 mr-2" />
                Sign Up
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={switchMode}
            className="text-sm text-green-600 hover:text-green-700"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;