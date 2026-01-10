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
        <div className="h-16 lg:h-20 bg-[#F9F5F1]/80 backdrop-blur-md border-b border-[#4A3B28]/10 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
            {/* Left Side - Page Title & Mobile Menu */}
            <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <button 
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-[#4A3B28] hover:bg-[#4A3B28]/5 rounded-lg lg:hidden"
                >
                    <Menu className="w-6 h-6" />
                </button>

                <div>
                    <h2 className="text-xl lg:text-2xl font-display font-bold text-[#4A3B28]">
                        Admin <span className="hidden sm:inline">Dashboard</span>
                    </h2>
                    <p className="text-[10px] lg:text-xs text-[#4A3B28]/70 font-sans tracking-wide font-medium">Manage your coffee empire</p>
                </div>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center gap-3 lg:gap-6">
                {/* View as Customer */}
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 bg-white/50 hover:bg-white border border-[#4A3B28]/20 text-[#4A3B28] rounded-full transition-all text-[10px] lg:text-xs font-bold tracking-wider uppercase group shadow-sm"
                >
                    <ExternalLink className="w-3 h-3 group-hover:scale-110 transition-transform text-[#4A3B28]" />
                    <span className="hidden sm:inline">View Site</span>
                </Link>

                {/* User Info */}
                <div className="flex items-center gap-3 lg:gap-4 pl-3 lg:pl-6 border-l border-[#4A3B28]/10">
                    <Link href="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="text-right hidden sm:block">
                            <p className="font-serif font-bold text-[#4A3B28] text-sm leading-tight">{profile?.full_name || user?.email}</p>
                            <p className="text-[10px] text-[#4A3B28]/70 uppercase tracking-widest font-semibold">{profile?.role || 'Admin'}</p>
                        </div>
                        {profile?.avatar_url ? (
                            <img
                                src={profile.avatar_url}
                                alt={profile.full_name || 'Admin'}
                                className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover border-2 border-[#4A3B28]/20"
                            />
                        ) : (
                            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[#4A3B28] flex items-center justify-center border-2 border-white shadow-md">
                                <User className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                            </div>
                        )}
                    </Link>

                    {/* Sign Out */}
                    <button
                        onClick={handleSignOut}
                        className="p-2 lg:p-2.5 hover:bg-red-50 text-[#4A3B28]/60 hover:text-red-600 rounded-full transition-colors border border-transparent hover:border-red-200"
                        title="Sign Out"
                    >
                        <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
