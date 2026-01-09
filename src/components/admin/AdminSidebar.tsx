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
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

interface AdminSidebarProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Revenue', href: '/admin/revenue', icon: DollarSign },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Menu', href: '/admin/menu', icon: Coffee },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Workshops', href: '/admin/workshops', icon: GraduationCap },
    { name: 'Gallery', href: '/admin/gallery', icon: Palette },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell },
];

export default function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
    const pathname = usePathname();

    return (
        <div
            className={`fixed left-0 top-0 h-full bg-[#1a202c] text-white transition-all duration-300 z-30 ${isOpen ? 'w-64' : 'w-20'
                }`}
        >
            {/* Logo & Toggle */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
                {isOpen && (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#8B6F47] rounded-lg flex items-center justify-center">
                            <Coffee className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">Rabuste</h1>
                            <p className="text-xs text-gray-400">Admin Portal</p>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                    {isOpen ? (
                        <ChevronLeft className="w-5 h-5" />
                    ) : (
                        <ChevronRight className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Navigation */}
            <nav className="mt-6 px-3">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-3 mb-1 rounded-lg transition-all group ${isActive
                                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#8B6F47] text-white shadow-lg'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                            {isOpen && (
                                <span className="font-medium text-sm">{item.name}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            {isOpen && (
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
                    <div className="text-xs text-gray-400 text-center">
                        <p>Rabuste Coffee</p>
                        <p className="mt-1">Admin v1.0</p>
                    </div>
                </div>
            )}
        </div>
    );
}
