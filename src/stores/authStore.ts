import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}

interface SignUpData {
  email: string;
  password: string;
  userType: 'business' | 'financial';
  businessName?: string;
  gstNumber?: string;
  phone?: string;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  signIn: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  },
  signUp: async ({ email, password, userType, businessName, gstNumber, phone }) => {
    const { error: signUpError, data } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError) throw signUpError;

    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          user_type: userType,
          business_name: businessName,
          gst_number: gstNumber,
          phone,
        })
        .eq('id', data.user.id);

      if (profileError) throw profileError;
    }
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null, profile: null });
  },
  setUser: (user) => set({ user, loading: false }),
  setProfile: (profile) => set({ profile }),
  updateProfile: async (data) => {
    const { user } = get();
    if (!user) throw new Error('No user logged in');

    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id);

    if (error) throw error;

    set((state) => ({
      profile: state.profile ? { ...state.profile, ...data } : null,
    }));
  },
}));