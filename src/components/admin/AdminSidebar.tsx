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
    Gift,
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
    { name: 'Coupons', href: '/admin/coupons', icon: Gift },
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
                className={`fixed left-0 top-0 h-full bg-[#fff9eb] border-r border-[#8B6F47]/20 text-[#7f3b2d] z-40 transition-all duration-500 ease-in-out
                    ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 lg:translate-x-0 lg:w-20'}
                `}
                onMouseEnter={() => window.innerWidth >= 1024 && setIsOpen(true)}
                onMouseLeave={() => window.innerWidth >= 1024 && setIsOpen(false)}
            >
                {/* Logo & Toggle */}
                <div className="h-16 lg:h-20 flex items-center justify-between px-4 border-b border-[#8B6F47]/20 overflow-hidden whitespace-nowrap">
                    <div className={`flex items-center gap-3 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-100'}`}>
                        <div className="relative w-12 h-12 flex-shrink-0 bg-[#7f3b2d] rounded-full p-2 shadow-sm">
                            <img
                                src="/Rabuste logo.png"
                                alt="Rabuste Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                            <h1 className="font-display text-2xl font-bold tracking-tight text-[#7f3b2d]">Rabuste</h1>
                            <p className="text-[10px] text-[#7f3b2d] uppercase tracking-widest font-sans font-bold">Admin Portal</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="mt-6 px-3">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.href === '/admin'
                            ? pathname === '/admin'
                            : (pathname === item.href || pathname.startsWith(item.href + '/'));

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-xl transition-all group border overflow-hidden whitespace-nowrap ${isActive
                                    ? 'bg-[#7f3b2d] border-[#7f3b2d] text-[#fff9eb] shadow-md font-bold'
                                    : 'border-transparent text-[#7f3b2d] hover:bg-[#8B6F47]/10 hover:text-[#7f3b2d] hover:border-[#8B6F47]/5'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#fff9eb]' : 'text-[#7f3b2d] group-hover:text-[#7f3b2d]'}`} />
                                <span
                                    className={`font-serif tracking-wide text-[17px] transition-all duration-300 ${isActive ? 'font-bold' : 'font-medium'
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
                <div className={`absolute bottom-0 left-0 right-0 p-6 border-t border-[#8B6F47]/20 bg-[#ebdcc8] overflow-hidden whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
                    }`}>
                    <div className="text-sm text-[#7f3b2d] text-center font-serif">
                        <p className="font-bold">Rabuste Coffee Dashboard</p>
                        <p className="mt-1 opacity-90 text-xs font-sans">v2.0 • Premium Admin</p>
                    </div>
                </div>
            </div>
        </>
    );
}
