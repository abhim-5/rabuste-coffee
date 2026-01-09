// Admin Topbar Component
'use client';

import { useAuth } from '@/hooks/useAuth';
import { LogOut, ExternalLink, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminTopbar() {
    const { user, profile, signOut } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    return (
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            {/* Left Side - Page Title (can be dynamic later) */}
            <div>
                <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>
                <p className="text-sm text-gray-500">Manage your coffee empire</p>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center gap-4">
                {/* View as Customer */}
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                >
                    <ExternalLink className="w-4 h-4" />
                    View as Customer
                </Link>

                {/* User Info */}
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                    <div className="flex items-center gap-2">
                        {profile?.avatar_url ? (
                            <img
                                src={profile.avatar_url}
                                alt={profile.full_name || 'Admin'}
                                className="w-9 h-9 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8B6F47] flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                        )}
                        <div className="text-sm">
                            <p className="font-medium text-gray-800">{profile?.full_name || user?.email}</p>
                            <p className="text-xs text-gray-500 capitalize">{profile?.role || 'Admin'}</p>
                        </div>
                    </div>

                    {/* Sign Out */}
                    <button
                        onClick={handleSignOut}
                        className="p-2 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg transition-colors"
                        title="Sign Out"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
