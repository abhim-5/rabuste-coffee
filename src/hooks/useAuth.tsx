'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  age: number | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<{ error: Error | null }>;
  resendVerificationEmail: (email: string) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
  // Role helpers
  isAdmin: () => boolean;
  isSuperadmin: () => boolean;
  isStaff: () => boolean;
  hasRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const loadProfile = async (userId: string) => {
    console.log('📝 Loading profile for user:', userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Error loading profile:', error);
        setProfile(null);
        return;
      }

      console.log('✅ Profile loaded:', data);
      setProfile(data);
    } catch (error) {
      console.error('Profile load exception:', error);
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id);
    }
  };

  // Role helper functions
  const isAdmin = () => {
    return profile?.role === 'admin' || profile?.role === 'superadmin';
  };

  const isSuperadmin = () => {
    return profile?.role === 'superadmin';
  };

  const isStaff = () => {
    return profile?.role === 'staff' || profile?.role === 'admin' || profile?.role === 'superadmin';
  };

  const hasRole = (roles: string[]) => {
    return profile?.role ? roles.includes(profile.role) : false;
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('Google sign-in error:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Google sign-in exception:', error);
      return { error: error as Error };
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Email sign-in error:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Email sign-in exception:', error);
      return { error: error as Error };
    }
  };

  const signUpWithEmail = async (name: string, email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (error) {
        console.error('Email sign-up error:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Email sign-up exception:', error);
      return { error: error as Error };
    }
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (error) {
        console.error('Resend verification error:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Resend verification exception:', error);
      return { error: error as Error };
    }
  };

  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      try {
        // Use getUser() instead of getSession() for secure authentication
        // This validates the session with Supabase Auth server
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
          console.error('Error getting user:', error);
          if (mounted) {
            setUser(null);
            setSession(null);
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setUser(user);
          // Get the session after validating user
          const { data: { session } } = await supabase.auth.getSession();
          setSession(session);
          setLoading(false); // Set loading false IMMEDIATELY after getting user

          // Load profile in background (don't block on it)
          if (user) {
            loadProfile(user.id); // Don't await - let it load async
          }
        }
      } catch (error) {
        console.error('Session initialization error:', error);
        if (mounted) {
          setLoading(false); // Set loading false even on error
        }
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state change:', event, newSession?.user?.email);

        if (mounted) {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          setLoading(false); // Set loading false IMMEDIATELY

          // Load profile in background
          if (newSession?.user) {
            loadProfile(newSession.user.id); // Don't await
          } else {
            setProfile(null);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    profile,
    loading,
    signOut,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    resendVerificationEmail,
    refreshProfile,
    isAdmin,
    isSuperadmin,
    isStaff,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
