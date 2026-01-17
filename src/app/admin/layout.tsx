// Admin Layout Component
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, profile, loading, isAdmin } = useAuth();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        // Don't redirect until we have both user AND profile data
        if (!loading && user && profile) {
            // Profile loaded - check if admin
            if (!isAdmin()) {
                console.warn('Non-admin trying to access admin panel, redirecting');
                router.push('/');
            }
        } else if (!loading && !user) {
            // Not logged in at all
            console.warn('Unauthenticated user trying to access admin panel, redirecting');
            router.push('/');
        }
    }, [user, profile, loading, isAdmin, router]);

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-[#D8CBB8] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#8B6F47] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-[#4A3B28] font-serif tracking-widest text-sm font-semibold">LOADING DASHBOARD...</p>
                </div>
            </div>
        );
    }

    // Don't render if not admin
    if (!user || !isAdmin()) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#D8CBB8] text-[#4A3B28] font-sans">
            {/* Sidebar */}
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* Main Content */}
            <div className={`transition-all duration-500 ease-in-out ml-0 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
                {/* Topbar */}
                <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />

                {/* Page Content */}
                <main className="p-4 lg:p-6 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
