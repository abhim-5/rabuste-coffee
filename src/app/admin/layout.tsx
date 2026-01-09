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
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        // Client-side check as backup
        if (!loading && (!user || !isAdmin())) {
            router.push('/');
        }
    }, [user, profile, loading, isAdmin, router]);

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading Admin Dashboard...</p>
                </div>
            </div>
        );
    }

    // Don't render if not admin
    if (!user || !isAdmin()) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* Main Content */}
            <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {/* Topbar */}
                <AdminTopbar />

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
