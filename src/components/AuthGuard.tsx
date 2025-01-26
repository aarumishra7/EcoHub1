import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredUserType?: 'business' | 'financial';
  requireVerified?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requiredUserType,
  requireVerified = false,
}) => {
  const { user, profile, setUser, setProfile, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // Fetch user profile
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            setProfile(data);
          });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // Fetch user profile
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            setProfile(data);
          });
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setProfile]);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (profile) {
        // Check user type if required
        if (requiredUserType && profile.user_type !== requiredUserType) {
          navigate('/');
        }
        // Check verification if required
        if (requireVerified && profile.verification_status !== 'approved') {
          navigate('/profile');
        }
      }
    }
  }, [user, profile, loading, navigate, requiredUserType, requireVerified]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) return null;

  if (requiredUserType && profile.user_type !== requiredUserType) return null;

  if (requireVerified && profile.verification_status !== 'approved') return null;

  return <>{children}</>;
};

export default AuthGuard;