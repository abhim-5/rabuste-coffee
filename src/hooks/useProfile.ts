import { useState, useEffect } from 'react';

interface ProfileData {
  id: string;
  email: string;
  full_name: string | null;
  age: number | null;
  avatar_url: string | null;
  phone: string | null;
  role: string;
  credits: number;
  created_at: string;
  updated_at: string;
}

interface UseProfileReturn {
  profile: ProfileData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateProfile: (data: Partial<ProfileData>) => Promise<{ success: boolean; rewards?: any }>;
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/profile');
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch profile');
      }

      setProfile(data.profile);
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updateData: Partial<ProfileData>) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to update profile');
      }

      // Update local state
      setProfile(data.profile);

      return {
        success: true,
        rewards: data.rewards
      };
    } catch (err) {
      console.error('Profile update error:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile
  };
}
