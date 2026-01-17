'use client';

import { useAuth } from './useAuth';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

type UserRole = 'customer' | 'staff' | 'admin' | 'superadmin';

interface UserProfile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
}

interface RoleContextType {
  userProfile: UserProfile | null;
  isCustomer: boolean;
  isStaff: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  hasStaffAccess: boolean;
  hasAdminAccess: boolean;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

export function useRole(): RoleContextType {
  const { user, loading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchUserProfile = async () => {
    if (!user) {
      setUserProfile(null);
      setLoading(false);
      return;
    }

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setUserProfile(null);
      } else {
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchUserProfile();
    }
  }, [user, authLoading]);

  const role = userProfile?.role || 'customer';

  return {
    userProfile,
    isCustomer: role === 'customer',
    isStaff: role === 'staff',
    isAdmin: role === 'admin',
    isSuperAdmin: role === 'superadmin',
    hasStaffAccess: ['staff', 'admin', 'superadmin'].includes(role),
    hasAdminAccess: ['admin', 'superadmin'].includes(role),
    loading: authLoading || loading,
    refreshProfile: fetchUserProfile,
  };
}

// Higher-order component for role-based access control
export function withRoleAccess<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles: UserRole[]
) {
  return function RoleProtectedComponent(props: P) {
    const { userProfile, loading } = useRole();

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        </div>
      );
    }

    if (!userProfile || !requiredRoles.includes(userProfile.role)) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

// Hook to check if user can perform specific actions
export function usePermissions() {
  const { userProfile, hasStaffAccess, hasAdminAccess, isSuperAdmin } = useRole();

  return {
    canViewDashboard: hasStaffAccess,
    canManageOrders: hasStaffAccess,
    canCreateProducts: hasStaffAccess,
    canDeleteProducts: hasAdminAccess,
    canCreateWorkshops: hasStaffAccess,
    canDeleteWorkshops: hasAdminAccess,
    canManageUsers: hasAdminAccess,
    canViewAnalytics: hasStaffAccess,
    canManageRoles: isSuperAdmin,
    canAccessSuperAdmin: isSuperAdmin,
  };
}