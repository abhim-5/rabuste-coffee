// Admin Topbar Component
'use client';

import { useAuth } from '@/hooks/useAuth';
import { LogOut, ExternalLink, User, Menu } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AdminTopbarProps {
    onMenuClick?: () => void;
}

export default function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
    const { user, profile, signOut } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    return (
        <div className="h-16 lg:h-20 bg-[#faeade]/90 backdrop-blur-md border-b border-[#7f3b2d]/10 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
            {/* Left Side - Page Title & Mobile Menu */}
            <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-[#7f3b2d] hover:bg-[#7f3b2d]/5 rounded-lg lg:hidden"
                >
                    <Menu className="w-6 h-6" />
                </button>

                <div>
                    <h2 className="text-xl lg:text-2xl font-display font-bold text-[#7f3b2d]">
                        Admin <span className="hidden sm:inline">Dashboard</span>
                    </h2>
                    <p className="text-[10px] lg:text-xs text-[#7f3b2d]/70 font-sans tracking-wide font-medium">Manage your coffee empire</p>
                </div>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center gap-3 lg:gap-6">
                {/* V Scan QR */}
                <Link
                    href="/admin/verify-order"
                    className="flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 bg-[#8B6F47] hover:bg-[#6d5638] text-white rounded-full transition-all text-[10px] lg:text-xs font-bold tracking-wider uppercase group shadow-md"
                    title="Verify Order QR"
                >
                    <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    <span className="hidden sm:inline">Scan QR</span>
                </Link>

                {/* View as Customer */}
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 bg-white/60 hover:bg-white border border-[#7f3b2d]/20 text-[#7f3b2d] rounded-full transition-all text-[10px] lg:text-xs font-bold tracking-wider uppercase group shadow-sm"
                >
                    <ExternalLink className="w-3 h-3 group-hover:scale-110 transition-transform text-[#7f3b2d]" />
                    <span className="hidden sm:inline">View Site</span>
                </Link>

                {/* User Info */}
                <div className="flex items-center gap-3 lg:gap-4 pl-3 lg:pl-6 border-l border-[#7f3b2d]/10">
                    <Link href="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="text-right hidden sm:block">
                            <p className="font-serif font-bold text-[#7f3b2d] text-sm leading-tight">{profile?.full_name || user?.email}</p>
                            <p className="text-[10px] text-[#7f3b2d]/70 uppercase tracking-widest font-semibold">{profile?.role || 'Admin'}</p>
                        </div>
                        {profile?.avatar_url ? (
                            <img
                                src={profile.avatar_url}
                                alt={profile.full_name || 'Admin'}
                                className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover border-2 border-[#7f3b2d]/20"
                            />
                        ) : (
                            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[#7f3b2d] flex items-center justify-center border-2 border-white shadow-md">
                                <User className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                            </div>
                        )}
                    </Link>

                    {/* Sign Out */}
                    <button
                        onClick={handleSignOut}
                        className="p-2 lg:p-2.5 hover:bg-red-50 text-[#7f3b2d]/60 hover:text-red-600 rounded-full transition-colors border border-transparent hover:border-red-200"
                        title="Sign Out"
                    >
                        <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
