'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

function AuthCheckerInner() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if we're returning from auth callback
    const authCheck = searchParams.get('auth_check');
    
    if (authCheck === '1') {
      console.log('Checking auth state after callback...');
      
      // Remove the auth_check parameter from URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      
      // Wait a moment for auth state to settle
      setTimeout(() => {
        if (user) {
          console.log('User authenticated successfully after callback:', user.email);
          
          // Check if user needs profile completion
          if (!loading) {
            window.location.href = '/complete-profile';
          }
        } else {
          console.log('User not authenticated after callback');
        }
      }, 1000);
    }
  }, [user, loading, searchParams, router]);

  return null; // This component doesn't render anything
}

export default function AuthChecker() {
  return (
    <Suspense fallback={null}>
      <AuthCheckerInner />
    </Suspense>
  );
}