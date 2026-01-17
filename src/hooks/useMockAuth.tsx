'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface MockUser {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    name?: string;
    picture?: string;
    avatar_url?: string;
  };
  created_at?: string;
  email_confirmed_at?: string;
}

interface MockSession {
  user: MockUser;
  access_token: string;
}

interface AuthContextType {
  user: MockUser | null;
  session: MockSession | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ user: MockUser }>;
  signInWithPassword: (credentials: { email: string; password: string }) => Promise<{ user: MockUser }>;
  signUp: (credentials: { email: string; password: string }) => Promise<{ user: MockUser }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [session, setSession] = useState<MockSession | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check for saved auth on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('mock_auth_user');
    if (savedAuth) {
      try {
        const userData = JSON.parse(savedAuth);
        setUser(userData);
        setSession({ user: userData, access_token: 'mock_token' });
        console.log('Restored mock auth for:', userData.email);
      } catch (error) {
        console.error('Error restoring auth:', error);
        localStorage.removeItem('mock_auth_user');
      }
    }
    setLoading(false);
  }, []);

  const signInWithGoogle = async () => {
    console.log('Mock Google sign-in');
    
    const mockUser: MockUser = {
      id: 'google-user-' + Date.now(),
      email: 'moriaryan2024@gmail.com',
      user_metadata: {
        full_name: 'Ryan Moria',
        name: 'Ryan',
        picture: 'https://lh3.googleusercontent.com/a/ACg8ocIV8QiEoZMW6X6vb3DbiGHvXt2EHCPGWLwdY_-q3QgsTj0RtA=s96-c'
      },
      created_at: new Date().toISOString(),
      email_confirmed_at: new Date().toISOString()
    };

    setUser(mockUser);
    setSession({ user: mockUser, access_token: 'mock_google_token' });
    localStorage.setItem('mock_auth_user', JSON.stringify(mockUser));
    
    console.log('Mock Google auth successful for:', mockUser.email);
    return { user: mockUser };
  };

  const signInWithPassword = async (credentials: { email: string; password: string }) => {
    console.log('Mock email/password sign-in for:', credentials.email);
    
    // Check if this user was previously registered
    const savedUsers = localStorage.getItem('mock_registered_users');
    let registeredUsers: any[] = [];
    if (savedUsers) {
      registeredUsers = JSON.parse(savedUsers);
    }
    
    const existingUser = registeredUsers.find(u => u.email === credentials.email);
    if (!existingUser) {
      throw new Error('Invalid login credentials');
    }
    
    if (existingUser.password !== credentials.password) {
      throw new Error('Invalid login credentials');
    }

    const mockUser: MockUser = {
      id: existingUser.id,
      email: credentials.email,
      user_metadata: {
        full_name: existingUser.full_name || 'User',
        name: existingUser.name || 'User'
      },
      created_at: existingUser.created_at,
      email_confirmed_at: new Date().toISOString()
    };

    setUser(mockUser);
    setSession({ user: mockUser, access_token: 'mock_token' });
    localStorage.setItem('mock_auth_user', JSON.stringify(mockUser));
    
    console.log('Mock email auth successful for:', mockUser.email);
    return { user: mockUser };
  };

  const signUp = async (credentials: { email: string; password: string }) => {
    console.log('Mock sign-up for:', credentials.email);
    
    const mockUser: MockUser = {
      id: 'user-' + Date.now(),
      email: credentials.email,
      user_metadata: {
        full_name: 'New User',
        name: 'User'
      },
      created_at: new Date().toISOString(),
      email_confirmed_at: undefined // Require confirmation
    };

    // Save to mock registered users
    const savedUsers = localStorage.getItem('mock_registered_users');
    let registeredUsers: any[] = [];
    if (savedUsers) {
      registeredUsers = JSON.parse(savedUsers);
    }
    
    registeredUsers.push({
      ...mockUser,
      password: credentials.password
    });
    localStorage.setItem('mock_registered_users', JSON.stringify(registeredUsers));
    
    console.log('Mock sign-up successful for:', mockUser.email);
    return { user: mockUser };
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    localStorage.removeItem('mock_auth_user');
    console.log('Mock sign-out successful');
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signOut,
      signInWithGoogle,
      signInWithPassword,
      signUp
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useMockAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useMockAuth must be used within a MockAuthProvider');
  }
  return context;
}