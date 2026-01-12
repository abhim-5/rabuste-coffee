// Admin Sidebar Component
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    DollarSign,
    ShoppingBag,
    Coffee,
    Users,
    GraduationCap,
    Palette,
    Bell,
    Award,
    ChevronLeft,
    ChevronRight,
    MessageSquare,
    Brain
} from 'lucide-react';

interface AdminSidebarProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Menu', href: '/admin/menu', icon: Coffee },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Workshops', href: '/admin/workshops', icon: GraduationCap },
    { name: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
    { name: 'Gallery', href: '/admin/gallery', icon: Palette },
    { name: 'Points System', href: '/admin/points', icon: Award },
    { name: 'AI Analytics', href: '/admin/ai-analytics', icon: Brain },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell },
];

export default function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed left-0 top-0 h-full bg-[#F9F5F1] border-r border-[#8B6F47]/20 text-[#4A3B28] z-40 transition-all duration-500 ease-in-out
                    ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 lg:translate-x-0 lg:w-20'}
                `}
                onMouseEnter={() => window.innerWidth >= 1024 && setIsOpen(true)}
                onMouseLeave={() => window.innerWidth >= 1024 && setIsOpen(false)}
            >
                {/* Logo & Toggle */}
                <div className="h-16 lg:h-20 flex items-center justify-between px-4 border-b border-[#8B6F47]/20 overflow-hidden whitespace-nowrap">
                    <div className={`flex items-center gap-3 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-100'}`}>
                        <div className="relative w-10 h-10 flex-shrink-0">
                            <img
                                src="/Rabuste logo.png"
                                alt="Rabuste Logo"
                                className="w-full h-full object-contain drop-shadow-md"
                            />
                        </div>
                        <div className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                            <h1 className="font-display text-2xl font-bold tracking-tight text-[#4A3B28]">Rabuste</h1>
                            <p className="text-[10px] text-[#8B6F47] uppercase tracking-widest font-sans font-semibold">Admin Portal</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="mt-8 px-3">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3.5 mb-2 rounded-xl transition-all group border overflow-hidden whitespace-nowrap ${isActive
                                    ? 'bg-white/40 border-[#4A3B28]/10 text-[#4A3B28] shadow-sm font-bold'
                                    : 'border-transparent text-[#4A3B28]/80 hover:bg-white/20 hover:text-[#4A3B28] hover:border-[#4A3B28]/5'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#4A3B28]' : 'text-[#4A3B28]/60 group-hover:text-[#4A3B28]'}`} />
                                <span
                                    className={`font-serif tracking-wide text-sm transition-all duration-300 ${isActive ? 'font-bold' : 'font-medium'
                                        } ${isOpen ? 'opacity-100 w-auto translator-x-0 delay-100' : 'opacity-0 w-0 -translate-x-4'
                                        }`}
                                >
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className={`absolute bottom-0 left-0 right-0 p-6 border-t border-[#4A3B28]/10 bg-[#D8CBB8] overflow-hidden whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
                    }`}>
                    <div className="text-xs text-[#4A3B28]/60 text-center font-serif">
                        <p className="font-semibold">Rabuste Coffee Dashboard</p>
                        <p className="mt-1 opacity-70">v2.0 • Premium Admin</p>
                    </div>
                </div>
            </div>
        </>
    );
}
